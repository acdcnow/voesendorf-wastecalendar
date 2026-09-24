# Standorte für die eingebaute Kartenkarte

`data/places.json` und `packages/voesendorf_places.yaml` enthalten die Standorte der
Zusatzservices der Marktgemeinde Vösendorf. Sie sind für die **eingebaute Kartenkarte**
(`type: map`) gedacht, die nur Entitäten mit Koordinaten zeichnen kann. Die eigene
Lovelace-Karte (`dist/voesendorf-waste-card.js`) zeigt bewusst keine Karte mehr – die
Standorte gehören daher auf diese Kartenkarte.

Erzeugt werden beide Dateien von `tools/fetch_places.py`; die YAML-Datei bitte nicht von
Hand bearbeiten.

## Einbinden

```yaml
# configuration.yaml
homeassistant:
  packages: !include_dir_named packages
```

Danach stehen 14 Sensoren bereit. Ihr Zustand ist das Abfuhrgebiet (oder
„Gemeindegebiet“), die Attribute `latitude`, `longitude`, `art`, `bereich`, `hinweis` und
`quelle` liefern die Details:

| Sensor | Bereich | Koordinate | Quelle |
| --- | --- | --- | --- |
| Altstoffsammelzentrum (ASZ) | Gemeindegebiet | 48.12099, 16.34856 | Nominatim: Johannisweg 1 |
| Blumenerde: Feuerwehrhaus | Gemeindegebiet | 48.12086, 16.34116 | OSM way/37558159 (FF Vösendorf) |
| Blumenerde: Benyasiedlung | Oberort | 48.11539, 16.31272 | `data/streets.geojson` (Siedlung) |
| Müllinsel Benyasiedlung | Oberort | 48.11539, 16.31272 | `data/streets.geojson` (Siedlung) |
| Grünschnittcontainer Franz Spiegel-Gasse | Oberort | 48.13530, 16.32620 | Straßenmitte |
| Grünschnittcontainer Konsumstraße | Oberort | 48.12956, 16.32556 | Straßenmitte |
| Grünschnittcontainer Mitterberggasse | Oberort | 48.12163, 16.31988 | Straßenmitte |
| Grünschnittcontainer Brunnerweg | Unterort | 48.11982, 16.33554 | Straßenmitte |
| Grünschnittcontainer Lindengasse | Unterort | 48.11923, 16.33707 | Straßenmitte |
| Grünschnittcontainer Schönbrunner Allee | Unterort | 48.13154, 16.32652 | Straßenmitte |
| Grünschnittcontainer Bachgasse | Unterort | 48.11937, 16.34535 | Straßenmitte |
| Grünschnittcontainer Friedhof | Unterort | 48.12590, 16.34210 | OSM way/13836906 |
| Grünschnittcontainer Schloss/Parkplatz | Unterort | 48.12067, 16.34345 | Straßenmitte Schlossplatz |
| Grünschnittcontainer NÖ Pflege- und Betreuungszentrum | Unterort | 48.12244, 16.34238 | OSM way/37558138 |

## Kartenkarte

```yaml
type: map
title: Müllsammelstellen Vösendorf
aspect_ratio: 16:9
default_zoom: 15
scale_ruler: true
show_all: true
```

`show_all: true` zeichnet **alle** Entitäten mit Koordinaten – also auch Handys oder Autos,
falls sie per Companion-App getrackt werden. Wer nur die Sammelstellen will, wählt sie im
Karten-Editor aus (die Sensornamen beginnen mit „Voesendorf…“) oder trägt die Entity-IDs
ein; diese zeigt Home Assistant unter *Entwicklerwerkzeuge → Zustände*.

```yaml
type: map
entities:
  - entity: sensor.voesendorf_asz
    label_mode: icon
  - entity: sensor.voesendorf_blumenerde_feuerwehrhaus
    label_mode: icon
```

Die IDs oben sind Beispiele – sie hängen davon ab, wie Home Assistant den Namen
„automatisch“ umwandelt.

## Warum keine Kachelsperre?

Die eingebaute Karte lädt keine Kacheln direkt von OSM. Core bündelt alles über die
Systemintegration `map_tiles`:

* `/api/map_tiles/vector/{z}/{x}/{y}.mvt` – Vektorkacheln (`vector.openstreetmap.org`)
* `/api/map_tiles/raster/{z}/{x}/{y}.png` – Rasterkacheln (`tile.openstreetmap.org`)
* dazu Glyphen, Sprites und TileJSON, alles mit Token

Der Abruf passiert serverseitig mit einem identifizierenden User-Agent
(`HomeAssistant/<version> (+https://www.home-assistant.io)`) und wird im Speicher
zwischengespeichert – genau das, was die OSM-Tile-Policy verlangt und was ein Browser nicht
kann. Deshalb funktioniert die Karte auch dort, wo ein direktes Einbetten von
`tile.openstreetmap.org` mit `osm.wiki/Blocked` abgewiesen wird.

## Bekannte Lücken

* **Blumenerde: Karglhaus** fehlt. Der Kalender nennt den Standort, aber weder
  OpenStreetMap noch die Adressliste der Gemeinde kennen ein „Karglhaus“ in Vösendorf –
  statt zu raten bleibt der Punkt weg. Wenn du die Adresse kennst, ergänze einen Eintrag in
  `PLACES` in `tools/fetch_places.py` (z. B. mit `"nominatim": "<Adresse>"`) und führe
  `python tools/fetch_places.py --refresh` aus.
* **Grünschnittcontainer Seepark/Spitz** ist derzeit nicht enthalten (kein eindeutiger
  Punkt auffindbar); der „neue Standort“ der Benyasiedlung folgt laut Gemeinde erst 2026.
* **Grünschnittcontainer Bachgasse**: im PDF steht „Badgasse“, die Gemeinde-Website nennt
  unter Unterort „Schlossplatz/Bachgasse“ – angesetzt ist daher die Bachgasse.
* Die Positionen stammen aus Straßenmitten bzw. Geocodierung und markieren daher die
  Straße, nicht den exakten Container. Für die Orientierung reicht das; einzelne Punkte
  lassen sich in `data/places.json` und der YAML-Datei feinjustieren.

## Neu erzeugen

```bash
python tools/fetch_places.py            # nutzt den Overpass-Cache in build/
python tools/fetch_places.py --refresh  # fragt Overpass und Nominatim neu
python tests/test_places.py             # Gegenprobe
```

Datenquellen: Adressen und Listen von [voesendorf.gv.at](https://voesendorf.gv.at/gemeindeamt/wirtschaftshof/),
Geometrien von © OpenStreetMap-Mitwirkenden ([ODbL](https://www.openstreetmap.org/copyright)),
Geocodierung über Nominatim – bitte sparsam abfragen.

---

# Locations for the built-in map card (English)

`data/places.json` and `packages/voesendorf_places.yaml` hold the locations of the extra
services of the municipality of Vösendorf. They are meant for the **built-in map card**
(`type: map`), which can only draw entities that carry coordinates. The custom Lovelace card
(`dist/voesendorf-waste-card.js`) deliberately shows no map any more, so these locations
belong on that map card.

Both files are generated by `tools/fetch_places.py`; please do not edit the YAML by hand.

## Wiring it up

```yaml
# configuration.yaml
homeassistant:
  packages: !include_dir_named packages
```

Afterwards 14 sensors are available. Their state is the collection area (or "Gemeindegebiet"
= the whole municipality), and the attributes `latitude`, `longitude`, `art`, `bereich`,
`hinweis` and `quelle` carry the details. The table above lists sensor, area, coordinate and
source for every one of them.

## Map card

```yaml
type: map
title: Müllsammelstellen Vösendorf
aspect_ratio: 16:9
default_zoom: 15
scale_ruler: true
show_all: true
```

`show_all: true` draws **all** entities that have coordinates – including phones or cars if
they are tracked by the companion app. If you only want the collection points, select them in
the map editor (their sensor names start with "Voesendorf…") or enter the entity IDs, which
Home Assistant lists under *Developer tools → States*.

```yaml
type: map
entities:
  - entity: sensor.voesendorf_asz
    label_mode: icon
  - entity: sensor.voesendorf_blumenerde_feuerwehrhaus
    label_mode: icon
```

The IDs above are examples – they depend on how Home Assistant converts the name
"automatically".

## Why is there no tile block?

The built-in map does not load tiles directly from OSM. Core routes everything through the
system integration `map_tiles`:

* `/api/map_tiles/vector/{z}/{x}/{y}.mvt` – vector tiles (`vector.openstreetmap.org`)
* `/api/map_tiles/raster/{z}/{x}/{y}.png` – raster tiles (`tile.openstreetmap.org`)
* plus glyphs, sprites and TileJSON, all of it with a token

The fetch happens server-side with an identifying User-Agent
(`HomeAssistant/<version> (+https://www.home-assistant.io)`) and is cached in memory –
exactly what the OSM tile policy asks for and what a browser cannot do. That is why the map
also works where embedding `tile.openstreetmap.org` directly is rejected with
`osm.wiki/Blocked`.

## Known gaps

* **Compost: Karglhaus** is missing. The calendar names the location, but neither
  OpenStreetMap nor the municipality's address list knows a "Karglhaus" in Vösendorf – rather
  than guessing, the point is left out. If you know the address, add an entry to `PLACES` in
  `tools/fetch_places.py` (e.g. with `"nominatim": "<address>"`) and run
  `python tools/fetch_places.py --refresh`.
* **Green-waste container Seepark/Spitz** is currently not included (no unambiguous point
  could be found); according to the municipality the "new location" of the Benyasiedlung
  will only follow in 2026.
* **Green-waste container Bachgasse**: the PDF says "Badgasse", the municipality website
  lists "Schlossplatz/Bachgasse" under Unterort – so Bachgasse was used.
* The positions come from street midpoints or geocoding and therefore mark the street, not
  the exact container. That is good enough for orientation; individual points can be fine-tuned
  in `data/places.json` and the YAML file.

## Regenerating

```bash
python tools/fetch_places.py            # uses the Overpass cache in build/
python tools/fetch_places.py --refresh  # queries Overpass and Nominatim again
python tests/test_places.py             # cross-check
```

Sources: addresses and lists from [voesendorf.gv.at](https://voesendorf.gv.at/gemeindeamt/wirtschaftshof/),
geometry from © OpenStreetMap contributors ([ODbL](https://www.openstreetmap.org/copyright)),
geocoding through Nominatim – please query sparingly.
