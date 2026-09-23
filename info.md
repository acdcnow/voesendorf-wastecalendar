# Vösendorf Abfallkalender – Karte

Eigenständige Lovelace-Karte für den Müllabfuhrkalender der Marktgemeinde Vösendorf
(2331, Niederösterreich), **Version 1.4.0**. Enthält die Termine 2026, einen kompakten
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
