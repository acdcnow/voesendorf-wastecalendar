# Vösendorf Abfallkalender – Karte

Eigenständige Lovelace-Karte für den Müllabfuhrkalender der Marktgemeinde Vösendorf
(2331, Niederösterreich), **Version 1.4.1**. Enthält die Termine 2026, einen kompakten
Monatskalender (nur der aktuelle Monat, durchblätterbar) in den Farben des amtlichen PDFs,
eine Karte der drei Abfuhrgebiete auf echten OpenStreetMap-Kacheln – geladen über den
Kartenproxy der eigenen Home-Assistant-Instanz (`map_tiles`), mit `tile_source: offline`
stattdessen ohne Kacheln aus den mitgelieferten Straßengeometrien, und am Dashboard
jederzeit aus- und einblendbar – sowie Container, Hinweise und Zusatztermine in einem
Popup. **Ohne** zusätzliche Integration.

```yaml
type: custom:voesendorf-waste-card
zone: oberort        # oder auto / unterort / seepark
street: Marktstraße  # optional, erkennt das Gebiet automatisch
show_map: true
# tile_source: offline # optional: ohne Kacheln, Karte selbst gezeichnet
```

Die Termine stammen aus dem amtlichen Müllabfuhrplan der Marktgemeinde
(<https://voesendorf.gv.at/buergerservice/muellkalender/>) und werden mit den Skripten in
`tools/` erzeugt. Kalenderdateien (`.ics`), ein JSON-Datensatz, eine Quelle für
`waste_collection_schedule` sowie ein Paket mit den Sammelstellen für die eingebaute
Kartenkarte liegen ebenfalls im Repository – siehe `README.md` und `CHANGELOG.md`.

---

## English

Standalone Lovelace card for the waste collection calendar of the municipality of Vösendorf
(2331, Lower Austria), **version 1.4.1**. It contains the 2026 dates, a compact month
calendar (the current month only, pageable) in the colours of the official PDF, and a map of
the three collection areas on real OpenStreetMap tiles – loaded through the map tile proxy of
your own Home Assistant instance (`map_tiles`); with `tile_source: offline` the bundled
street geometry is drawn instead, without tiles. The map can be hidden and shown again at any
time on the dashboard. Containers, notes and extra dates open in a popup. **No** additional
integration required.

```yaml
type: custom:voesendorf-waste-card
zone: oberort        # or auto / unterort / seepark
street: Marktstraße  # optional, detects the area automatically
show_map: true
# tile_source: offline # optional: no tiles, map drawn by the card itself
```

The dates come from the official waste collection calendar of the municipality
(<https://voesendorf.gv.at/buergerservice/muellkalender/>) and are generated with the scripts
in `tools/`. Calendar files (`.ics`), a JSON data set, a source for
`waste_collection_schedule` and a package with the collection points for the built-in map
card are part of the repository as well – see `README.md` and `CHANGELOG.md`.
