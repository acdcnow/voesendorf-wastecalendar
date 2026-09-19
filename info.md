# Vösendorf Abfallkalender – Karte

Eigenständige Lovelace-Karte für den Müllabfuhrkalender der Marktgemeinde Vösendorf
(2331, Niederösterreich). Enthält die Termine 2026, eine Jahresübersicht in den Farben des
amtlichen PDFs und eine OpenStreetMap-Karte der drei Abfuhrgebiete – **ohne** zusätzliche
Integration.

```yaml
type: custom:voesendorf-waste-card
zone: oberort        # oder auto / unterort / seepark
street: Marktstraße  # optional, erkennt das Gebiet automatisch
show_map: true
```

Die Termine stammen aus dem amtlichen Müllabfuhrplan der Marktgemeinde
(<https://voesendorf.gv.at/buergerservice/muellkalender/>) und werden mit den Skripten in
`tools/` erzeugt. Kalenderdateien (`.ics`) und ein JSON-Datensatz liegen ebenfalls im
Repository, siehe `README.md`.
