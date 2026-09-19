# Lovelace-Karte `voesendorf-waste-card`

Eigenständige Karte für den Vösendorfer Müllabfuhrkalender. Sie enthält die Termine des
laufenden Jahres (in `dist/voesendorf-waste-card.js` eingebettet) und benötigt **keine**
Integration. Nur für die Kartenkacheln wird eine Internetverbindung benötigt.

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
| `show_map` | bool | `true` | OpenStreetMap-Karte mit den drei Gebieten anzeigen |
| `map_height` | int | `320` | Höhe der Karte in Pixel |
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

Wird weder `zone` noch `street` gesetzt, zeigt die Karte eine Übersicht aller drei Gebiete
und die Auswahlfelder für Straße und Gebiet.

## Bedienung

* **Straße / Abfuhrgebiet** in den Auswahlfeldern werden im Browser gespeichert
  (`localStorage`) und beim nächsten Aufruf wiederhergestellt.
* **Karte:** Straßen sind in der Farbe ihres Gebiets eingezeichnet, das gewählte Gebiet
  hervorgehoben. Klick auf eine Straße oder ein Gebiet wechselt das Gebiet (Tooltip zeigt
  Straße und Gebiet). Die **Badner Bahn** ist grau gestrichelt dargestellt, Siedlungen
  (z. B. Seeparksiedlung) sind leicht gefüllt. Geteilte Straßen (`Ortsstraße`,
  `Schönbrunner Allee`) sind grau, weil sie zu zwei Gebieten gehören.
* **Jahresübersicht:** farbige Tage wie im amtlichen PDF; Feiertage sind rot umrandet, der
  heutige Tag ist hervorgehoben. Tooltip beim Überfahren zeigt Datum und Abfallarten.

## Hinweise

* Die Karte liest die Uhrzeit des Browsers; „heute/morgen“ bezieht sich daher auf das
  Gerät, auf dem das Dashboard angezeigt wird.
* Die Kartendaten (Straßenverläufe) stammen aus OpenStreetMap (ODbL) und werden über die
  Overpass-API bezogen; Leaflet wird bei Bedarf vom CDN geladen. Ist kein Internet
  verfügbar, funktionieren alle Terminlisten trotzdem – nur die Karte fehlt.
* Zeitzone/Sprache: Die Beschriftungen richten sich nach der Sprache des Browsers
  (`de` oder `en`).
* Fehler gefunden? Bitte ein Issue im Repository anlegen – die Rohdaten lassen sich mit
  `python tools/build_data.py` neu erzeugen.
