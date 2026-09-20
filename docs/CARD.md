# Lovelace-Karte `voesendorf-waste-card`

Eigenständige Karte für den Vösendorfer Müllabfuhrkalender. Sie enthält die Termine des
laufenden Jahres (in `dist/voesendorf-waste-card.js` eingebettet) und benötigt **keine**
Integration sowie **keine Internetverbindung**: die Karte wird aus den mitgelieferten
Straßengeometrien direkt als SVG gezeichnet (keine Kartenkacheln, kein Leaflet-Download).

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
| `show_map` | bool | `true` | Karte der drei Gebiete anzeigen (offline, ohne Kacheln) |
| `map_height` | int | `320` | Höhe der Karte in Pixel |
| `tile_source` | string | `""` | **Leer = Offline-Karte.** `ha` lädt echte Kartenkacheln über den Kartenproxy der eigenen Home-Assistant-Instanz (siehe unten) |
| `tile_url` | string | `""` | Eigene Kachel-URL, z. B. `https://tiles.example.com/{z}/{x}/{y}.png`; wird ignoriert wenn `tile_source: ha` gesetzt ist |
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
```

### Kartenkacheln (optional)

Standardmäßig sind **keine** Kacheln aktiv. Das hat einen praktischen Grund: die
freiwillig betriebenen Server von `tile.openstreetmap.org` sind nicht für eingebettete
Karten gedacht und antworten auf solche Anfragen mit einer Sperre
([osm.wiki/Blocked](https://osm.wiki/Blocked)). Deshalb zeichnet die Karte die Straßen
selbst – das ist schnell, funktioniert offline und löst keine Sperre aus.

**Kacheln über Home Assistant (`tile_source: ha`)**

Die eingebaute Kartenkarte lädt ihre Kacheln nicht direkt von OSM: Core proxyt und cacht
sie (Systemintegration `map_tiles`) und schickt dabei den identifizierenden User-Agent,
den die OSM-Tile-Policy verlangt und den ein Browser nicht senden kann. Dieselben Kacheln
lassen sich auch in dieser Karte verwenden:

```yaml
type: custom:voesendorf-waste-card
zone: oberort
tile_source: ha
```

Die Karte holt sich dazu über `map_tiles/access_token` einen Token (rotiert alle 30
Minuten) und lädt `/api/map_tiles/raster/{z}/{x}/{y}.png?token=…` von der eigenen Instanz.
Schlägt das fehl – ältere Home-Assistant-Version, keine Verbindung, blockierte Kacheln –
fällt sie automatisch auf die Offline-Karte zurück. In diesem Modus lädt die Karte Leaflet
von einem CDN; die Offline-Karte braucht das nicht.

**Eigener Kachelserver (`tile_url`)**

Wer einen Anbieter hat, dessen Nutzungsbedingungen eingebettete Karten erlauben, trägt
dessen URL ein:

```yaml
type: custom:voesendorf-waste-card
zone: oberort
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
* **Karte:** Straßen sind in der Farbe ihres Gebiets eingezeichnet, das gewählte Gebiet
  hervorgehoben. Klick auf eine Straße, eine Gebietsbeschriftung oder einen Eintrag der
  Legende wechselt das Gebiet (Tooltip zeigt Straße und Gebiet). Die **Badner Bahn** ist
  grau gestrichelt dargestellt, Siedlungen (z. B. Seeparksiedlung) sind leicht gefüllt.
  Geteilte Straßen (`Ortsstraße`, `Schönbrunner Allee`) sind grau, weil sie zu zwei
  Gebieten gehören. Unter der Karte stehen die Legende (Gebiet + Abfuhrtage) sowie ein
  Link, der die Kartenmitte in OpenStreetMap öffnet.
* **Jahresübersicht:** farbige Tage wie im amtlichen PDF; Feiertage sind rot umrandet, der
  heutige Tag ist hervorgehoben. Tooltip beim Überfahren zeigt Datum und Abfallarten.

## Hinweise

* Die Karte liest die Uhrzeit des Browsers; „heute/morgen“ bezieht sich daher auf das
  Gerät, auf dem das Dashboard angezeigt wird.
* Die Kartendaten (Straßenverläufe) stammen aus OpenStreetMap (ODbL) und werden über die
  Overpass-API bezogen (einmalig beim Erzeugen von `data/streets.geojson`). Die Karte
  selbst ist eigenständig gezeichnet und kommt ohne Netzzugriff aus; Leaflet wird nur
  geladen, wenn Kacheln (`tile_source: ha` oder `tile_url`) verwendet werden.
* Wer die Standorte (ASZ, Müllinseln, Grünschnittcontainer) auf der **eingebauten**
  Kartenkarte zeigen will, findet Paket und Anleitung in [`PLACES.md`](PLACES.md).
* Zeitzone/Sprache: Die Beschriftungen richten sich nach der Sprache des Browsers
  (`de` oder `en`).
* Fehler gefunden? Bitte ein Issue im Repository anlegen – die Rohdaten lassen sich mit
  `python tools/build_data.py` neu erzeugen.
