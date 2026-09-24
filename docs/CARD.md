# Lovelace-Karte `voesendorf-waste-card`

Eigenständige Karte für den Vösendorfer Müllabfuhrkalender. Sie enthält die Termine des
laufenden Jahres (in `dist/voesendorf-waste-card.js` eingebettet) und benötigt **keine**
Integration, **keine Karte** und **keine externe Anfrage**: kein Leaflet, keine Kacheln,
kein Kartenproxy – nur Kalender, Monatsansicht und Zusatzinfos.

## Installation

**Manuell**

1. `dist/voesendorf-waste-card.js` nach `config/www/` kopieren.
2. Als Ressource registrieren (Einstellungen → Dashboards → Ressourcen → Ressource
   hinzufügen), Typ **JavaScript-Modul**:

   ```yaml
   url: /local/voesendorf-waste-card.js
   type: module
   ```

**Über HACS**

Repository `https://github.com/acdcnow/voesendorf-wastecalendar` als benutzerdefiniertes
Repository mit Kategorie **Dashboard** hinzufügen und installieren. HACS legt die Datei
unter `/hacsfiles/voesendorf-wastecalendar/voesendorf-waste-card.js` ab.

## Konfiguration

```yaml
type: custom:voesendorf-waste-card
```

| Option | Typ | Standard | Bedeutung |
| --- | --- | --- | --- |
| `title` | string | `Abfallkalender Vösendorf` | Überschrift der Karte |
| `zone` | string | `auto` | `auto`, `oberort`, `unterort` oder `seepark` |
| `street` | string | – | Straßenname; wird `zone: auto` verwendet, leitet die Karte das Gebiet daraus ab |
| `days_ahead` | int | `6` | Zeitfenster für „Nächste Abholungen“ |
| `show_types` | Liste | `[RM, RM4, Bio]` | Einzelne Abfallarten ausblenden |
| `show_extras` | bool | `true` | Zusatztermine (ASZ, Sperrmüll, Blumenerde) anzeigen |

### Beispiele

```yaml
# Festes Gebiet, kompakte Liste
type: custom:voesendorf-waste-card
zone: seepark
days_ahead: 3

# Straße angeben – das Gebiet wird automatisch erkannt
type: custom:voesendorf-waste-card
street: Marktstraße

# Nur Biomüll und Restmüll, längeres Zeitfenster
type: custom:voesendorf-waste-card
zone: unterort
days_ahead: 14
show_types: [RM, Bio]
```

Wird weder `zone` noch `street` gesetzt, zeigt die Karte eine Übersicht aller drei Gebiete
und die Auswahlfelder für Straße und Gebiet.

## Bedienung

* **Straße / Abfuhrgebiet** in den Auswahlfeldern werden im Browser gespeichert
  (`localStorage`) und beim nächsten Aufruf wiederhergestellt.
* **Monatsansicht:** farbige Tage wie im amtlichen PDF, aber nur für **einen** Monat
  (Standard: der aktuelle). Feiertage sind rot umrandet, der heutige Tag ist
  hervorgehoben. Tooltip beim Überfahren zeigt Datum und Abfallarten. Mit den Pfeilen
  neben dem Monatsnamen blättert man durch das Kalenderjahr, der Punkt springt zurück zum
  aktuellen Monat.
* **Details:** Das Info-Symbol in der Kopfzeile öffnet einen Dialog mit Containerstandorten,
  Hinweisen und Zusatzterminen (ASZ, Sperrmüll, Blumenerde). Das hält die Karte auf dem
  Dashboard klein; schließen mit ✕, `Esc` oder Klick daneben.

## Hinweise

* Die Karte liest die Uhrzeit des Browsers; „heute/morgen“ bezieht sich daher auf das
  Gerät, auf dem das Dashboard angezeigt wird.
* Wer die Standorte (ASZ, Müllinseln, Grünschnittcontainer) auf der **eingebauten**
  Kartenkarte zeigen will, findet Paket und Anleitung in [`PLACES.md`](PLACES.md).
* Zeitzone/Sprache: Die Beschriftungen richten sich nach der Sprache des Browsers
  (`de` oder `en`).
* Fehler gefunden? Bitte ein Issue im Repository anlegen – die Rohdaten lassen sich mit
  `python tools/build_data.py` neu erzeugen.

---

# Lovelace card `voesendorf-waste-card` (English)

A self-contained card for the Vösendorf waste collection calendar. It bundles the dates of
the current year (inlined into `dist/voesendorf-waste-card.js`) and needs **no** integration,
**no map** and **no external request**: no Leaflet, no tiles, no map proxy – just the
calendar, the month view and the extra information.

## Installation

**Manual**

1. Copy `dist/voesendorf-waste-card.js` to `config/www/`.
2. Register it as a resource (Settings → Dashboards → Resources → Add resource), type
   **JavaScript module**:

   ```yaml
   url: /local/voesendorf-waste-card.js
   type: module
   ```

**Via HACS**

Add `https://github.com/acdcnow/voesendorf-wastecalendar` as a custom repository with
category **Dashboard** and install it. HACS puts the file at
`/hacsfiles/voesendorf-wastecalendar/voesendorf-waste-card.js`.

## Configuration

```yaml
type: custom:voesendorf-waste-card
```

| Option | Type | Default | Meaning |
| --- | --- | --- | --- |
| `title` | string | `Abfallkalender Vösendorf` | heading of the card |
| `zone` | string | `auto` | `auto`, `oberort`, `unterort` or `seepark` |
| `street` | string | – | street name; with `zone: auto` the card derives the area from it |
| `days_ahead` | int | `6` | time window for "Next collections" |
| `show_types` | list | `[RM, RM4, Bio]` | hide individual waste types |
| `show_extras` | bool | `true` | show the extra dates (recycling centre, bulky waste, compost) |

### Examples

```yaml
# Fixed area, compact list
type: custom:voesendorf-waste-card
zone: seepark
days_ahead: 3

# Give a street – the area is detected automatically
type: custom:voesendorf-waste-card
street: Marktstraße

# Only biowaste and residual waste, longer window
type: custom:voesendorf-waste-card
zone: unterort
days_ahead: 14
show_types: [RM, Bio]
```

If neither `zone` nor `street` is set, the card shows an overview of all three areas and the
pickers for street and area.

## Usage

* **Street / collection area** in the pickers are stored in the browser (`localStorage`) and
  restored on the next visit.
* **Month view:** coloured days like in the official PDF, but for **one** month only
  (default: the current one). Public holidays are outlined in red, today is highlighted.
  Hovering shows date and waste types. The arrows next to the month name page through the
  calendar year, the dot button jumps back to the current month.
* **Details:** the info icon in the header opens a dialog with container locations, notes
  and extra dates (recycling centre, bulky waste, compost campaign). That keeps the card
  small on the dashboard; close it with ✕, `Esc` or a click outside.

## Notes

* The card reads the browser's clock, so "today"/"tomorrow" refer to the device that shows
  the dashboard.

* If you want the locations (recycling centre, waste islands, green-waste containers) on the
  **built-in** map card, see the package and instructions in [`PLACES.md`](PLACES.md).
* Time zone/language: the labels follow the browser language (`de` or `en`).
* Found a bug? Please open an issue in the repository – the raw data can be regenerated with
  `python tools/build_data.py`.
