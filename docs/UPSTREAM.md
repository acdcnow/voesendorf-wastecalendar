# Quelle für `mampfes/hacs_waste_collection_schedule` beitragen

Die Datei [`waste_collection_schedule/source/voesendorf_at.py`](../waste_collection_schedule/source/voesendorf_at.py)
ist so geschrieben, dass sie unverändert als Quelle in die Integration aufgenommen werden
kann. Sie liest `data/voesendorf_waste_<Jahr>.json` aus diesem Repository (Muster wie bei
`ukbcd.py`, das ebenfalls Daten eines Community-Projekts verwendet).

## Warum keine PDF-Auswertung in der Quelle?

Der amtliche Kalender ist ein PDF, dessen Tageszellen **farbige Rechtecke** sind. Die
zuverlässige Zuordnung „Abfallart → Tag“ erfordert daher Positions- und Farbinformationen
(`pdfplumber`), das in Home Assistant nicht verfügbar ist. `pypdf` (mit `extraction_mode="layout"`)
liefert bei diesem dichten 12-Spalten-Raster keine belastbaren Ergebnisse – getestet und
verworfen. Die Aufbereitung passiert deshalb hier im Repository
(`tools/parse_calendar_pdf.py`), inklusive Selbstprüfung der Ergebnisse.

## Schritte für den Pull Request

1. Repository forken und aktuellen `master` auschecken.
2. Quelle kopieren:

   ```bash
   cp waste_collection_schedule/source/voesendorf_at.py \
      custom_components/waste_collection_schedule/waste_collection_schedule/source/voesendorf_at.py
   ```

3. Prüfen, dass die Datei ohne Änderungen den Konventionen entspricht
   (`TITLE`, `DESCRIPTION`, `URL`, `COUNTRY`, `TEST_CASES`, `HOW_TO_GET_ARGUMENTS_DESCRIPTION`,
   `PARAM_DESCRIPTIONS`, `PARAM_TRANSLATIONS`, `ICON_MAP`).
4. Testfälle laufen lassen (benötigt Internet):

   ```bash
   python -m pytest tests/test_source.py -k voesendorf
   ```

   Alternativ die Quelle direkt ausprobieren:

   ```bash
   python -c "from waste_collection_schedule.source.voesendorf_at import Source; \
              print(Source(zone='oberort', year=2026).fetch()[:3])"
   ```

5. Commit + Pull Request mit der Beschreibung:

   > Add source for Vösendorf (Austria)
   >
   > Vösendorf publishes its waste calendar as a PDF with one grid per collection area
   > (Oberort, Unterort, Seepark). The PDF encodes the waste type as the fill colour of the
   > day cells, which cannot be parsed reliably inside the integration, so the verified
   > dates are published as JSON in a community repository and read from there.
   > Repository: https://github.com/acdcnow/voesendorf-wastecalendar

## Bis zur Aufnahme der Quelle

Es gibt zwei Wege, die schon **jetzt** funktionieren:

* die ICS-Dateien mit der eingebauten Quelle `ics` verwenden (siehe README), oder
* die Quelle lokal ablegen:

  ```
  /config/custom_components/waste_collection_schedule/waste_collection_schedule/source/voesendorf_at.py
  ```

  Danach Home Assistant neu starten und `voesendorf_at` wie gewohnt konfigurieren.

## Wenn eine eigene Integration gewünscht ist

Falls statt eines Upstream-Beitrags eine eigene Integration nur für Vösendorf entstehen
soll, ist der Aufwand überschaubar, weil die Daten bereits als JSON vorliegen:

1. `custom_components/voesendorf_waste/` mit `manifest.json`, `__init__.py`,
   `config_flow.py`, `const.py`, `sensor.py`, `calendar.py`
   (Vorlage: dieser Quellcode plus `DataUpdateCoordinator`).
2. `manifest.json` mit `domain`, `name`, `version`, `documentation`, `issue_tracker`,
   `codeowners`, `iot_class: cloud_polling`, `requirements: []` (nur `requests`).
3. `async_setup_platform`/`async_setup_entry` wie in HA 2026.9 üblich, Sensoren über
   `AddConfigEntryEntitiesCallback`.
4. Markenbilder können seit HA 2026.3 lokal unter
   `custom_components/voesendorf_waste/brand/` (icon.png, logo.png) mitgeliefert werden.

Für die meisten Nutzer ist der Weg über `waste_collection_schedule` (ICS oder Quelle)
jedoch deutlich weniger Wartungsaufwand.
