# Abfallkalender Vösendorf (Müllabfuhr-Termine 2026)

Aufbereitete Müllabfuhr-Termine der Marktgemeinde **Vösendorf** (2331, Niederösterreich) –
als ICS-Kalender, JSON-Datensatz und fertige Home-Assistant-Karte mit Karte der drei
Abfuhrgebiete.

**Offizielle Quelle:** <https://voesendorf.gv.at/buergerservice/muellkalender/>
(Müllabfuhrplan als PDF, jeweils im Bereich „Downloads“)

> ⚠️ **Kein offizielles Angebot der Marktgemeinde.** Die Daten wurden aus dem amtlichen
> PDF-Kalender maschinell ausgelesen und geprüft. Für verbindliche Termine ist immer die
> Gemeinde bzw. das PDF maßgeblich.

---

## Inhalt

| Datei | Zweck |
| --- | --- |
| `Abfallkalender_Voesendorf_Oberort_2026.ics` | Kalender Abfuhrgebiet **Oberort** (80 Termine) |
| `Abfallkalender_Voesendorf_Unterort_2026.ics` | Kalender Abfuhrgebiet **Unterort** |
| `Abfallkalender_Voesendorf_Seepark_2026.ics` | Kalender Abfuhrgebiet **Seepark** |
| `data/voesendorf_waste_2026.json` | Alle Termine, Straßenlisten, Feiertage, Zusatzinfos |
| `data/streets.geojson` | Straßengeometrien je Abfuhrgebiet (OpenStreetMap) für die Karte |
| `dist/voesendorf-waste-card.js` | Fertige Lovelace-Karte (eigenständig, keine Integration nötig) |
| `tools/` | Skripte, mit denen die Daten aus dem PDF erzeugt werden |
| `waste_collection_schedule/source/voesendorf_at.py` | Quelle für die Integration `waste_collection_schedule` |

---

## Welches Abfuhrgebiet ist mein Gebiet?

Die Gemeinde teilt Vösendorf in drei Abfuhrgebiete. Entscheidend ist die **Straße**
(nicht die Hausnummer).

### Oberort – Restmüll und Biomüll: Dienstag / Mittwoch
`Am Haidegrund`, `Am Petersbach`, `Baslergasse`, `Böheimgasse`,
`Doktor-Robert-Firneis-Straße`, `Dr. Karl Renner-Gasse`, `Dr. Pertich-Gasse`,
`Franz Gruber-Gasse`, `Franz Schubert-Gasse`, `Franz Spiegel-Gasse`,
`Fritz Schmerold-Gasse`, `Haidfeldstraße`, `Heinrich Tröber-Gasse`,
`Jakob Janisch-Gasse`, `Karl Weiss-Gasse`, `Konsumstraße`, `Leopold Mandl-Gasse`,
`Marktstraße`, `Mitterberggasse`, `Raimundgasse`, `Rossödengasse`, `Schweizer Gasse`,
`Sperlinggasse`, `Stefan Brauneder-Gasse`, `Leopold Stipcak-Gasse`, `Triester Straße`,
`Weinberggasse`, `Willi Hafenscher-Gasse`;
Siedlungen: `Haidfeldsiedlung`, `Kalesasiedlung`, `Roseggersiedlung`, `Benyasiedlung`;
außerdem die **Ortsstraße von der Badner Bahn bis zur Pizzeria Fontana** und die
**Schönbrunner Allee von der Pizzeria Fontana bis zur Badner Bahn**.

### Unterort – Restmüll und Biomüll: Dienstag / Mittwoch
`Bachgasse`, `Birkenweg`, `Brunnerweg`, `Föhrengasse`, `Freiheitsstraße`,
`Hutweidenweg`, `Jordanstraße`, `Kindbergstraße`, `Klausengasse`, `Laxenburger Straße`,
`Lindengasse`, `Meisengasse`, `Mühlfeldgasse`, `Mühlgasse`, `Roßdorfstraße`,
`Schlossplatz`, `Taubengasse`, `Zeisiggasse`;
Siedlungen: `Jordansiedlung`, `Tröbersiedlung`;
außerdem die **Ortsstraße von der Pizzeria Fontana bis zur Laxenburger Straße** und die
**Schönbrunner Allee von der Pizzeria Fontana bis zur Tröbersiedlung**.

### Seepark – Restmüll Montag, Biomüll Dienstag
Die **Seeparksiedlung** im Südosten: `Seeparkstraße`, `Strandstraße`, `Seeweg`,
`Fischerstraße`, `Zum Anningerblick`.

**Hinweise zu Unklarheiten**

* `Ortsstraße` und `Schönbrunner Allee` gehören **zu zwei Gebieten**. Die Grenze liegt bei
  der Pizzeria Fontana (Ortsstraße 71). Die Karte stellt diese beiden Straßen daher grau
  dar – im Zweifel bitte bei der Gemeinde nachfragen.
* Die **Benyasiedlung** (Anton-Benya-Straße) wird im Kalender 2026 auf der Seepark-Seite
  geführt (dort nur wegen der Müllinseln), die Gemeinde-Website nennt die
  Anton-Benya-Straße unter **Oberort**. Hier ist sie Oberort zugeordnet.
* Das **Seepark-Viertel** fehlt auf der Gemeinde-Website noch; die Termine stammen aus dem
  PDF-Kalender (Seiten 6 und 7).

---

## In Home Assistant verwenden

### Variante A – Kalender (ohne Zusatz-Integration)

Die ICS-Dateien lassen sich in jeden Kalender-Client einbinden (Home Assistant Kalender,
Google, Apple, Thunderbird). Roh-URL z. B.:

```
https://raw.githubusercontent.com/acdcnow/voesendorf-wastecalendar/main/Abfallkalender_Voesendorf_Oberort_2026.ics
```

### Variante B – `waste_collection_schedule` mit der eingebauten ICS-Quelle

Der einfachste Weg zu Sensoren wie „Restmüll in 3 Tagen“:

```yaml
# configuration.yaml
waste_collection_schedule:
  sources:
    - name: ics
      args:
        url: https://raw.githubusercontent.com/acdcnow/voesendorf-wastecalendar/main/Abfallkalender_Voesendorf_Oberort_2026.ics
```

Für ein anderes Gebiet einfach `Unterort` bzw. `Seepark` im Dateinamen verwenden.
Über `customize` lassen sich die Einträge umbenennen oder ausblenden.

### Variante C – `waste_collection_schedule`-Quelle `voesendorf_at`

Die Datei `waste_collection_schedule/source/voesendorf_at.py` ist für einen Beitrag zur
Integration vorbereitet (Details: [`docs/UPSTREAM.md`](docs/UPSTREAM.md)). Nach dem
Upstream-Merge genügt:

```yaml
waste_collection_schedule:
  sources:
    - name: voesendorf_at
      args:
        zone: oberort      # oberort | unterort | seepark
```

### Variante D – Eigene Lovelace-Karte (mit Karte der Gebiete)

`dist/voesendorf-waste-card.js` ist eine **eigenständige Karte**: sie enthält die Termine
des laufenden Jahres und braucht **keine Integration**. Sie zeigt:

* die nächsten Abholungen („morgen“, „in 3 Tagen“),
* eine Jahresübersicht in den Farben des amtlichen PDFs,
* eine Karte mit allen drei Abfuhrgebieten (Straßen farbig, geteilte Straßen grau),
  gezeichnet aus den mitgelieferten Straßengeometrien – **ohne Kartenkacheln und ohne
  Netzzugriff**,
* Straßen-Auswahl (wird im Browser gespeichert),
* Zusatzinfos: Altstoffsammelzentrum, Sperrmüll, Blumenerde-Aktion.

**Einbau**

1. `voesendorf-waste-card.js` nach `config/www/` kopieren und als Ressource registrieren
   (Einstellungen → Dashboards → Ressourcen), oder das Repository in HACS als *Dashboard*
   hinzufügen:

   ```yaml
   url: /local/voesendorf-waste-card.js
   type: module
   ```

2. Karte auf ein Dashboard legen:

   ```yaml
   type: custom:voesendorf-waste-card
   zone: oberort           # auto | oberort | unterort | seepark
   street: Marktstraße     # optional: die Straße bestimmt das Gebiet automatisch
   show_map: true
   days_ahead: 6
   ```

> **Warum keine Kartenkacheln?** Die freiwillig betriebenen Server von
> `tile.openstreetmap.org` sind nicht für eingebettete Karten gedacht und sperren solche
> Anfragen ([osm.wiki/Blocked](https://osm.wiki/Blocked)). Die Karte zeichnet die Straßen
> daher selbst – offline und ohne Sperre. Echte Kacheln sind trotzdem möglich: mit
> `tile_url` (z. B. eigener Tile-Server oder ein Anbieter, dessen Nutzungsbedingungen
> eingebettete Karten erlauben) wird Leaflet geladen; blockiert der Server, fällt die
> Karte automatisch auf die Offline-Darstellung zurück. Details in
> [`docs/CARD.md`](docs/CARD.md).

Alle Optionen stehen in [`docs/CARD.md`](docs/CARD.md).

---

## Datenmodell

`data/voesendorf_waste_2026.json`:

```jsonc
{
  "year": 2026,
  "zones": {
    "oberort": {
      "name": "Oberort",
      "weekday": { "RM": "Tue", "RM4": "Tue", "Bio": "Wed" },
      "streets": ["Am Haidegrund", "..."],
      "split_streets": { "Ortsstraße": "Badner Bahn bis Pizzeria Fontana" },
      "dates": {
        "RM":  ["2026-01-13", "..."],   // Restmüll 14-tägig, 26 Termine
        "RM4": ["2026-01-13", "..."],   // Restmüll 4-wöchig, 13 Termine
        "Bio": ["2026-01-14", "..."]    // Biomüll,           37 Termine
      }
    }
  },
  "holidays": [ { "date": "2026-01-01", "name": "Neujahr" } ],
  "extras": { "asz": {}, "sperrmuell": {}, "blumenerde": {} }
}
```

**Abfuhrrhythmen 2026**

* `RM` – Restmüll alle 2 Wochen (26 Termine im Jahr)
* `RM4` – Restmüll alle 4 Wochen; fällt immer auf einen `RM`-Tag (13 Termine)
* `Bio` – Biomüll: 14-tägig im Winter, **wöchentlich von Ende April bis Ende September**
* Feiertagsverschiebungen sind bereits eingerechnet, z. B. Unterort `06.01. → 07.01.` und
  `08.12. → 07.12.`, Seepark `25.05. → 26.05.` und `26.10. → 27.10.`

---

## Daten aktualisieren

Voraussetzungen: Python 3.11+ sowie `pip install pypdf pdfplumber`.

```bash
python tools/parse_calendar_pdf.py --year 2026      # PDF laden → build/schedule.json
python tools/build_data.py --year 2026              # + Straßenlisten → data/*.json
python tools/build_ics.py --year 2026               # → *.ics im Repo-Root
python tools/fetch_street_geometry.py --year 2026   # OpenStreetMap → data/streets.geojson
python tools/build_card.py --year 2026              # → dist/voesendorf-waste-card.js
python tests/test_upstream_source.py                # Gegenprobe der Upstream-Quelle
```

`parse_calendar_pdf.py` prüft sein Ergebnis selbst (Anzahl der Termine, Wochentage,
Feiertagsverschiebungen) und bricht bei Auffälligkeiten ab.

Der Parser nutzt einen Trick: im PDF ist **jede Tageszelle ein farbiges Rechteck**, dessen
Füllfarbe die Abfallart codiert (orange = Restmüll 14-tägig, violett = 4-wöchig,
grün = Biomüll). Die gedruckten Tageszahlen dienen als exakte Zeilenanker; benachbarte
Zellen gleicher Farbe sind im PDF zu einem breiten Rechteck zusammengefasst und werden
allen überdeckten Monatsspalten zugeordnet. Details im Kopf von
`tools/parse_calendar_pdf.py`.

Für ein neues Jahr außerdem anzupassen:

* `PDF_URL` in `tools/parse_calendar_pdf.py`
* `HOLIDAY_NAMES` / `NO_COLLECTION_HINTS` in `tools/build_data.py`
* ICS-Dateinamen (`<Gebiet>_<Jahr>.ics`), `--year` in allen Aufrufen und `DEFAULT_PDF_URL`
  in `waste_collection_schedule/source/voesendorf_at.py`

---

## Rechtliches / Quellen

* Termine und Straßenlisten: Marktgemeinde Vösendorf (amtlicher Müllabfuhrkalender)
* Kartendaten: © OpenStreetMap-Mitwirkende, [ODbL](https://www.openstreetmap.org/copyright),
  abgefragt über die Overpass-API
* Lizenz dieses Repositories: MIT (siehe [`LICENSE`](LICENSE))

## English quick start

Waste collection dates for the Austrian town of Vösendorf, extracted from the official PDF
calendar and verified.

* **Calendar files:** use the `.ics` files in the repository root (one per collection area:
  Oberort, Unterort, Seepark).
* **Home Assistant:** feed an ICS URL into the built-in `ics` source of
  `waste_collection_schedule`, or use the prepared source
  `waste_collection_schedule/source/voesendorf_at.py` (`zone: oberort|unterort|seepark`).
* **Custom Lovelace card:** copy `dist/voesendorf-waste-card.js` to `config/www/`, register it
  as a `module` resource and add `type: custom:voesendorf-waste-card` to a dashboard. The card
  bundles the calendar data and shows the next collections, a year overview and an
  OpenStreetMap map of the three collection areas - no integration required.
* **Which area is mine?** See the street lists above (`Oberort`, `Unterort`, `Seepark`).
