# Vösendorf Abfallkalender – Karte

Eigenständige Lovelace-Karte für den Müllabfuhrkalender der Marktgemeinde Vösendorf
(2331, Niederösterreich), **Version 1.2.0**. Enthält die Termine 2026, eine
Jahresübersicht in den Farben des amtlichen PDFs und eine Karte der drei Abfuhrgebiete,
die aus den mitgelieferten Straßengeometrien gezeichnet wird (offline, ohne
Kartenkacheln) – **ohne** zusätzliche Integration.

```yaml
type: custom:voesendorf-waste-card
zone: oberort        # oder auto / unterort / seepark
street: Marktstraße  # optional, erkennt das Gebiet automatisch
show_map: true
# tile_source: ha     # optional: echte Kacheln über den Home-Assistant-Proxy
```

Die Termine stammen aus dem amtlichen Müllabfuhrplan der Marktgemeinde
(<https://voesendorf.gv.at/buergerservice/muellkalender/>) und werden mit den Skripten in
`tools/` erzeugt. Kalenderdateien (`.ics`), ein JSON-Datensatz, eine Quelle für
`waste_collection_schedule` sowie ein Paket mit den Sammelstellen für die eingebaute
Kartenkarte liegen ebenfalls im Repository – siehe `README.md` und `CHANGELOG.md`.
