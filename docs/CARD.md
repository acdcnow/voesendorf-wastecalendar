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
