# Changelog

Alle nennenswerten Änderungen an diesem Repository – jeweils auf Deutsch und Englisch.
Versionen folgen [SemVer](https://semver.org/lang/de/).

---

## [1.3.0] – 2026-09-20

### Deutsch

**Geändert**

* **Kompakte Karte:** Die Jahresübersicht über alle 12 Monate ist weg. Die Karte zeigt
  jetzt **nur den aktuellen Monat** als Kalender. Kleine Pfeile neben dem Monatsnamen
  blättern durch das Kalenderjahr (innerhalb 2026), ein Punkt-Button springt zum aktuellen
  Monat zurück.
* **Details im Popup:** Container im Gebiet, Hinweise und Zusatztermine (ASZ, Sperrmüll,
  Blumenerde) liegen hinter einem Info-Symbol in der Kopfzeile und öffnen sich als Dialog.
  Schließen mit ✕, Esc oder Klick daneben. Dadurch belegt die Karte auf dem Dashboard
  deutlich weniger Platz.
* Der Info-Button erscheint nur, wenn es etwas anzuzeigen gibt; mit `show_extras: false`
  fehlen die Zusatztermine weiterhin. Nach Mitternacht springt die Ansicht automatisch
  wieder auf den aktuellen Monat.

### English

**Changed**

* **Compact card:** the twelve-month year overview is gone. The card now shows a **single
  month** calendar. Small arrows next to the month name page through the calendar year
  (within 2026), a dot button jumps back to the current month.
* **Details in a popup:** containers, notes and extra dates (recycling centre, bulky waste,
  compost campaign) moved behind an info icon in the header and open as a dialog. Close it
  with ✕, Esc or a click outside. The card now uses far less dashboard space.
* The info button only appears when there is something to show; `show_extras: false` still
  hides the extra dates. After midnight the view snaps back to the current month.

[1.3.0]: https://github.com/acdcnow/voesendorf-wastecalendar/releases/tag/v1.3.0

---

## [1.2.0] – 2026-09-20

Erste veröffentlichte Version – vorher lag nur das amtliche PDF im Repository.
First published release.

### Deutsch

**Neu**

* **Amtliche Daten 2026 ausgelesen.** Der Müllabfuhrplan der Marktgemeinde Vösendorf wurde
  automatisch ausgewertet: alle drei Abfuhrgebiete (Oberort, Unterort, Seepark) mit je
  **76 Abholterminen** (26 × Restmüll 14-tägig, 13 × Restmüll 4-wöchig, 37 × Biomüll),
  inklusive Feiertagsverschiebungen (z. B. Unterort 06.01. → 07.01., 08.12. → 07.12.).
* **Kalenderdateien.** Je Abfuhrgebiet eine `.ics`-Datei mit 80 Terminen (inkl.
  Blumenerde-Aktion), RFC 5545, Zeitzone Europe/Vienna, gefaltet auf 75 Oktette – geeignet
  für Home Assistant, Google Kalender, Outlook …
* **JSON-Datensatz** `data/voesendorf_waste_2026.json` mit Terminen, Straßenlisten je
  Gebiet, Feiertagen, Containern und Zusatzinfos (ASZ, Sperrmüll, Blumenerde).
* **Lovelace-Karte** `dist/voesendorf-waste-card.js` (v1.2.0), eigenständig und ohne
  Integration nutzbar: nächste Abholungen, Jahresübersicht im Farbdesign des amtlichen
  PDFs, Karte der drei Gebiete, Straßenauswahl mit Speicherung im Browser, Zusatztermine.
  Umschaltbar zwischen Deutsch und Englisch.
* **Karte ohne Kartenkacheln (Standard).** Die Straßen der drei Gebiete werden aus den
  mitgelieferten Geometrien (`data/streets.geojson`) als SVG gezeichnet – die Karte kommt
  komplett ohne externe Anfragen aus.
* **Optional echte Kacheln.** `tile_source: ha` lädt die Kacheln über den Kartenproxy der
  eigenen Home-Assistant-Instanz (die OSM-Kacheln kommen serverseitig mit
  identifizierendem User-Agent und Cache), `tile_url` erlaubt einen eigenen Kachelserver.
  Schlägt das fehl, schaltet die Karte automatisch auf die Offline-Darstellung zurück.
* **`packages/voesendorf_places.yaml`** für die eingebaute Kartenkarte: 14 Sensoren mit
  Koordinaten für ASZ (Johannisweg 1), Blumenerde-Aktion, Müllinsel Benyasiedlung und alle
  Grünschnittcontainer.
* **Quelle für `waste_collection_schedule`** (`zone: oberort | unterort | seepark`), damit
  die Termine in Home Assistant automatisch aktualisiert werden.
* **Werkzeuge** in `tools/`: PDF-Parser mit Selbstprüfung, Daten- und ICS-Generator,
  Overpass-Import der Straßengeometrien, Standort-Resolver, Karten-Build.
* **Tests** in `tests/`: ICS-Validierung, Abgleich der Upstream-Quelle mit dem Datensatz,
  Prüfung des Standort-Pakets.

**Behoben**

* Fehlende und verschobene Biomüll-Termine: im PDF sind benachbarte Zellen gleicher Farbe
  zu einem breiten Rechteck zusammengefasst; der Parser ordnet sie jetzt allen überdeckten
  Monatsspalten zu.
* Falsche Gebietszuordnungen und Beschreibungen in den Kalenderdateien.
* Direkte Kachelabrufe bei `tile.openstreetmap.org`, die von den freiwillig betriebenen
  OSM-Servern blockiert werden ([osm.wiki/Blocked](https://osm.wiki/Blocked)).
* Robustheit der Karte: erneutes Einbinden der Ressource führt nicht mehr zu einem Fehler,
  und die Straßensuche ist auch auf Geräten ohne vorherige Auswahl gefüllt.

**Hinweise**

* Die Karte setzt **Home Assistant 2026.9 oder neuer** voraus (`hacs.json`).
* `tile_source: ha` nutzt eine interne Schnittstelle (`map_tiles/access_token`) und fällt
  bei Fehlern auf die Offline-Karte zurück – die Termine funktionieren immer.
* Der Blumenerde-Standort **Karglhaus** ist nicht enthalten: weder OpenStreetMap noch die
  Adressliste der Gemeinde kennen ihn. Details in [`docs/PLACES.md`](docs/PLACES.md).

### English

**Added**

* **Official 2026 data extracted.** Vösendorf's official waste calendar PDF is parsed
  automatically: all three collection areas (Oberort, Unterort, Seepark) with **76
  collection dates** each (26 × residual waste fortnightly, 13 × residual waste every four
  weeks, 37 × biowaste), including public-holiday shifts.
* **Calendar files.** One `.ics` per area with 80 events (incl. the compost campaign),
  RFC 5545, Europe/Vienna timezone, folded to 75 octets – ready for Home Assistant, Google
  Calendar or Outlook.
* **JSON data set** `data/voesendorf_waste_2026.json` with dates, street lists per area,
  public holidays, container sites and extra services (recycling centre, bulky waste,
  compost campaign).
* **Lovelace card** `dist/voesendorf-waste-card.js` (v1.2.0) – self-contained, no
  integration required: next collections, a year overview in the official PDF's colours, a
  map of the three areas, street picker persisted in the browser, and the extra services.
  German and English.
* **Map without map tiles (default).** Street geometry ships with the card
  (`data/streets.geojson`) and is drawn as SVG, so the map performs no external request at
  all.
* **Real tiles optional.** `tile_source: ha` loads tiles through your own Home Assistant
  instance (core proxies the OSM tiles server-side with an identifying User-Agent and a
  cache), `tile_url` points to your own tile server. If that fails the card falls back to
  the offline map automatically.
* **`packages/voesendorf_places.yaml`** for the built-in map card: 14 sensors with
  coordinates for the recycling centre (Johannisweg 1), the compost campaign sites, the
  Benyasiedlung waste island and every green-waste container.
* **Source for `waste_collection_schedule`** (`zone: oberort | unterort | seepark`) so the
  dates update automatically in Home Assistant.
* **Tools** in `tools/`: self-validating PDF parser, data and ICS generators, Overpass
  importer for the street geometry, place resolver and the card build.
* **Tests** in `tests/`: ICS validation, upstream source compared against the data set,
  consistency check for the places package.

**Fixed**

* Missing and shifted biowaste dates: adjacent cells of the same colour are merged into one
  wide rectangle in the PDF; the parser now assigns them to every month column they cover.
* Wrong area assignments and descriptions in the calendar files.
* Direct tile requests to `tile.openstreetmap.org`, which the volunteer-run OSM servers
  block ([osm.wiki/Blocked](https://osm.wiki/Blocked)).
* Card robustness: registering the resource twice no longer throws, and the street list is
  populated even without a previous selection.

**Notes**

* The card requires **Home Assistant 2026.9 or newer** (`hacs.json`).
* `tile_source: ha` uses an internal interface (`map_tiles/access_token`) and falls back to
  the offline map on failure – the collection dates always work.
* The **Karglhaus** compost site is not included: neither OpenStreetMap nor the
  municipality's address list knows it. See [`docs/PLACES.md`](docs/PLACES.md).

[1.2.0]: https://github.com/acdcnow/voesendorf-wastecalendar/releases/tag/v1.2.0
