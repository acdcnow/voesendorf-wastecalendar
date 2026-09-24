# Vösendorf Abfallkalender – Karte

Eigenständige Lovelace-Karte für den Müllabfuhrkalender der Marktgemeinde Vösendorf
(2331, Niederösterreich), **Version 2.0.0**. Enthält die Termine 2026, einen kompakten
Monatskalender (nur der aktuelle Monat, durchblätterbar) in den Farben des amtlichen PDFs
sowie Container, Hinweise und Zusatztermine in einem Popup. Straßensuche und
Gebietszuordnung bleiben. **Ohne** zusätzliche Integration, **ohne Karte** und **ohne
externe Anfrage** – die Karte wurde in 2.0.0 entfernt.

```yaml
type: custom:voesendorf-waste-card
zone: oberort        # oder auto / unterort / seepark
street: Marktstraße  # optional, erkennt das Gebiet automatisch
days_ahead: 6
```

Die Termine stammen aus dem amtlichen Müllabfuhrplan der Marktgemeinde
(<https://voesendorf.gv.at/buergerservice/muellkalender/>) und werden mit den Skripten in
`tools/` erzeugt. Kalenderdateien (`.ics`), ein JSON-Datensatz, eine Quelle für
`waste_collection_schedule` sowie ein Paket mit den Sammelstellen für die eingebaute
Kartenkarte liegen ebenfalls im Repository – siehe `README.md` und `CHANGELOG.md`.

---

## English

Standalone Lovelace card for the waste collection calendar of the municipality of Vösendorf
(2331, Lower Austria), **version 2.0.0**. It contains the 2026 dates, a compact month
calendar (the current month only, pageable) in the colours of the official PDF, plus
containers, notes and extra dates in a popup. Street search and area detection remain.
**No** additional integration, **no map** and **no external request** – the map was removed
in 2.0.0.

```yaml
type: custom:voesendorf-waste-card
zone: oberort        # or auto / unterort / seepark
street: Marktstraße  # optional, detects the area automatically
days_ahead: 6
```

The dates come from the official waste collection calendar of the municipality
(<https://voesendorf.gv.at/buergerservice/muellkalender/>) and are generated with the scripts
in `tools/`. Calendar files (`.ics`), a JSON data set, a source for
`waste_collection_schedule` and a package with the collection points for the built-in map
card are part of the repository as well – see `README.md` and `CHANGELOG.md`.
