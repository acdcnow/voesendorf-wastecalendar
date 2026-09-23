# Lovelace-Karte `voesendorf-waste-card`

Eigenständige Karte für den Vösendorfer Müllabfuhrkalender. Sie enthält die Termine des
laufenden Jahres (in `dist/voesendorf-waste-card.js` eingebettet) und benötigt **keine**
Integration. Als Kartenhintergrund lädt sie **echte Kartenkacheln** über den Kartenproxy
(`map_tiles`) der eigenen Home-Assistant-Instanz; mit `tile_source: offline` zeichnet sie
stattdessen die mitgelieferten Straßengeometrien selbst als SVG und kommt dann ganz ohne
Netzzugriff aus.

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
| `show_map` | bool | `true` | Karte der drei Gebiete anzeigen; `false` lässt sie ganz weg. Am Dashboard lässt sich die Karte zusätzlich mit dem Knopf neben der Überschrift zuklappen (Zustand wird im Browser gespeichert) |
| `map_height` | int | `320` | Höhe der Karte in Pixel |
| `tile_source` | string | `ha` | `ha` (Standard) lädt echte Kartenkacheln über den Kartenproxy der eigenen Home-Assistant-Instanz. `offline` zeichnet die mitgelieferten Straßengeometrien als SVG (keine Kacheln, kein Netz). `custom` verwendet die URL aus `tile_url` |
| `tile_url` | string | `""` | Eigene Kachel-URL, z. B. `https://tiles.example.com/{z}/{x}/{y}.png`; wird verwendet, wenn `tile_source` leer oder `custom` ist – `ha` hat Vorrang |
| `tile_attribution` | string | `""` | Anbietername für den Kachel-Hinweis; sonst wird der Hostname aus `tile_url` verwendet |
| `tile_fallback` | bool | `true` | Nach 3 fehlgeschlagenen Kacheln automatisch auf die Offline-Karte zurückschalten (samt Hinweis) |
| `days_ahead` | int | `6` | Zeitfenster für „Nächste Abholungen“ |
| `show_types` | Liste | `[RM, RM4, Bio]` | Einzelne Abfallarten ausblenden |
| `show_extras` | bool | `true` | Zusatztermine (ASZ, Sperrmüll, Blumenerde) anzeigen |

### Beispiele

```yaml
# Festes Gebiet, ohne Karte, kompakte Liste
type: custom:voesendorf-waste-card
zone: seepark
show_map: false
days_ahead: 3

# Straße angeben – das Gebiet wird automatisch erkannt
type: custom:voesendorf-waste-card
street: Marktstraße

# Nur Biomüll und Restmüll, längeres Zeitfenster
type: custom:voesendorf-waste-card
zone: unterort
days_ahead: 14
show_types: [RM, Bio]

# Ohne Kartenkacheln (Karte selbst gezeichnet, kein Netzzugriff)
type: custom:voesendorf-waste-card
zone: oberort
tile_source: offline
```

### Kartenkacheln

Als Kartenhintergrund zeigt die Karte **echte Kacheln**: sie lädt keine Kacheln direkt bei
`tile.openstreetmap.org` (diese freiwillig betriebenen Server sind nicht für eingebettete
Karten gedacht und antworten auf solche Anfragen mit einer Sperre,
[osm.wiki/Blocked](https://osm.wiki/Blocked)), sondern über die eigene Instanz.

**Kacheln über Home Assistant (Standard, `tile_source: ha`)**

Die eingebaute Kartenkarte lädt ihre Kacheln nicht direkt von OSM: Core proxyt und cacht
sie (Systemintegration `map_tiles`) und schickt dabei den identifizierenden User-Agent,
den die OSM-Tile-Policy verlangt und den ein Browser nicht senden kann. Dieselben Kacheln
verwendet diese Karte – ohne weitere Konfiguration:

```yaml
type: custom:voesendorf-waste-card
zone: oberort
# tile_source: ha      # ist bereits der Standard
```

Die Karte holt sich dazu über `map_tiles/access_token` einen Token (rotiert alle 30
Minuten) und lädt `/api/map_tiles/raster/{z}/{x}/{y}.png?token=…` von der eigenen Instanz.
Schlägt das fehl – ältere Home-Assistant-Version, keine Verbindung, nicht erreichbare
Kacheln – fällt sie automatisch auf die Offline-Karte zurück und weist im Hinweis unter
der Karte darauf hin. In diesem Modus lädt die Karte Leaflet von einem CDN; die
Offline-Karte braucht das nicht.

**Ohne Kacheln (`tile_source: offline`)**

Wer keine externen Anfragen will (oder eine Instanz ohne `map_tiles` hat), schaltet die
Kacheln ab: die Straßen der drei Gebiete werden dann aus den mitgelieferten Geometrien
(`data/streets.geojson`) als SVG gezeichnet – schnell, offline und ohne Leaflet-Download.

```yaml
type: custom:voesendorf-waste-card
zone: oberort
tile_source: offline
```

**Eigener Kachelserver (`tile_source: custom` + `tile_url`)**

Wer einen Anbieter hat, dessen Nutzungsbedingungen eingebettete Karten erlauben, trägt
dessen URL ein:

```yaml
type: custom:voesendorf-waste-card
zone: oberort
tile_source: custom
tile_url: https://tiles.example.com/{z}/{x}/{y}.png
tile_attribution: Beispiel-Karten
```

Blockiert der Server die Anfragen (oder ist das Internet weg), schaltet die Karte nach
drei fehlgeschlagenen Kacheln automatisch auf die Offline-Darstellung zurück und weist
darauf hin. Mit `tile_fallback: false` bleibt stattdessen die (dann leere) Leaflet-Karte
stehen.

Wird weder `zone` noch `street` gesetzt, zeigt die Karte eine Übersicht aller drei Gebiete
und die Auswahlfelder für Straße und Gebiet.

## Bedienung

* **Straße / Abfuhrgebiet** in den Auswahlfeldern werden im Browser gespeichert
  (`localStorage`) und beim nächsten Aufruf wiederhergestellt.
* **Karte aus-/einblenden:** neben der Kartenüberschrift sitzt der Knopf
  *Karte ausblenden* / *Karte einblenden*. Er zuklappt die Karte (samt Legende und
  Hinweisen) ohne Änderung an der Dashboard-Konfiguration; die Wahl bleibt im Browser
  gespeichert. Wer die Karte grundsätzlich nicht will, setzt `show_map: false`.
* **Karte:** Straßen sind in der Farbe ihres Gebiets eingezeichnet, das gewählte Gebiet
  hervorgehoben. Klick auf eine Straße, eine Gebietsbeschriftung oder einen Eintrag der
  Legende wechselt das Gebiet (Tooltip zeigt Straße und Gebiet). Die **Badner Bahn** ist
  grau gestrichelt dargestellt, Siedlungen (z. B. Seeparksiedlung) sind leicht gefüllt.
  Geteilte Straßen (`Ortsstraße`, `Schönbrunner Allee`) sind grau, weil sie zu zwei
  Gebieten gehören. Unter der Karte stehen die Legende (Gebiet + Abfuhrtage) sowie ein
  Link, der die Kartenmitte in OpenStreetMap öffnet.
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
* Die Kartendaten (Straßenverläufe) stammen aus OpenStreetMap (ODbL) und werden über die
  Overpass-API bezogen (einmalig beim Erzeugen von `data/streets.geojson`). Die
  Kartenkacheln liefert die eigene Home-Assistant-Instanz über den `map_tiles`-Proxy aus
  (Standard, `tile_source: ha`); mit `tile_source: offline` zeichnet die Karte die
  Geometrien selbst und kommt ohne Netzzugriff aus – dann wird auch Leaflet nicht geladen.
* Wer die Standorte (ASZ, Müllinseln, Grünschnittcontainer) auf der **eingebauten**
  Kartenkarte zeigen will, findet Paket und Anleitung in [`PLACES.md`](PLACES.md).
* Zeitzone/Sprache: Die Beschriftungen richten sich nach der Sprache des Browsers
  (`de` oder `en`).
* Fehler gefunden? Bitte ein Issue im Repository anlegen – die Rohdaten lassen sich mit
  `python tools/build_data.py` neu erzeugen.

---

# Lovelace card `voesendorf-waste-card` (English)

A self-contained card for the Vösendorf waste collection calendar. It bundles the dates of
the current year (inlined into `dist/voesendorf-waste-card.js`) and needs **no** integration.
As its map background it loads **real map tiles** through the map tile proxy (`map_tiles`)
of your own Home Assistant instance; with `tile_source: offline` it draws the bundled street
geometry as SVG instead and then works without any network access.

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
| `show_map` | bool | `true` | show the map of the three areas; `false` leaves it out entirely. On the dashboard the map can also be collapsed with the button next to its heading (state is stored in the browser) |
| `map_height` | int | `320` | height of the map in pixels |
| `tile_source` | string | `ha` | `ha` (default) loads real map tiles through the map tile proxy of your Home Assistant instance. `offline` draws the bundled street geometry as SVG (no tiles, no network). `custom` uses the URL in `tile_url` |
| `tile_url` | string | `""` | own tile URL, e.g. `https://tiles.example.com/{z}/{x}/{y}.png`; used when `tile_source` is empty or `custom` – `ha` takes precedence |
| `tile_attribution` | string | `""` | provider name for the tile notice; otherwise the hostname from `tile_url` is used |
| `tile_fallback` | bool | `true` | switch to the offline map automatically after 3 failed tiles (with a notice) |
| `days_ahead` | int | `6` | time window for "Next collections" |
| `show_types` | list | `[RM, RM4, Bio]` | hide individual waste types |
| `show_extras` | bool | `true` | show the extra dates (recycling centre, bulky waste, compost) |

### Examples

```yaml
# Fixed area, no map, compact list
type: custom:voesendorf-waste-card
zone: seepark
show_map: false
days_ahead: 3

# Give a street – the area is detected automatically
type: custom:voesendorf-waste-card
street: Marktstraße

# Only biowaste and residual waste, longer window
type: custom:voesendorf-waste-card
zone: unterort
days_ahead: 14
show_types: [RM, Bio]

# Without map tiles (map drawn by the card itself, no network access)
type: custom:voesendorf-waste-card
zone: oberort
tile_source: offline
```

### Map tiles

As the map background the card shows **real tiles**: it does not load tiles directly from
`tile.openstreetmap.org` (those volunteer-run servers are not meant for embedded maps and
answer such requests with a block, [osm.wiki/Blocked](https://osm.wiki/Blocked)) but through
your own instance.

**Tiles via Home Assistant (default, `tile_source: ha`)**

The built-in map card does not load its tiles directly from OSM either: core proxies and
caches them (system integration `map_tiles`) and sends the identifying User-Agent that the
OSM tile policy asks for and that a browser cannot send. This card uses the same tiles –
without any further configuration:

```yaml
type: custom:voesendorf-waste-card
zone: oberort
# tile_source: ha      # already the default
```

For that the card asks `map_tiles/access_token` for a token (it rotates every 30 minutes)
and loads `/api/map_tiles/raster/{z}/{x}/{y}.png?token=…` from your own instance. If that
fails – older Home Assistant version, no connection, unreachable tiles – it falls back to
the offline map automatically and says so in the notice below the map. In this mode the card
loads Leaflet from a CDN; the offline map does not need that.

**Without tiles (`tile_source: offline`)**

If you do not want external requests (or run an instance without `map_tiles`), turn the
tiles off: the streets of the three areas are then drawn from the bundled geometry
(`data/streets.geojson`) as SVG – fast, offline and without a Leaflet download.

```yaml
type: custom:voesendorf-waste-card
zone: oberort
tile_source: offline
```

**Own tile server (`tile_source: custom` + `tile_url`)**

If you have a provider whose terms of use allow embedded maps, enter its URL:

```yaml
type: custom:voesendorf-waste-card
zone: oberort
tile_source: custom
tile_url: https://tiles.example.com/{z}/{x}/{y}.png
tile_attribution: Example maps
```

If the server blocks the requests (or the internet is down), the card switches to the
offline rendering after three failed tiles and says so. With `tile_fallback: false` the
(then empty) Leaflet map stays instead.

If neither `zone` nor `street` is set, the card shows an overview of all three areas and the
pickers for street and area.

## Usage

* **Street / collection area** in the pickers are stored in the browser (`localStorage`) and
  restored on the next visit.
* **Hide/show the map:** the button *Hide map* / *Show map* sits next to the map heading. It
  collapses the map (including legend and notices) without changing the dashboard
  configuration; the choice stays stored in the browser. If you do not want the map at all,
  set `show_map: false`.
* **Map:** streets are drawn in the colour of their area, the selected area is highlighted.
  Clicking a street, an area label or a legend entry switches the area (the tooltip shows
  street and area). The **Badner Bahn** is dashed grey, settlements (e.g. Seeparksiedlung)
  are lightly filled. Shared streets (`Ortsstraße`, `Schönbrunner Allee`) are grey because
  they belong to two areas. Below the map are the legend (area + collection days) and a link
  that opens the map centre in OpenStreetMap.
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
* The map data (street geometry) comes from OpenStreetMap (ODbL) and is fetched through the
  Overpass API (once, when `data/streets.geojson` is generated). The map tiles are served by
  your own Home Assistant instance through the `map_tiles` proxy (default,
  `tile_source: ha`); with `tile_source: offline` the card draws the geometry itself and
  works without network access – then Leaflet is not loaded either.
* If you want the locations (recycling centre, waste islands, green-waste containers) on the
  **built-in** map card, see the package and instructions in [`PLACES.md`](PLACES.md).
* Time zone/language: the labels follow the browser language (`de` or `en`).
* Found a bug? Please open an issue in the repository – the raw data can be regenerated with
  `python tools/build_data.py`.
