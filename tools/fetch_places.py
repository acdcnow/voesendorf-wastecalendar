#!/usr/bin/env python3
"""Resolve the standorte of the extra waste services to coordinates.

Reads the container / Müllinsel lists from the official data set and looks the
named places (ASZ, Feuerwehrhaus, Karglhaus, ...) up in OpenStreetMap via
Overpass.  Street based container sites take their position from
``data/streets.geojson``, so no extra lookup is needed for them.

Writes:
  data/places.json                     machine readable list (used by tooling)
  packages/voesendorf_places.yaml      ready to use Home Assistant package

Usage:
  python tools/fetch_places.py            # use the Overpass cache when present
  python tools/fetch_places.py --refresh  # query Overpass again
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
STREETS = ROOT / "data" / "streets.geojson"
CACHE = ROOT / "build" / "overpass_places.json"
NOMINATIM_CACHE = ROOT / "build" / "nominatim_places.json"
OUT_JSON = ROOT / "data" / "places.json"
OUT_PACKAGE = ROOT / "packages" / "voesendorf_places.yaml"

OVERPASS = "https://overpass-api.de/api/interpreter"
NOMINATIM = "https://nominatim.openstreetmap.org"

# One entry per place we want on the map.
#   street:      position comes from data/streets.geojson (street name)
#   settlement:  position comes from the settlement polygon of that name
#   osm_name:    regex matched against OSM names inside the municipality
#   nominatim:   free text address, geocoded once and cached
#   area:        which Abfuhrgebiet the place belongs to (None = whole village)
#   kind:        used for the marker icon and for grouping in the docs
PLACES: list[dict] = [
    # ---- Altstoffsammelzentrum -------------------------------------------------
    # Address from voesendorf.gv.at (Wirtschaftshof, Johannisweg 1); OSM has no
    # ASZ inside Voesendorf, so the address is geocoded instead.
    {
        "id": "asz",
        "name": "Altstoffsammelzentrum (ASZ)",
        "kind": "asz",
        "icon": "mdi:recycle",
        "nominatim": "Johannisweg 1, 2331 Vösendorf, Austria",
        "area": None,
        "note": "Johannisweg 1 (Wirtschaftshof) - Mo-Do 10-15, Fr 10-12, Sa 8-12 Uhr",
    },
    # ---- Blumenerde-Aktion -----------------------------------------------------
    # The calendar names three sites; the Karglhaus is not in OSM and not in the
    # municipal address list, so it is left out instead of guessing.
    {
        "id": "blumenerde-feuerwehrhaus",
        "name": "Blumenerde: Feuerwehrhaus",
        "kind": "blumenerde",
        "icon": "mdi:flower",
        "osm_name": r"FF Vösendorf|Freiwillige Feuerwehr Vösendorf",
        "area": None,
        "note": "Blumenerde-Aktion: 11.04. und 09.05., Ersatz 18.04. und 16.05., 10-13 Uhr",
    },
    {
        "id": "blumenerde-benyasiedlung",
        "name": "Blumenerde: Benyasiedlung",
        "kind": "blumenerde",
        "icon": "mdi:flower",
        "settlement": "Benyasiedlung",
        "area": "oberort",
        "note": "Blumenerde-Aktion: 11.04. und 09.05., Ersatz 18.04. und 16.05., 10-13 Uhr",
    },
    # ---- Müllinseln ------------------------------------------------------------
    {
        "id": "muellinsel-benyasiedlung",
        "name": "Müllinsel Benyasiedlung",
        "kind": "muellinsel",
        "icon": "mdi:trash-can",
        "street": None,
        "settlement": "Benyasiedlung",
        "area": "oberort",
        "note": "Müllinsel mit Restmüll, Bio und Kartonagen",
    },
    # ---- Grünschnittcontainer Oberort -----------------------------------------
    {
        "id": "gruenschnitt-franz-spiegel-gasse",
        "name": "Grünschnittcontainer Franz Spiegel-Gasse",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "street": "Franz Spiegel-Gasse",
        "area": "oberort",
    },
    {
        "id": "gruenschnitt-konsumstrasse",
        "name": "Grünschnittcontainer Konsumstraße",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "street": "Konsumstraße",
        "area": "oberort",
    },
    {
        "id": "gruenschnitt-mitterberggasse",
        "name": "Grünschnittcontainer Mitterberggasse",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "street": "Mitterberggasse",
        "area": "oberort",
    },
    # ---- Grünschnittcontainer Unterort ----------------------------------------
    {
        "id": "gruenschnitt-brunnerweg",
        "name": "Grünschnittcontainer Brunnerweg",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "street": "Brunnerweg",
        "area": "unterort",
    },
    {
        "id": "gruenschnitt-lindengasse",
        "name": "Grünschnittcontainer Lindengasse",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "street": "Lindengasse",
        "area": "unterort",
    },
    {
        "id": "gruenschnitt-schoenbrunner-allee",
        "name": "Grünschnittcontainer Schönbrunner Allee",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "street": "Schönbrunner Allee",
        "area": "unterort",
    },
    {
        "id": "gruenschnitt-bachgasse",
        "name": "Grünschnittcontainer Bachgasse",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "street": "Bachgasse",
        "area": "unterort",
        "note": "im PDF als \"Badgasse\" gedruckt, laut Gemeinde-Website Schlossplatz/Bachgasse",
    },
    {
        "id": "gruenschnitt-friedhof",
        "name": "Grünschnittcontainer Friedhof",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "osm_name": r"Friedhof Vösendorf",
        "area": "unterort",
    },
    {
        "id": "gruenschnitt-schloss",
        "name": "Grünschnittcontainer Schloss/Parkplatz",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "street": "Schlossplatz",
        "area": "unterort",
    },
    {
        "id": "gruenschnitt-pflegezentrum",
        "name": "Grünschnittcontainer NÖ Pflege- und Betreuungszentrum",
        "kind": "gruenschnitt",
        "icon": "mdi:tree",
        "osm_name": r"NÖ Pflege und Betreuungszentrum Vösendorf",
        "area": "unterort",
    },
]

AREA_NAMES = {"oberort": "Oberort", "unterort": "Unterort", "seepark": "Seepark"}
KIND_LABELS = {
    "asz": "Altstoffsammelzentrum",
    "blumenerde": "Blumenerde-Aktion",
    "muellinsel": "Müllinsel",
    "gruenschnitt": "Grünschnittcontainer",
}


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def street_points(streets: dict) -> dict[str, tuple[float, float]]:
    """Mid point of the longest line of every street (lat, lon)."""
    best: dict[str, tuple[float, list]] = {}
    for feature in streets["features"]:
        props = feature.get("properties") or {}
        geometry = feature.get("geometry") or {}
        name = props.get("street")
        if not name or geometry.get("type") != "LineString":
            continue
        line = geometry["coordinates"]
        if len(line) < 2:
            continue
        if name not in best or len(line) > len(best[name][1]):
            best[name] = (props.get("zone"), line)
    points = {}
    for name, (_, line) in best.items():
        middle = line[len(line) // 2]
        points[name] = (middle[1], middle[0])
    return points


def settlement_points(streets: dict) -> dict[str, tuple[float, float]]:
    """Centroid of every settlement polygon, keyed by the printed name."""
    points = {}
    for feature in streets["features"]:
        props = feature.get("properties") or {}
        geometry = feature.get("geometry") or {}
        if props.get("kind") != "settlement" or geometry.get("type") != "Polygon":
            continue
        ring = geometry["coordinates"][0]
        lats = [point[1] for point in ring]
        lons = [point[0] for point in ring]
        label = props.get("street") or ""
        # "Anton Benya-Wohnhausanlage" is printed as Benyasiedlung on the calendar
        key = "Benyasiedlung" if "Benya" in label else label
        points[key] = (sum(lats) / len(lats), sum(lons) / len(lons))
    return points


def overpass_places(refresh: bool) -> list[dict]:
    """Every named POI we care about, scoped to the Vösendorf boundary.

    A bounding box would spill into Mödling, Wiener Neudorf and Brunn am
    Gebirge (their ASZ is 4 km away), so the administrative boundary is used.
    """
    if CACHE.exists() and not refresh:
        return load_json(CACHE)["elements"]
    names = "Sammelzentrum|Kargl|Friedhof|Bachgasse|Pflege|Betreuung|FF V"
    query = (
        "[out:json][timeout:90];"
        'area["name"="V\u00f6sendorf"]["boundary"="administrative"]->.v;'
        "("
        'nwr["amenity"="fire_station"](area.v);'
        'nwr["amenity"="grave_yard"](area.v);'
        f'nwr["name"~"{names}",i](area.v);'
        ");out center tags;"
    )
    payload = fetch_json(
        OVERPASS,
        query.encode("utf-8"),
        "application/x-www-form-urlencoded",
    )
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(payload, ensure_ascii=False, indent=1), encoding="utf-8")
    return payload["elements"]


def nominatim_place(query: str, refresh: bool) -> tuple[float, float, str] | None:
    if NOMINATIM_CACHE.exists() and not refresh:
        cached = load_json(NOMINATIM_CACHE)
    else:
        cached = {}
    if query in cached:
        hit = cached[query]
        return (hit["lat"], hit["lon"], hit["display"]) if hit else None

    params = urllib.parse.urlencode(
        {"format": "jsonv2", "limit": 1, "countrycodes": "at", "q": query}
    )
    results = fetch_json(f"{NOMINATIM}/search?{params}")
    hit = None
    if results:
        hit = {
            "lat": float(results[0]["lat"]),
            "lon": float(results[0]["lon"]),
            "display": results[0]["display_name"],
        }
    cached[query] = hit
    NOMINATIM_CACHE.parent.mkdir(parents=True, exist_ok=True)
    NOMINATIM_CACHE.write_text(
        json.dumps(cached, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    return (hit["lat"], hit["lon"], hit["display"]) if hit else None


def fetch_json(url: str, data: bytes | None = None, content_type: str | None = None):
    headers = {"User-Agent": "voesendorf-wastecalendar/1.0 (data build script)"}
    if content_type:
        headers["Content-Type"] = content_type
    request = urllib.request.Request(url, data=data, headers=headers)
    with urllib.request.urlopen(request, timeout=120) as response:
        return json.loads(response.read().decode("utf-8"))


def osm_match(entry: dict, elements: list[dict]) -> tuple[float, float, str] | None:
    pattern = re.compile(entry.get("osm_name", ""), re.I)
    candidates = []
    for element in elements:
        tags = element.get("tags") or {}
        name = tags.get("name", "")
        if not name or not pattern.search(name):
            continue
        lat = element.get("lat") or (element.get("center") or {}).get("lat")
        lon = element.get("lon") or (element.get("center") or {}).get("lon")
        if lat is None or lon is None:
            continue
        candidates.append((name, lat, lon, element["type"] + "/" + str(element["id"])))
    if not candidates:
        return None
    # Deterministic: the shortest name (and then the lowest id) wins.
    candidates.sort(key=lambda item: (len(item[0]), item[3]))
    return candidates[0][1], candidates[0][2], "openstreetmap:" + candidates[0][3]


def build(refresh: bool) -> list[dict]:
    streets = load_json(STREETS)
    street_pt = street_points(streets)
    settlement_pt = settlement_points(streets)
    elements = overpass_places(refresh)

    places: list[dict] = []
    missing: list[str] = []
    for entry in PLACES:
        lat = lon = None
        source = ""
        if entry.get("street"):
            point = street_pt.get(entry["street"])
            if point:
                lat, lon = point
                source = f"streets.geojson:{entry['street']}"
        elif entry.get("settlement"):
            point = settlement_pt.get(entry["settlement"])
            if point:
                lat, lon = point
                source = f"streets.geojson:{entry['settlement']}"
        elif entry.get("nominatim"):
            hit = nominatim_place(entry["nominatim"], refresh)
            if hit:
                lat, lon = hit[0], hit[1]
                source = f"nominatim:{entry['nominatim']} ({hit[2].split(',')[0]})"
        else:
            match = osm_match(entry, elements)
            if match:
                lat, lon, source = match
        if lat is None:
            missing.append(entry["id"])
            continue

        area = entry.get("area")
        state = AREA_NAMES.get(area or "", "Gemeindegebiet")
        place = {
            "id": entry["id"],
            "name": entry["name"],
            "kind": entry["kind"],
            "kind_label": KIND_LABELS[entry["kind"]],
            "icon": entry["icon"],
            "latitude": round(lat, 6),
            "longitude": round(lon, 6),
            "area": area,
            "area_label": AREA_NAMES.get(area or "", "Gemeindegebiet"),
            "state": state,
            "note": entry.get("note", ""),
            "source": source,
        }
        places.append(place)

    if missing:
        print("WARN  no position found for: " + ", ".join(missing), file=sys.stderr)
    return places


def package_yaml(places: list[dict]) -> str:
    lines = [
        "# Vösendorf: Standorte der Zusatzservices (ASZ, Blumenerde-Aktion, Müllinseln,",
        "# Grünschnittcontainer) für die Karte im Dashboard.",
        "#",
        "# Erzeugt von tools/fetch_places.py - nicht von Hand bearbeiten.",
        "#",
        "# Einbinden über configuration.yaml:",
        "#   homeassistant:",
        "#     packages: !include_dir_named packages",
        "#",
        "# Die Sensoren haben nur eine Aufgabe: sie tragen latitude/longitude als",
        "# Attribute, damit die eingebaute Kartenkarte (type: map) sie als Marker zeigt.",
        "template:",
        "  - sensor:",
    ]
    for place in sorted(places, key=lambda item: (item["kind"], item["name"])):
        state = place["state"].replace('"', "'")
        lines += [
            f"      # {place['kind_label']}"
            + (f" – {place['area_label']}" if place["area_label"] != "Gemeindegebiet" else ""),
            f"      - name: {yaml_str(place['name'])}",
            f"        unique_id: voesendorf_place_{place['id'].replace('-', '_')}",
            f"        icon: {place['icon']}",
            f"        state: {yaml_str(state)}",
            "        attributes:",
            f"          latitude: {place['latitude']}",
            f"          longitude: {place['longitude']}",
            f"          art: {yaml_str(place['kind_label'])}",
            f"          bereich: {yaml_str(place['area_label'])}",
        ]
        if place["note"]:
            lines.append(f"          hinweis: {yaml_str(place['note'])}")
        lines.append(f"          quelle: {yaml_str(place['source'])}")
    lines.append("")
    return "\n".join(lines)


def yaml_str(value: str) -> str:
    return '"' + value.replace("\\", "\\\\").replace('"', '\\"') + '"'


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--refresh", action="store_true", help="query Overpass again")
    args = parser.parse_args()

    places = build(args.refresh)
    OUT_JSON.write_text(
        json.dumps({"places": places}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8"
    )
    OUT_PACKAGE.parent.mkdir(parents=True, exist_ok=True)
    OUT_PACKAGE.write_text(package_yaml(places), encoding="utf-8")

    for place in places:
        print(
            f"OK   {place['id']:<38} {place['latitude']:.5f},{place['longitude']:.5f}"
            f"  {place['source']}"
        )
    print(f"\n{len(places)} places -> {OUT_JSON.relative_to(ROOT)}, "
          f"{OUT_PACKAGE.relative_to(ROOT)}")
    return 0 if places else 1


if __name__ == "__main__":
    raise SystemExit(main())
