#!/usr/bin/env python3
"""Build data/voesendorf_waste_<year>.json from the parsed PDF + curated zone info.

Where the information comes from
--------------------------------
* collection dates ....... tools/parse_calendar_pdf.py (the official PDF grid)
* street lists ............ https://voesendorf.gv.at/buergerservice/muellkalender/
                            plus the street lists printed on PDF pages 3 / 5 / 7
* green-waste containers .. PDF pages 3 / 5 / 7
* Seepark street list ..... the streets inside OSM's "Seeparksiedlung" residential
                            area (the city page still only knows Oberort/Unterort,
                            the PDF only says "Seepark komplett")

Usage:  python tools/build_data.py [--year 2026] [--schedule build/schedule.json]
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib

ZONE_ORDER = ["oberort", "unterort", "seepark"]

ZONE_INFO = {
    "oberort": {
        "name": "Oberort",
        "description": "Nördlicher/westlicher Ortsteil, Triester Straße, Haidfeld- und Kalesasiedlung",
        "colours": {"RM": "#f0a000", "RM4": "#a78bfa", "Bio": "#7cb342"},
        "streets": [
            "Am Haidegrund", "Am Petersbach", "Baslergasse", "Böheimgasse",
            "Doktor-Robert-Firneis-Straße", "Dr. Karl Renner-Gasse", "Dr. Pertich-Gasse",
            "Franz Gruber-Gasse", "Franz Schubert-Gasse", "Franz Spiegel-Gasse",
            "Fritz Schmerold-Gasse", "Haidfeldstraße", "Heinrich Tröber-Gasse",
            "Jakob Janisch-Gasse", "Karl Weiss-Gasse", "Konsumstraße",
            "Leopold Mandl-Gasse", "Marktstraße", "Mitterberggasse", "Raimundgasse",
            "Rossödengasse", "Schweizer Gasse", "Sperlinggasse",
            "Stefan Brauneder-Gasse", "Leopold Stipcak-Gasse", "Triester Straße",
            "Weinberggasse", "Willi Hafenscher-Gasse",
            # settlements without their own street name
            "Haidfeldsiedlung", "Kalesasiedlung", "Roseggersiedlung",
        ],
        "split_streets": {
            "Ortsstraße": "Badner Bahn bis Pizzeria Fontana",
            "Schönbrunner Allee": "Pizzeria Fontana bis Badner Bahn",
        },
        "groups": [
            {"container": "Grünschnittcontainer",
             "places": ["Franz Spiegel-Gasse", "Konsumstraße", "Mitterberggasse"]},
        ],
        "notes": ["Kein Müllinsel-Standort im Abfuhrgebiet Oberort."],
    },
    "unterort": {
        "name": "Unterort",
        "description": "Südöstlicher Ortsteil rund um Schlossplatz, Laxenburger Straße und Roßdorfstraße",
        "colours": {"RM": "#f0a000", "RM4": "#a78bfa", "Bio": "#7cb342"},
        "streets": [
            "Bachgasse", "Birkenweg", "Brunnerweg", "Föhrengasse", "Freiheitsstraße",
            "Hutweidenweg", "Jordanstraße", "Kindbergstraße", "Klausengasse",
            "Laxenburger Straße", "Lindengasse", "Meisengasse", "Mühlfeldgasse",
            "Mühlgasse", "Roßdorfstraße", "Schlossplatz", "Taubengasse", "Zeisiggasse",
            "Jordansiedlung", "Tröbersiedlung",
        ],
        "split_streets": {
            "Ortsstraße": "Pizzeria Fontana bis Laxenburger Straße",
            "Schönbrunner Allee": "Pizzeria Fontana bis Tröbersiedlung",
        },
        "groups": [
            {"container": "Grünschnittcontainer",
             "places": ["Brunnerweg", "Badgasse", "Friedhof", "Lindengasse",
                        "Schloss/Parkplatz", "Schönbrunner Allee",
                        "NÖ Pflege- und Betreuungszentrum"]},
        ],
        "notes": [],
    },
    "seepark": {
        "name": "Seepark",
        "description": "Seeparksiedlung im Südosten (Seeparkstraße, Strandstraße, Seeweg)",
        "colours": {"RM": "#f0a000", "RM4": "#a78bfa", "Bio": "#7cb342"},
        "streets": [
            "Fischerstraße", "Seeparkstraße", "Seeweg", "Strandstraße",
            "Zum Anningerblick", "Seeparksiedlung",
        ],
        "split_streets": {},
        "groups": [
            {"container": "Grünschnittcontainer", "places": ["Seepark/Spitz"]},
            {"container": "Müllinseln", "places": ["Benyasiedlung"]},
            {"container": "Grünschnittcontainer Benyasiedlung",
             "places": ["Neuer Standort folgt 2026"]},
        ],
        "notes": [
            "Die Gemeinde-Website nennt das Seepark-Viertel noch nicht; dort ist die "
            "Seeparksiedlung nicht als eigenes Abfuhrgebiet angeführt.",
            "Die Benyasiedlung (Anton-Benya-Straße) wird auf der Seepark-Seite des "
            "Kalenders nur wegen der Müllinseln genannt - laut Gemeinde-Website zählt "
            "die Anton-Benya-Straße zum Abfuhrgebiet Oberort.",
        ],
    },
}

WASTE_TYPES = {
    "RM": {"name": "Restmüll", "short": "RM", "interval": "14-tägig",
           "description": "Restmülltonne, 14-tägige Abholung"},
    "RM4": {"name": "Restmüll (4-wöchig)", "short": "RM4", "interval": "4-wöchig",
            "description": "Restmülltonne mit 4-wöchigem Rhythmus; wird am selben Tag "
                           "wie die 14-tägige Sammlung abgeholt"},
    "Bio": {"name": "Biomüll", "short": "Bio", "interval": "14-tägig / wöchentlich",
            "description": "14-tägig im Winter, wöchentlich vom Frühjahr bis Ende September"},
}

HOLIDAY_NAMES = {
    "2026-01-01": "Neujahr",
    "2026-01-06": "Heilige Drei Könige",
    "2026-04-03": "Karfreitag",
    "2026-04-06": "Ostermontag",
    "2026-05-01": "Staatsfeiertag",
    "2026-05-14": "Christi Himmelfahrt",
    "2026-05-25": "Pfingstmontag",
    "2026-06-04": "Fronleichnam",
    "2026-10-26": "Nationalfeiertag",
    "2026-11-01": "Allerheiligen",
    "2026-12-08": "Mariä Empfängnis",
    "2026-12-25": "Christtag",
    "2026-12-26": "Stefanitag",
}

# days on which the municipality calendar is printed in red but which are not
# statutory holidays (the recycling centre is closed on those days)
NO_COLLECTION_HINTS = {
    "2026-02-17": "Faschingsdienstag",
    "2026-11-02": "Allerseelen",
    "2026-11-15": "Leopolditag",
    "2026-12-24": "Heiliger Abend",
    "2026-12-31": "Silvester",
}

ASZ = {
    "name": "Altstoffsammelzentrum (ASZ)",
    "hours": {
        "Montag bis Donnerstag": "10:00 - 15:00",
        "Freitag": "10:00 - 12:00",
        "Samstag": "08:00 - 12:00",
    },
    "note": "Letzte Einfahrt 15 Minuten vor Betriebsschluss. Ohne Entsorgungskarte und "
            "nur für Vösendorfer Haushalte.",
    "closed": [
        {"date": "2026-02-17", "label": "Faschingsdienstag"},
        {"date": "2026-04-03", "label": "Karfreitag"},
        {"date": "2026-11-02", "label": "Allerseelen"},
        {"date": "2026-11-15", "label": "Leopolditag"},
        {"date": "2026-12-24", "label": "Heiliger Abend"},
        {"date": "2026-12-31", "label": "Silvester"},
    ],
    "closed_note": "und an allen gesetzlichen Feiertagen",
}

SPERRMUELL = {
    "name": "Sperrmüllabholung",
    "note": "Einmal pro Jahr nach telefonischer Terminvereinbarung unter 01/699 03-35, "
            "Abholung an der Grundstücksgrenze.",
    "not_collected": ["Bauschutt", "Flüssigkeiten/Problemstoffe", "Grünschnitt",
                      "Plastik", "Kartonagen", "Sperrmüll von Mehrparteienhäusern"],
}

BLUMENERDE = {
    "name": "Blumenerde-Aktion 2026",
    "events": [
        {"date": "2026-04-11", "time": "10:00 - 13:00",
         "place": "Feuerwehrhaus, Karglhaus, Benyasiedlung"},
        {"date": "2026-05-09", "time": "10:00 - 13:00",
         "place": "Feuerwehrhaus, Karglhaus, Benyasiedlung"},
        {"date": "2026-04-18", "time": "10:00 - 13:00",
         "place": "Feuerwehrhaus, Karglhaus, Benyasiedlung", "replacement": True},
        {"date": "2026-05-16", "time": "10:00 - 13:00",
         "place": "Feuerwehrhaus, Karglhaus, Benyasiedlung", "replacement": True},
    ],
}


def holiday_name(date: dt.date) -> str | None:
    return HOLIDAY_NAMES.get(date.isoformat())


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--year", type=int, default=2026)
    ap.add_argument("--schedule", type=pathlib.Path, default=pathlib.Path("build/schedule.json"))
    ap.add_argument("--out", type=pathlib.Path, default=None)
    args = ap.parse_args()

    schedule = json.loads(args.schedule.read_text(encoding="utf-8"))
    out_path = args.out or pathlib.Path(f"data/voesendorf_waste_{args.year}.json")

    zones = {}
    for slug in ZONE_ORDER:
        info = ZONE_INFO[slug]
        parsed = schedule["zones"][slug]
        dates = {waste: parsed["dates"][waste] for waste in ("RM", "RM4", "Bio")}
        weekdays = {}
        for waste in ("RM", "RM4", "Bio"):
            counter = {}
            for iso in dates[waste]:
                day = dt.date.fromisoformat(iso).strftime("%a")
                counter[day] = counter.get(day, 0) + 1
            weekdays[waste] = max(counter, key=counter.get)
        zones[slug] = {
            "name": info["name"],
            "description": info["description"],
            "weekday": weekdays,
            "colours": info["colours"],
            "streets": info["streets"],
            "split_streets": info["split_streets"],
            "containers": info["groups"],
            "notes": info["notes"],
            "dates": dates,
        }

    holidays = [{"date": date, "name": name} for date, name in sorted(HOLIDAY_NAMES.items())]
    shift_days = [{"date": date, "name": name}
                  for date, name in sorted(NO_COLLECTION_HINTS.items())]

    payload = {
        "year": args.year,
        "municipality": "Marktgemeinde Vösendorf, 2331 Vösendorf, Schlossplatz 1",
        "sources": {
            "info_page": "https://voesendorf.gv.at/buergerservice/muellkalender/",
            "pdf": "https://voesendorf.gv.at/wp-content/uploads/2021/09/"
                   f"Muellkalender-{args.year}_web.pdf",
            "street_geometry": "OpenStreetMap (ODbL) via Overpass API",
        },
        "generated": dt.date.today().isoformat(),
        "legend": WASTE_TYPES,
        "zones": zones,
        "holidays": holidays,
        "no_collection_hints": shift_days,
        "extras": {
            "asz": ASZ,
            "sperrmuell": SPERRMUELL,
            "blumenerde": BLUMENERDE,
        },
    }

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"wrote {out_path}")
    for slug, zone in zones.items():
        print(f"  {zone['name']:9} streets={len(zone['streets']):2} "
              f"RM={len(zone['dates']['RM'])} RM4={len(zone['dates']['RM4'])} "
              f"Bio={len(zone['dates']['Bio'])} weekdays={zone['weekday']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
