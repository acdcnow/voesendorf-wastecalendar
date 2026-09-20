/**
 * voesendorf-waste-card
 * ---------------------------------------------------------------------------
 * A self-contained Lovelace card for the waste collection calendar of the
 * Austrian municipality Vösendorf (2331 Vösendorf, Lower Austria).
 *
 * Features
 *   - pick your street, the card derives your collection area ("Abfuhrgebiet")
 *   - next collections with "tomorrow"/"in 3 days" hints
 *   - full-year mini calendar, colour coded like the official PDF
 *   - OpenStreetMap map with all three areas, colour coded per street
 *   - works without any integration: the calendar data is bundled in this file
 *
 * The card is generated from src/ + data/ by tools/build_card.py - the two
 * placeholders below are replaced with the real data at build time.
 *
 * Licence: MIT. Map data (c) OpenStreetMap contributors (ODbL).
 */

const VERSION = "__VERSION__";
const SCHEDULE = __SCHEDULE_DATA__;
const STREETS = __STREET_GEOJSON__;

const CARD_TYPE = "voesendorf-waste-card";
const STORAGE_KEY = "voesendorf-waste-card";

const ZONE_COLOURS = {
  oberort: "#e08a1e",
  unterort: "#3d7ebd",
  seepark: "#3f9e8f",
};
const TYPE_COLOURS = { RM: "#ef9d0c", RM4: "#8b5cf6", Bio: "#6ea83c" };
const TYPE_ORDER = ["RM", "RM4", "Bio"];

const LEAFLET = {
  css: [
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css",
  ],
  js: [
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
    "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js",
  ],
};

// Raster tiles served by the Home Assistant instance itself (map_tiles proxy).
// The proxy refuses requests without the rotating access token, and Leaflet
// substitutes the `token` layer option into the template.
const HA_TILES_PATH = "/api/map_tiles/raster/{z}/{x}/{y}.png?token={token}";

// Inline icons keep the card free of any Home Assistant component dependency.
const svgIcon = (path) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">` +
  `<path fill="currentColor" d="${path}"/></svg>`;
const ICONS = {
  details: svgIcon("M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6Z"),
  close: svgIcon("M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"),
  prev: svgIcon("M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59Z"),
  next: svgIcon("M8.59 16.59 10 18l6-6-6-6-1.41 1.41L13.17 12l-4.58 4.59Z"),
  today: svgIcon("M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"),
};

const STRINGS = {
  de: {
    next: "Nächste Abholungen",
    today: "heute",
    tomorrow: "morgen",
    inDays: "in {n} Tagen",
    nothing: "In den nächsten {n} Tagen ist keine Abholung geplant.",
    year: "Jahresübersicht {year}",
    area: "Abfuhrgebiet",
    street: "Straße",
    chooseStreet: "Straße wählen …",
    allAreas: "Alle Bereiche",
    map: "Karte",
    mapHint: "Klick auf eine Straße zeigt das Abfuhrgebiet.",
    mapUnavailable: "Karte nicht verfügbar (Leaflet konnte nicht geladen werden).",
    mapLoading: "Karte wird geladen …",
    mapAttribution: "Eigene Darstellung auf Basis von OpenStreetMap-Daten (ODbL)",
    mapAttributionTiles: "Kacheln: {provider}",
    mapAttributionHa: "Kacheln über den Home-Assistant-Kartenproxy (OpenStreetMap)",
    mapOffline: "ohne Kartenkacheln",
    details: "Details & Zusatztermine",
    monthPrev: "Voriger Monat",
    monthNext: "Nächster Monat",
    monthCurrent: "Aktueller Monat",
    close: "Schließen",
    mapTilesBlocked:
      "Der Kachelserver hat die Anfragen blockiert (tile.openstreetmap.org ist nicht für eingebettete Karten gedacht). Es wird die Offline-Karte ohne Kacheln angezeigt.",
    openInOsm: "In OpenStreetMap öffnen",
    legend: "Legende",
    holiday: "Feiertag",
    shifted: "verschobener Termin (Feiertag)",
    interval: "Intervall",
    containers: "Container im Gebiet",
    notes: "Hinweise",
    source: "Quelle",
    warningShared: "Diese Straße wird von zwei Abfuhrgebieten geteilt – bitte Termin mit der Gemeinde prüfen.",
    warningBeny: "Die Benyasiedlung wird im Kalender 2026 auf der Seepark-Seite geführt, die Gemeinde-Website nennt die Anton-Benya-Straße unter Oberort.",
    settings: "Einstellungen",
    hideSettings: "Einstellungen ausblenden",
    showExtras: "Zusatztermine (ASZ, Sperrmüll, Blumenerde)",
    asz: "Altstoffsammelzentrum",
    sperrmuell: "Sperrmüll",
    blumenerde: "Blumenerde-Aktion",
    byPhone: "nach telefonischer Vereinbarung: 01/699 03-35",
    closed: "Geschlossen",
    error: "Kalenderdaten konnten nicht gelesen werden.",
  },
  en: {
    next: "Next collections",
    today: "today",
    tomorrow: "tomorrow",
    inDays: "in {n} days",
    nothing: "No collection scheduled within the next {n} days.",
    year: "Year overview {year}",
    area: "Collection area",
    street: "Street",
    chooseStreet: "Choose your street …",
    allAreas: "All areas",
    map: "Map",
    mapHint: "Click a street to highlight its collection area.",
    mapUnavailable: "Map unavailable (Leaflet could not be loaded).",
    mapLoading: "Loading map …",
    mapAttribution: "Own rendering based on OpenStreetMap data (ODbL)",
    mapAttributionTiles: "Tiles: {provider}",
    mapAttributionHa: "Tiles via the Home Assistant map tile proxy (OpenStreetMap)",
    mapOffline: "no map tiles",
    details: "Details & extra dates",
    monthPrev: "Previous month",
    monthNext: "Next month",
    monthCurrent: "Current month",
    close: "Close",
    mapTilesBlocked:
      "The tile server blocked the requests (tile.openstreetmap.org is not meant for embedded maps). Showing the tile-less offline map instead.",
    openInOsm: "Open in OpenStreetMap",
    legend: "Legend",
    holiday: "Public holiday",
    shifted: "shifted date (public holiday)",
    interval: "Interval",
    containers: "Containers in the area",
    notes: "Notes",
    source: "Source",
    warningShared: "This street is shared by two collection areas – please double-check with the municipality.",
    warningBeny: "In the 2026 calendar the Benyasiedlung is listed on the Seepark page, while the municipality website lists Anton-Benya-Straße under Oberort.",
    settings: "Settings",
    hideSettings: "Hide settings",
    showExtras: "Additional dates (recycling centre, bulky waste, compost)",
    asz: "Recycling centre (ASZ)",
    sperrmuell: "Bulky waste",
    blumenerde: "Compost give-away",
    byPhone: "by phone: +43 1 699 03-35",
    closed: "Closed",
    error: "Could not read the calendar data.",
  },
};

const MONTHS = {
  de: ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August",
       "September", "Oktober", "November", "Dezember"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August",
       "September", "October", "November", "December"],
};
const WEEKDAYS = {
  de: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

/* ------------------------------------------------------------------ utils */

const iso = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function daysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / 86400000);
}

function normalise(name) {
  return name
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\(.*?\)/g, " ")
    .replace(/\b(dr|doktor)\b/g, " ")
    .replace(/[^a-z0-9]/g, "");
}

function loadOnce(urls, tag, attributes = {}) {
  return new Promise((resolve, reject) => {
    let index = 0;
    const attempt = () => {
      if (index >= urls.length) {
        reject(new Error(`could not load ${tag}`));
        return;
      }
      const url = urls[index++];
      const element = document.createElement(tag);
      if (tag === "link") {
        element.rel = "stylesheet";
        element.href = url;
      } else {
        element.src = url;
        element.async = true;
      }
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      element.onload = () => resolve(url);
      element.onerror = attempt;
      document.head.appendChild(element);
    };
    attempt();
  });
}

let leafletPromise = null;
function ensureLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  if (!leafletPromise) {
    leafletPromise = loadOnce(LEAFLET.js, "script")
      .then(() => window.L || Promise.reject(new Error("Leaflet missing")));
  }
  return leafletPromise;
}

/**
 * Leaflet's stylesheet has to live INSIDE the shadow root - document level CSS does
 * not reach shadow DOM, and without it the map panes are positioned wrongly.
 * The first CDN that answers wins; if all fail a small built-in subset is used.
 */
const MINIMAL_LEAFLET_CSS = `
.leaflet-container{overflow:hidden;-webkit-tap-highlight-color:transparent;}
.leaflet-pane,.leaflet-tile,.leaflet-marker-icon,.leaflet-marker-shadow,.leaflet-tile-container,
.leaflet-pane>svg,.leaflet-pane>canvas,.leaflet-zoom-box,.leaflet-image-layer,.leaflet-layer{
  position:absolute;left:0;top:0;}
.leaflet-container .leaflet-overlay-pane svg{max-width:none!important;max-height:none!important;}
.leaflet-container img.leaflet-tile{max-width:none!important;max-height:none!important;
  width:auto;padding:0;}
.leaflet-tile{filter:inherit;visibility:hidden;}
.leaflet-tile-loaded{visibility:inherit;}
.leaflet-pane{z-index:400;}
.leaflet-tile-pane{z-index:200;}.leaflet-overlay-pane{z-index:400;}
.leaflet-control{position:relative;z-index:800;pointer-events:visiblePainted;pointer-events:auto;}
.leaflet-top,.leaflet-bottom{position:absolute;z-index:1000;pointer-events:none;}
.leaflet-top{top:0;}.leaflet-right{right:0;}.leaflet-bottom{bottom:0;}.leaflet-left{left:0;}
.leaflet-control{margin:6px;}
.leaflet-bar{box-shadow:0 1px 5px rgba(0,0,0,.65);border-radius:4px;}
.leaflet-bar a{display:block;width:26px;height:26px;line-height:26px;text-align:center;
  text-decoration:none;background:#fff;color:#000;border-bottom:1px solid #ccc;}
.leaflet-control-zoom-in,.leaflet-control-zoom-out{font:bold 18px monospace;text-indent:1px;}
.leaflet-control-attribution{background:rgba(255,255,255,.8);padding:0 4px;margin:0;
  color:#333;font-size:11px;}
.leaflet-control-attribution a{color:#0078a8;}
.leaflet-container a{color:#0078a8;}
.leaflet-tooltip{position:absolute;padding:6px;background:#fff;border:1px solid #fff;
  border-radius:3px;color:#222;white-space:nowrap;pointer-events:none;
  box-shadow:0 1px 3px rgba(0,0,0,.4);font-size:12px;}
.leaflet-tooltip:before{content:"";position:absolute;border:6px solid transparent;}
.leaflet-interactive{cursor:pointer;}
`;

let leafletCssPromise = null;
function ensureLeafletCss() {
  if (!leafletCssPromise) {
    leafletCssPromise = (async () => {
      for (const url of LEAFLET.css) {
        try {
          const response = await fetch(url, { mode: "cors", credentials: "omit" });
          if (response.ok) return await response.text();
        } catch (error) {
          /* try the next mirror */
        }
      }
      return MINIMAL_LEAFLET_CSS;
    })();
  }
  return leafletCssPromise;
}

/* ------------------------------------------------------- schedule helpers */

/** All collection dates of a zone as { 'YYYY-MM-DD': ['RM','RM4','Bio'] }. */
function dateMap(zone) {
  const map = {};
  for (const type of TYPE_ORDER) {
    for (const day of (zone.dates && zone.dates[type]) || []) {
      (map[day] = map[day] || []).push(type);
    }
  }
  return map;
}

function streetIndex(schedule) {
  const index = new Map();
  for (const [slug, zone] of Object.entries(schedule.zones)) {
    const names = [...zone.streets];
    for (const street of Object.keys(zone.split_streets || {})) names.push(street);
    for (const name of names) {
      const key = normalise(name);
      if (!index.has(key)) index.set(key, []);
      if (!index.get(key).includes(slug)) index.get(key).push(slug);
    }
  }
  return index;
}

/* ------------------------------------------------------------------- card */

class VoesendorfWasteCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._zone = null;
    this._street = null;
    this._map = null;
    this._layers = {};
    this._tileMode = null;
    this._darkTiles = false;
    this._haToken = "";
    this._monthOffset = 0;      // 0 = current month, the card only shows one
    this._detailsOpen = false;  // the details dialog survives a re-render
    this._renderedHash = null;
    this._showSettings = false;
    this._streetsIndex = streetIndex(SCHEDULE);
  }

  static getStubConfig() {
    return { type: `custom:${CARD_TYPE}` };
  }

  setConfig(config) {
    if (!config) throw new Error("Invalid configuration");
    const zone = (config.zone || "auto").toLowerCase();
    if (zone !== "auto" && !SCHEDULE.zones[zone]) {
      throw new Error(`Unknown zone "${config.zone}" – valid: auto, ${Object.keys(SCHEDULE.zones).join(", ")}`);
    }
    this._config = {
      title: "Abfallkalender Vösendorf",
      show_map: true,
      show_types: TYPE_ORDER,
      days_ahead: 6,
      show_extras: true,
      map_height: 320,
      tile_url: "",            // empty = offline map, no requests to any tile server
      tile_attribution: "",
      tile_fallback: true,     // switch to the offline map if tiles are blocked
      tile_source: "",         // "" = offline | "ha" = tiles proxied by Home Assistant | "custom"
      ...config,
      zone,
    };
    if (config.street) this._setStreet(config.street, false);
    else this._zone = zone === "auto" ? this._zone : zone;
    if (!this._zone && zone !== "auto") this._zone = zone;
    this._renderedHash = null;
    this._render();
  }

  connectedCallback() {
    this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    const today = iso(new Date());
    if (first || this._today !== today) {
      this._today = today;
      this._monthOffset = 0;   // a new day: back to the current month
      this._render();
    }
    const dark = Boolean(hass && hass.themes && hass.themes.darkMode);
    if (this._tileMode && dark !== this._darkTiles) {
      const container = this.shadowRoot.getElementById("map");
      if (container) this._syncTileTheme(container);
    }
  }

  getCardSize() {
    return this._config && this._config.show_map ? 12 : 8;
  }

  get _zoneCount() {
    return Object.keys(SCHEDULE.zones).length;
  }

  /* ------------------------------------------------------------- helpers */

  get _lang() {
    const language = this._hass?.locale?.language || this._hass?.language || "de";
    return language.toLowerCase().startsWith("de") ? "de" : "en";
  }

  _t(key, replacements) {
    let text = STRINGS[this._lang][key] ?? STRINGS.de[key] ?? key;
    if (replacements) {
      for (const [name, value] of Object.entries(replacements)) {
        text = text.replace(`{${name}}`, value);
      }
    }
    return text;
  }

  _zoneEntry(slug) {
    const zone = SCHEDULE.zones[slug];
    return zone ? { slug, ...zone } : null;
  }

  _restoreState() {
    let saved = null;
    try {
      saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      saved = null;
    }
    if (saved?.street) this._setStreet(saved.street, false);
    else if (saved?.zone && SCHEDULE.zones[saved.zone]) this._zone = saved.zone;
  }

  _saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ zone: this._zone, street: this._street }));
    } catch (error) {
      /* private mode – ignore */
    }
  }

  _setStreet(street, render = true) {
    this._street = street;
    const zones = this._streetsIndex.get(normalise(street)) || [];
    this._zone = zones[0] || this._zone;
    if (render) {
      this._saveState();
      this._renderedHash = null;
      this._render();
    }
  }

  _setZone(slug, render = true) {
    this._zone = slug;
    if (render) {
      this._saveState();
      this._renderedHash = null;
      this._render();
    }
  }

  /** Streets that a zone contains, including the two shared ones. */
  _streetsOf(slug) {
    const zone = SCHEDULE.zones[slug];
    const shared = Object.keys(zone.split_streets || {});
    return [...zone.streets, ...shared];
  }

  _nextCollections(slug, days) {
    const zone = SCHEDULE.zones[slug];
    const map = dateMap(zone);
    const today = startOfDay(new Date());
    const limit = new Date(today.getTime() + days * 86400000);
    const entries = [];
    for (const [day, types] of Object.entries(map)) {
      const date = new Date(`${day}T00:00:00`);
      if (date >= today && date <= limit) {
        entries.push({ day, date, types: types.filter((t) => this._config.show_types.includes(t)) });
      }
    }
    return entries.sort((a, b) => a.day.localeCompare(b.day)).filter((e) => e.types.length);
  }

  _formatDay(date) {
    const language = this._lang === "de" ? "de-AT" : "en-GB";
    return new Intl.DateTimeFormat(language, { weekday: "long", day: "2-digit", month: "long" })
      .format(date);
  }

  _relative(date) {
    const diff = daysBetween(new Date(), date);
    if (diff === 0) return this._t("today");
    if (diff === 1) return this._t("tomorrow");
    return this._t("inDays", { n: diff });
  }

  /* -------------------------------------------------------------- render */

  _hash() {
    return JSON.stringify([this._zone, this._street, this._lang, this._today,
                           this._config.show_map, this._config.show_extras,
                           this._config.tile_url, this._config.tile_source,
                           this._config.map_height, this._monthOffset,
                           this._showSettings, this._config.show_types]);
  }

  _render() {
    if (!this._config || !this.isConnected) return;
    const hash = this._hash();
    if (hash === this._renderedHash && this.shadowRoot.querySelector(".card")) return;
    this._renderedHash = hash;
    this._restoreStateOnce();

    if (!this._zone) {
      this.shadowRoot.innerHTML = this._shell(this._bodyAllZones());
      this._attachHandlers();
      return;
    }
    const zone = this._zoneEntry(this._zone);
    this.shadowRoot.innerHTML = this._shell(this._bodyZone(zone));
    this._attachHandlers();
    if (this._config.show_map) this._renderMap(zone);
    if (this._detailsOpen) {
      const dialog = this.shadowRoot.getElementById("details");
      if (dialog) dialog.showModal();
    }
  }

  _restoreStateOnce() {
    if (this._restored) return;
    this._restored = true;
    if (!this._zone && !this._street) this._restoreState();
    if (!this._zone) {
      // nothing chosen yet: keep "all areas" overview but remember the state
      this._saveState();
    }
  }

  _shell(body) {
    return `
      <style>
        :host { display: block; }
        ha-card { overflow: hidden; }
        .card { padding: 16px; }
        h2 { margin: 0 0 4px; font-size: 1.15rem; font-weight: 500; color: var(--primary-text-color); }
        h3 { margin: 18px 0 8px; font-size: 1rem; font-weight: 500; color: var(--primary-text-color); }
        .muted { color: var(--secondary-text-color); font-size: .85rem; line-height: 1.4; }
        .row { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
        .grow { flex: 1 1 220px; min-width: 200px; }
        select, button {
          font: inherit; color: var(--primary-text-color); background: var(--card-background-color, transparent);
          border: 1px solid var(--divider-color); border-radius: 6px; padding: 8px 10px;
        }
        button { cursor: pointer; }
        button.ghost { border-color: transparent; color: var(--primary-color); padding: 6px 8px; }
        .pills { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
        .pill { display: inline-flex; align-items: center; gap: 6px; font-size: .85rem;
                padding: 3px 10px; border-radius: 999px; color: #fff; white-space: nowrap; }
        .type-RM { background: ${TYPE_COLOURS.RM}; }
        .type-RM4 { background: ${TYPE_COLOURS.RM4}; }
        .type-Bio { background: ${TYPE_COLOURS.Bio}; }
        .next { margin-top: 10px; display: flex; flex-direction: column; gap: 8px; }
        .next-row { display: flex; gap: 12px; align-items: baseline; padding: 8px 10px;
                    border-radius: 8px; background: var(--secondary-background-color, rgba(127,127,127,.08)); }
        .next-date { min-width: 168px; font-weight: 500; }
        .next-rel { color: var(--secondary-text-color); font-size: .85rem; }
        /* one month only: the full year made the card far too tall */
        .months { max-width: min(320px, 100%); }
        .month { border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px; }
        .month-name { font-size: .85rem; font-weight: 500; margin-bottom: 4px; }
        .month-head { display: flex; align-items: center; justify-content: space-between;
                      gap: 12px; margin: 18px 0 8px; }
        .month-head h3 { margin: 0; }
        .month-nav { display: flex; gap: 4px; }
        .icon-btn { display: inline-flex; align-items: center; justify-content: center;
                    width: 34px; height: 34px; padding: 0; border-radius: 50%;
                    border: 1px solid var(--divider-color); background: transparent;
                    color: var(--primary-text-color); cursor: pointer; }
        .icon-btn:hover:not([disabled]) { background: var(--secondary-background-color, rgba(127,127,127,.12)); }
        .icon-btn[disabled] { opacity: .3; cursor: default; }
        dialog#details { border: none; border-radius: 14px; padding: 0; margin: auto;
                         width: min(560px, 92vw); max-height: 85vh;
                         background: var(--card-background-color, #fff);
                         color: var(--primary-text-color);
                         box-shadow: 0 12px 44px rgba(0, 0, 0, .4); }
        dialog#details::backdrop { background: rgba(0, 0, 0, .45); }
        .dialog-head { display: flex; align-items: center; justify-content: space-between;
                       gap: 12px; padding: 12px 8px 12px 16px;
                       border-bottom: 1px solid var(--divider-color); }
        .dialog-head h3 { margin: 0; }
        .dialog-body { padding: 4px 16px 16px; overflow: auto; max-height: 66vh; }
        .days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
        .dow { font-size: .62rem; text-align: center; color: var(--secondary-text-color); }
        .day { position: relative; font-size: .68rem; text-align: center; line-height: 1.35;
               border-radius: 4px; color: var(--primary-text-color); }
        .day.out { visibility: hidden; }
        .day.marked { color: #fff; font-weight: 500; }
        .day.holiday { box-shadow: inset 0 0 0 1px #d9534f; }
        .day.today { outline: 2px solid var(--primary-color); outline-offset: -1px; }
        .dots { display: flex; gap: 2px; justify-content: center; margin-top: 1px; height: 5px; }
        .dot { width: 5px; height: 5px; border-radius: 50%; }
        .legend { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 8px; font-size: .8rem;
                  color: var(--secondary-text-color); }
        .legend span { display: inline-flex; align-items: center; gap: 5px; }
        .swatch { width: 12px; height: 12px; border-radius: 3px; display: inline-block; }
        #map { height: ${this._config?.map_height ?? 320}px; border-radius: 8px; margin-top: 8px;
               overflow: hidden; background: var(--secondary-background-color, rgba(127,127,127,.1)); }
        #map svg { display: block; width: 100%; height: 100%; }
        /* the offline map has no fixed aspect, so it may use more vertical space */
        #map.offline { height: auto; }
        #map.offline svg { height: auto; max-height: var(--map-max-height, 640px); }
        /* the raster tiles are inverted in dark mode, exactly like the built-in map */
        #map.dark-tiles .leaflet-tile {
          filter: invert(.9) hue-rotate(170deg) brightness(1.5) contrast(1.2) saturate(.3);
        }
        .zone-label { font-size: 26px; font-weight: 600; text-anchor: middle;
                      fill: var(--primary-text-color); fill-opacity: .55; }
        .map-foot { display: block; margin-top: 6px; font-size: .72rem;
                    color: var(--secondary-text-color); }
        .map-foot a { color: var(--secondary-text-color); }
        .zone-legend { display: flex; flex-wrap: wrap; gap: 4px 14px; margin-bottom: 4px;
                       font-size: .78rem; color: var(--primary-text-color); }
        .zone-key { display: inline-flex; align-items: center; gap: 5px; }
        .zone-key.active { font-weight: 600; }
        .map-attr { display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between; }
        .notice { margin-top: 8px; padding: 8px 10px; border-radius: 8px; font-size: .85rem;
                  background: rgba(217,83,79,.12); color: var(--primary-text-color); }
        .info-list { margin: 6px 0 0; padding-left: 18px; }
        .info-list li { margin-bottom: 2px; }
        footer { margin-top: 16px; display: flex; justify-content: space-between; gap: 12px;
                 flex-wrap: wrap; font-size: .75rem; color: var(--secondary-text-color); }
        footer a { color: var(--secondary-text-color); }
        .badge { font-size: .7rem; padding: 2px 8px; border-radius: 999px;
                 border: 1px solid var(--divider-color); color: var(--secondary-text-color); }
      </style>
      <ha-card>${body}</ha-card>`;
  }

  _header(zone, actions = "") {
    const title = this._config.title || "Abfallkalender Vösendorf";
    const subtitle = zone
      ? `${this._t("area")}: <strong>${zone.name}</strong>${this._street ? ` – ${this._street}` : ""}`
      : `${SCHEDULE.municipality.split(",")[0]} · ${SCHEDULE.year}`;
    const intervals = zone
      ? TYPE_ORDER.filter((type) => this._config.show_types.includes(type))
          .map((type) => `${SCHEDULE.legend[type].short}: ${this._weekdayName(zone.weekday[type])}`)
          .join(" · ")
      : "";
    return `
      <div class="row">
        <div class="grow">
          <h2>${title} ${zone ? "" : `<span class="badge">${SCHEDULE.year}</span>`}</h2>
          <div class="muted">${subtitle}</div>
        </div>
        ${intervals ? `<div class="badge">${intervals}</div>` : ""}
        ${actions}
      </div>
      ${this._streetPicker(zone)}`;
  }

  _streetPicker(zone) {
    const groups = Object.entries(SCHEDULE.zones).map(([slug, info]) => {
      const names = [...this._streetsOf(slug)].sort((a, b) => a.localeCompare(b, "de"));
      const options = names
        .map((name) => {
          const value = `${name}@@${slug}`;
          const selected = this._street === name && (!this._zone || this._zone === slug);
          return `<option value="${value}"${selected ? " selected" : ""}>${name}${
            (info.split_streets || {})[name] ? " (geteilt)" : ""}</option>`;
        })
        .join("");
      return `<optgroup label="${info.name}">${options}</optgroup>`;
    }).join("");
    return `
      <div class="row" style="margin-top:12px">
        <label class="grow">
          <span class="muted">${this._t("street")}</span>
          <select id="street" style="width:100%">
            <option value="">${this._t("chooseStreet")}</option>
            ${groups}
          </select>
        </label>
        <label>
          <span class="muted">${this._t("area")}</span>
          <select id="zone" style="width:100%">
            <option value="">${this._t("allAreas")}</option>
            ${Object.entries(SCHEDULE.zones).map(([slug, info]) =>
              `<option value="${slug}"${this._zone === slug ? " selected" : ""}>${info.name}</option>`).join("")}
          </select>
        </label>
      </div>`;
  }

  _bodyAllZones() {
    const cards = Object.entries(SCHEDULE.zones).map(([slug, zone]) => {
      const next = this._nextCollections(slug, this._config.days_ahead).slice(0, 2);
      return `
        <div class="next-row" data-zone="${slug}" style="cursor:pointer">
          <span class="swatch" style="background:${ZONE_COLOURS[slug]}"></span>
          <div class="grow">
            <div><strong>${zone.name}</strong> <span class="muted">${zone.description}</span></div>
            <div class="muted">${next.map((entry) =>
              `${this._formatDay(entry.date)}: ${entry.types.map((t) => SCHEDULE.legend[t].name).join(", ")}`
            ).join(" · ") || "–"}</div>
          </div>
        </div>`;
    }).join("");
    return `<div class="card">
      ${this._header(null)}
      <h3>${this._t("area")}</h3>
      <div class="next">${cards}</div>
      <div class="muted" style="margin-top:10px">${this._t("street")} → ${this._t("area")}</div>
    </div>`;
  }

  _bodyZone(zone) {
    const zone_colour = ZONE_COLOURS[zone.slug];
    const next = this._nextCollections(zone.slug, this._config.days_ahead);
    const dateMapZone = dateMap(zone);
    const shared = Object.keys(zone.split_streets || {});
    const ambiguous = this._street && shared.includes(this._street.replace(/\s*\(.*\)$/, ""));
    const benya = /benya/i.test(this._street || "");

    const nextHtml = next.length
      ? next.map((entry) => `
          <div class="next-row">
            <span class="next-date" style="color:${zone_colour}">${this._formatDay(entry.date)}</span>
            <span class="next-rel">${this._relative(entry.date)}</span>
            <span class="pills">${entry.types.map((type) =>
              `<span class="pill type-${type}">${SCHEDULE.legend[type].name}</span>`).join("")}</span>
          </div>`).join("")
      : `<div class="muted">${this._t("nothing", { n: this._config.days_ahead })}</div>`;

    const intervals = TYPE_ORDER
      .filter((type) => this._config.show_types.includes(type))
      .map((type) => `<span><span class="swatch" style="background:${TYPE_COLOURS[type]}"></span>
        ${SCHEDULE.legend[type].name} – ${SCHEDULE.legend[type].interval}
        (${this._weekdayName(zone.weekday[type])})</span>`).join("");

    const containers = (zone.containers || []).map((group) =>
      `<li><strong>${group.container}:</strong> ${group.places.join(", ")}</li>`).join("");
    const hasDetails = Boolean(containers) || (zone.notes || []).length > 0 ||
      Boolean(this._config.show_extras);
    const detailsButton = hasDetails
      ? `<button class="icon-btn" id="details-open" title="${this._t("details")}"` +
        ` aria-label="${this._t("details")}">${ICONS.details}</button>`
      : "";

    return `<div class="card">
      ${this._header({ ...zone, weekday: zone.weekday }, detailsButton)}
      ${ambiguous ? `<div class="notice">${this._t("warningShared")}</div>` : ""}
      ${benya ? `<div class="notice">${this._t("warningBeny")}</div>` : ""}
      <h3>${this._t("next")}</h3>
      <div class="next">${nextHtml}</div>
      <div class="legend">${intervals}</div>
      <div class="legend"><span><span class="swatch" style="background:#d9534f"></span>${this._t("holiday")}</span>
        <span><span class="swatch" style="box-shadow:inset 0 0 0 2px var(--primary-color)"></span>${this._t("today")}</span></div>
      ${this._config.show_map ? `
        <h3>${this._t("map")} <span class="muted" style="font-weight:400">– ${this._t("mapHint")}</span></h3>
        <div id="map-wrap"><div id="map"></div><div class="map-foot" id="map-foot"></div></div>` : ""}
      ${this._monthSection(dateMapZone)}
      <footer>
        <span><a href="${SCHEDULE.sources.info_page}" target="_blank" rel="noopener">
          ${this._t("source")}: Marktgemeinde Vösendorf</a> · ${SCHEDULE.year}</span>
        <span>Karte: © OpenStreetMap contributors</span>
      </footer>
      ${hasDetails ? this._detailsDialog(zone, containers) : ""}
    </div>`;
  }

  /**
   * One month at a time. The full year fitted badly on a dashboard, so the
   * calendar is limited to a single month (navigable inside the schedule year).
   */
  _monthSection(dateMapZone) {
    const base = new Date();
    const date = new Date(base.getFullYear(), base.getMonth() + this._monthOffset, 1);
    const first = new Date(SCHEDULE.year, 0, 1);
    const last = new Date(SCHEDULE.year, 11, 1);
    const nav = (id, label, icon, disabled) =>
      `<button class="icon-btn" id="${id}"${disabled ? " disabled" : ""}` +
      ` title="${label}" aria-label="${label}">${icon}</button>`;
    return `
      <div class="month-head">
        <h3>${MONTHS[this._lang][date.getMonth()]} ${date.getFullYear()}</h3>
        <div class="month-nav">
          ${nav("month-prev", this._t("monthPrev"), ICONS.prev, date <= first)}
          ${nav("month-current", this._t("monthCurrent"), ICONS.today, !this._monthOffset)}
          ${nav("month-next", this._t("monthNext"), ICONS.next, date >= last)}
        </div>
      </div>
      <div class="months">${this._monthHtml(dateMapZone, date)}</div>`;
  }

  /** Containers, notes and extra dates, tucked into a dialog to save space. */
  _detailsDialog(zone, containers) {
    const notes = (zone.notes || []).map((note) => `<li>${note}</li>`).join("");
    return `
      <dialog id="details" aria-label="${this._t("details")}">
        <div class="dialog-head">
          <h3>${this._t("details")}</h3>
          <button class="icon-btn" id="details-close" title="${this._t("close")}"
                  aria-label="${this._t("close")}">${ICONS.close}</button>
        </div>
        <div class="dialog-body">
          ${containers ? `<h3>${this._t("containers")}</h3><ul class="info-list muted">${containers}</ul>` : ""}
          ${notes ? `<h3>${this._t("notes")}</h3><ul class="info-list muted">${notes}</ul>` : ""}
          ${this._config.show_extras ? this._extrasHtml() : ""}
        </div>
      </dialog>`;
  }

  _weekdayName(short) {
    const index = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(short);
    return index >= 0 ? WEEKDAYS[this._lang][index] : short;
  }

  /** Grid of exactly one month (the heading lives in `_monthSection`). */
  _monthHtml(dateMapZone, date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const holidays = new Set(SCHEDULE.holidays.map((h) => h.date));
    const today = iso(new Date());
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const offset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday first
    let cells = WEEKDAYS[this._lang].map((dow) => `<div class="dow">${dow[0]}</div>`).join("");
    for (let i = 0; i < offset; i += 1) cells += `<div class="day out"></div>`;
    for (let day = 1; day <= daysInMonth; day += 1) {
      const key = iso(new Date(year, month, day));
      const types = (dateMapZone[key] || []).filter((t) => this._config.show_types.includes(t));
      const title = [
        this._formatDay(new Date(year, month, day)),
        types.map((t) => SCHEDULE.legend[t].name).join(", "),
        holidays.has(key) ? this._t("holiday") : "",
      ].filter(Boolean).join(" – ");
      const classes = ["day"];
      if (types.length) classes.push("marked");
      if (holidays.has(key)) classes.push("holiday");
      if (key === today) classes.push("today");
      const background = types.length
        ? `background:linear-gradient(135deg, ${types.map((t, i) =>
            `${TYPE_COLOURS[t]} ${(i / types.length) * 100}% ${((i + 1) / types.length) * 100}%`).join(", ")})`
        : "";
      cells += `<div class="${classes.join(" ")}" style="${background}" title="${title}">${day}</div>`;
    }
    return `<div class="month"><div class="days">${cells}</div></div>`;
  }

  _extrasHtml() {
    const extras = SCHEDULE.extras;
    const format = (isoDate) => this._shortDate(new Date(`${isoDate}T00:00:00`));
    const compost = extras.blumenerde.events.map((event) =>
      `${format(event.date)} ${event.time} (${event.place})`).join("<br>");
    const hours = Object.entries(extras.asz.hours)
      .map(([day, time]) => `${day}: ${time}`).join("<br>");
    const closed = extras.asz.closed
      .map((entry) => typeof entry === "string" ? entry
        : `${format(entry.date)}${entry.label ? ` (${entry.label})` : ""}`)
      .join(", ") + (extras.asz.closed_note ? `, ${extras.asz.closed_note}` : "");
    return `
      <h3>${this._t("showExtras")}</h3>
      <ul class="info-list muted">
        <li><strong>${this._t("asz")}:</strong><br>${hours}<br>
            ${this._t("closed")}: ${closed}</li>
        <li><strong>${this._t("sperrmuell")}:</strong> ${this._t("byPhone")}<br>
            ${extras.sperrmuell.note}</li>
        <li><strong>${this._t("blumenerde")}:</strong><br>${compost}</li>
      </ul>`;
  }

  _shortDate(date) {
    return new Intl.DateTimeFormat(this._lang === "de" ? "de-AT" : "en-GB",
      { day: "2-digit", month: "long" }).format(date);
  }

  /* --------------------------------------------------------------- events */

  _attachHandlers() {
    const street = this.shadowRoot.getElementById("street");
    if (street) {
      street.addEventListener("change", (event) => {
        const value = event.target.value;
        if (!value) {
          this._setZone("", true);
          return;
        }
        const [name, slug] = value.split("@@");
        this._street = name;
        this._zone = slug || this._zone;
        this._saveState();
        this._renderedHash = null;
        this._render();
      });
    }
    const zone = this.shadowRoot.getElementById("zone");
    if (zone) {
      zone.addEventListener("change", (event) => this._setZone(event.target.value, true));
    }
    this.shadowRoot.querySelectorAll("[data-zone]").forEach((element) => {
      element.addEventListener("click", () => this._setZone(element.dataset.zone, true));
    });

    // Details (containers, notes, extra dates) live in a dialog to keep the card small.
    const dialog = this.shadowRoot.getElementById("details");
    const openButton = this.shadowRoot.getElementById("details-open");
    if (dialog && openButton) {
      this._detailsOpen = dialog.open;
      openButton.addEventListener("click", () => {
        this._detailsOpen = true;
        dialog.showModal();
      });
      this.shadowRoot.getElementById("details-close")?.addEventListener("click", () => dialog.close());
      // A click on the backdrop targets the dialog element itself.
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
      dialog.addEventListener("close", () => { this._detailsOpen = dialog.open; });
    }

    const shiftMonth = (step) => {
      this._monthOffset += step;
      this._renderedHash = null;
      this._render();
    };
    this.shadowRoot.getElementById("month-prev")?.addEventListener("click", () => shiftMonth(-1));
    this.shadowRoot.getElementById("month-next")?.addEventListener("click", () => shiftMonth(1));
    this.shadowRoot.getElementById("month-current")?.addEventListener("click", () => {
      this._monthOffset = 0;
      this._renderedHash = null;
      this._render();
    });
  }

  /* ------------------------------------------------------------------ map */

  /** Leaflet's own CSS must be inside the shadow root, see ensureLeafletCss(). */
  _applyLeafletCss() {
    if (!this._leafletCss || this.shadowRoot.getElementById("leaflet-css")) return;
    const style = document.createElement("style");
    style.id = "leaflet-css";
    style.textContent = this._leafletCss;
    this.shadowRoot.prepend(style);
  }

  /** Every coordinate pair of the bundled geometry, split by "everything" and "selected area". */
  _mapPoints(zoneSlug) {
    const all = [];
    const focus = [];
    for (const feature of STREETS.features) {
      const geometry = feature.geometry;
      if (!geometry) continue;
      const rings = geometry.type === "Polygon" ? geometry.coordinates : [geometry.coordinates];
      for (const ring of rings) {
        for (const point of ring) {
          all.push(point);
          if ((feature.properties || {}).zone === zoneSlug) focus.push(point);
        }
      }
    }
    return { all, focus };
  }

  async _renderMap(zone) {
    const container = this.shadowRoot.getElementById("map");
    if (!container) return;
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
    // Default: no external requests at all. tile.openstreetmap.org is not intended for
    // embedded maps and blocks them, so tiles only load when they are asked for:
    // either tile_source: ha (Home Assistant proxies and caches the OSM tiles behind a
    // rotating token, sending the User-Agent OSM asks for) or a custom tile_url.
    const source = this._tileSource();
    if (source === "offline") {
      this._renderOfflineMap(container, zone, false);
      return;
    }
    container.classList.remove("offline");
    container.style.removeProperty("--map-max-height");
    container.innerHTML = `<div class="muted" style="padding:10px">${this._t("mapLoading")}</div>`;
    let token = "";
    if (source === "ha") {
      try {
        token = await this._haTilesToken(false);
      } catch (error) {
        // No proxy (older Home Assistant) or no connection: stay dependable.
        this._renderOfflineMap(container, zone, false);
        return;
      }
    }
    let L;
    try {
      L = await ensureLeaflet();
    } catch (error) {
      this._renderOfflineMap(container, zone, false);
      return;
    }
    this._leafletCss = await ensureLeafletCss();
    this._applyLeafletCss();
    container.innerHTML = "";
    this._tileMode = source;
    this._syncTileTheme(container);

    const provider = this._config.tile_attribution ||
      (this._config.tile_url.split("/")[2] || "tiles");
    const attribution = source === "ha"
      ? this._t("mapAttributionHa")
      : this._t("mapAttributionTiles", { provider });
    const map = L.map(container, { scrollWheelZoom: false, attributionControl: true });
    const layer = L.tileLayer(
      source === "ha" ? `${location.origin}${HA_TILES_PATH}` : this._config.tile_url,
      {
        maxZoom: 19,
        attribution: `${attribution} &copy; OpenStreetMap contributors`,
        // Leaflet substitutes every option into the URL template, so the rotating
        // proxy token can be swapped without recreating the layer.
        token,
      }).addTo(map);
    this._renderMapFoot(zone, `${attribution} &copy; OpenStreetMap contributors`);

    let tileErrors = 0;
    let tokenRetried = false;
    layer.on("tileerror", () => {
      tileErrors += 1;
      if (tileErrors < 3) return;
      if (source === "ha" && !tokenRetried) {
        // Core rotates the token every 30 minutes, so a stale one is worth a retry.
        tokenRetried = true;
        tileErrors = 0;
        this._haTilesToken(true).then((next) => {
          if (!next) return;
          layer.options.token = next;
          layer.redraw();
        }).catch(() => {});
        return;
      }
      if (this._config.tile_fallback) {
        layer.off("tileerror");
        this._renderOfflineMap(container, zone, true);
      }
    });

    const bounds = [];      // everything -> fallback view
    const zoneBounds = [];  // selected area -> preferred view
    for (const feature of STREETS.features) {
      const props = feature.properties || {};
      const geometry = feature.geometry;
      if (!geometry) continue;
      const latlngs = geometry.type === "LineString"
        ? geometry.coordinates.map(([lon, lat]) => [lat, lon])
        : null;

      if (props.kind === "rail") {
        L.polyline(latlngs, { color: "#7a7a7a", weight: 2, dashArray: "6 4", opacity: 0.8 })
          .bindTooltip("Badner Bahn").addTo(map);
        continue;
      }
      if (props.kind === "settlement") {
        const rings = geometry.coordinates.map((ring) => ring.map(([lon, lat]) => [lat, lon]));
        const active = props.zone === zone.slug;
        L.polygon(rings, {
          color: ZONE_COLOURS[props.zone] || "#888",
          weight: 1,
          fillColor: ZONE_COLOURS[props.zone] || "#888",
          fillOpacity: active ? 0.28 : 0.12,
        }).bindTooltip(`${props.street} – ${SCHEDULE.zones[props.zone]?.name || ""}`).addTo(map);
        rings.flat().forEach((point) => bounds.push(point));
        if (active) rings.flat().forEach((point) => zoneBounds.push(point));
        continue;
      }
      if (!latlngs) continue;
      const colour = ZONE_COLOURS[props.zone] || "#888";
      const active = props.zone === zone.slug;
      const line = L.polyline(latlngs, {
        color: props.shared ? "#9e9e9e" : colour,
        weight: active ? 5 : 3,
        opacity: active ? 0.95 : 0.35,
        dashArray: props.shared ? "4 4" : null,
      }).addTo(map);
      line.bindTooltip(`${props.street} – ${SCHEDULE.zones[props.zone]?.name || ""}` +
        (props.shared ? ` (${props.part || "geteilt"})` : ""));
      line.on("click", () => {
        if (props.zone && props.zone !== zone.slug) this._setZone(props.zone, true);
      });
      latlngs.forEach((point) => bounds.push(point));
      if (active) latlngs.forEach((point) => zoneBounds.push(point));
    }

    this._map = map;

    // The card was just rendered, so the container may not have its final size yet.
    // fitBounds() would then compute a wrong zoom, so the view is applied explicitly
    // as soon as a sane size is known (checked again on the first resize).
    const target = zoneBounds.length > 4 ? zoneBounds : bounds;
    const applyView = () => {
      const size = map.getSize();
      if (size.x < 80 || size.y < 80 || !target.length) return false;
      const box = L.latLngBounds(target);
      map.setView(box.getCenter(), map.getBoundsZoom(box, false, L.point(24, 24)),
                  { animate: false });
      return true;
    };
    if (!applyView()) setTimeout(applyView, 150);

    this._resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
      if (!this._viewApplied) this._viewApplied = applyView();
    });
    this._resizeObserver.observe(container);
    map.on("dragstart", () => { this._viewApplied = true; });
  }

  /**
   * Tile-less map: the bundled street geometry is drawn as SVG. No network access,
   * nothing to be blocked - this is the default because tile.openstreetmap.org
   * blocks embedded/third-party usage.
   */
  _renderOfflineMap(container, zone, tilesBlocked) {
    const { all, focus } = this._mapPoints(zone.slug);
    const use = focus.length > 8 ? focus : all;
    if (!use.length) {
      container.innerHTML = "";
      return;
    }

    const lats = use.map((point) => point[1]);
    const midLat = (Math.min(...lats) + Math.max(...lats)) / 2;
    const shrink = Math.cos((midLat * Math.PI) / 180);   // keep the aspect ratio
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [lon, lat] of use) {
      minX = Math.min(minX, lon * shrink);
      maxX = Math.max(maxX, lon * shrink);
      minY = Math.min(minY, lat);
      maxY = Math.max(maxY, lat);
    }
    const padX = (maxX - minX || 0.002) * 0.10;
    const padY = (maxY - minY || 0.002) * 0.10;
    minX -= padX; maxX += padX; minY -= padY; maxY += padY;
    const width = maxX - minX;
    const height = maxY - minY;
    const svgHeight = 1000 * (height / width);
    const project = ([lon, lat]) => [
      (((lon * shrink) - minX) / width) * 1000,
      ((maxY - lat) / height) * svgHeight,
    ];
    const toPath = (ring, close) => ring
      .map((point, index) => {
        const [x, y] = project(point);
        return `${index ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + (close ? " Z" : "");

    const parts = [];
    const centroids = {};
    for (const feature of STREETS.features) {
      const props = feature.properties || {};
      const geometry = feature.geometry;
      if (!geometry) continue;
      const zoneName = SCHEDULE.zones[props.zone]?.name || "";
      if (props.zone) {
        const ring = geometry.type === "Polygon" ? geometry.coordinates[0] : geometry.coordinates;
        const middle = ring[Math.floor(ring.length / 2)];
        const bucket = (centroids[props.zone] = centroids[props.zone] || { x: 0, y: 0, n: 0 });
        const [x, y] = project(middle);
        bucket.x += x; bucket.y += y; bucket.n += 1;
      }
      if (props.kind === "rail") {
        parts.push(`<path d="${toPath(geometry.coordinates, false)}" fill="none" stroke="#8d8d8d"` +
          ` stroke-width="2.5" stroke-dasharray="10 7" opacity=".8"><title>Badner Bahn</title></path>`);
        continue;
      }
      if (props.kind === "settlement") {
        const active = props.zone === zone.slug;
        const colour = ZONE_COLOURS[props.zone] || "#999";
        parts.push(`<path d="${toPath(geometry.coordinates[0], true)}" fill="${colour}"` +
          ` fill-opacity="${active ? 0.3 : 0.13}" stroke="${colour}" stroke-width="1.5"` +
          ` data-map-zone="${props.zone}"><title>${props.street} – ${zoneName}</title></path>`);
        continue;
      }
      const active = props.zone === zone.slug;
      const colour = props.shared ? "#9e9e9e" : (ZONE_COLOURS[props.zone] || "#999");
      parts.push(`<path d="${toPath(geometry.coordinates, false)}" fill="none" stroke="${colour}"` +
        ` stroke-width="${active ? 4.5 : 2.5}" stroke-opacity="${active ? 0.95 : 0.4}"` +
        ` stroke-linecap="round" stroke-linejoin="round"` +
        `${props.shared ? ' stroke-dasharray="6 4"' : ""}` +
        ` data-map-zone="${props.zone}">` +
        `<title>${props.street} – ${zoneName}${props.shared ? ` (${props.part || "geteilt"})` : ""}</title>` +
        "</path>");
    }

    const labels = Object.entries(centroids)
      .filter(([, bucket]) => bucket.n)
      .map(([slug, bucket]) => {
        const [x, y] = [bucket.x / bucket.n, bucket.y / bucket.n];
        return `<text class="zone-label" x="${x.toFixed(0)}" y="${y.toFixed(0)}"` +
          ` data-map-zone="${slug}">${SCHEDULE.zones[slug]?.name || slug}</text>`;
      });

    const centre = [(minY + maxY) / 2, (minX + maxX) / 2 / shrink];
    this._tileMode = null;
    container.classList.add("offline");
    container.classList.remove("dark-tiles");
    container.style.setProperty("--map-max-height",
      `${Math.max((this._config.map_height || 320) * 2, 480)}px`);
    container.innerHTML = `
      <svg viewBox="0 0 1000 ${svgHeight.toFixed(0)}" preserveAspectRatio="xMidYMid meet"
           role="img" aria-label="${this._t("map")}">
        <rect x="0" y="0" width="1000" height="${svgHeight.toFixed(0)}"
              fill="var(--secondary-background-color, #f2f2f2)"/>
        ${parts.join("")}
        ${labels.join("")}
      </svg>`;
    this._renderMapFoot(zone, `${this._t("mapAttribution")} · ${this._t("mapOffline")}`, {
      link: `<a href="https://www.openstreetmap.org/#map=14/${centre[0].toFixed(5)}/${centre[1].toFixed(5)}"` +
        ` target="_blank" rel="noopener">${this._t("openInOsm")}</a>`,
      notice: tilesBlocked ? this._t("mapTilesBlocked") : "",
    });
  }

  /** Tile mode requested by the configuration. */
  _tileSource() {
    if ((this._config.tile_source || "").toLowerCase() === "ha") return "ha";
    if (this._config.tile_url) return "custom";
    return "offline";
  }

  /**
   * The built-in map does not load tiles from OpenStreetMap directly: core proxies
   * and caches them and sends the identifying User-Agent that the OSM tile policy
   * asks for, which a browser cannot send. Asking the instance for a token therefore
   * gives us the same tiles without ever tripping the anti-abuse block.
   */
  async _haTilesToken(force) {
    const connection = this._hass && this._hass.connection;
    if (!connection || !connection.sendMessagePromise) {
      throw new Error("Home Assistant connection unavailable");
    }
    if (!force && this._haToken) return this._haToken;
    const result = await connection.sendMessagePromise({ type: "map_tiles/access_token" });
    this._haToken = (result && result.token) || "";
    return this._haToken;
  }

  /** Raster tiles are inverted in dark mode, exactly like the built-in map does. */
  _syncTileTheme(container) {
    this._darkTiles = Boolean(this._hass && this._hass.themes && this._hass.themes.darkMode);
    container.classList.toggle("dark-tiles", this._darkTiles);
  }

  /** Legend and attribution below the map, shared by the SVG and the tile map. */
  _renderMapFoot(zone, attribution, options = {}) {
    const foot = this.shadowRoot.getElementById("map-foot");
    if (!foot) return;
    const legend = Object.entries(SCHEDULE.zones).map(([slug, info]) => {
      const days = TYPE_ORDER.filter((type) => info.weekday?.[type])
        .map((type) => `${SCHEDULE.legend[type].short}: ${this._weekdayName(info.weekday[type])}`)
        .join(" · ");
      return `<span class="zone-key${slug === zone.slug ? " active" : ""}" data-map-zone="${slug}">` +
        `<span class="swatch" style="background:${ZONE_COLOURS[slug]}"></span>${info.name}` +
        `<span class="muted">${days}</span></span>`;
    }).join("");
    foot.innerHTML = `
      <div class="zone-legend">${legend}</div>
      <div class="map-attr"><span>${attribution}</span>${options.link || ""}</div>` +
      (options.notice ? `<div class="notice" style="margin-top:4px">${options.notice}</div>` : "");

    this.shadowRoot.querySelectorAll("[data-map-zone]").forEach((node) => {
      const slug = node.dataset.mapZone;
      if (SCHEDULE.zones[slug] && slug !== this._zone) {
        node.style.cursor = "pointer";
        node.addEventListener("click", () => this._setZone(slug, true));
      }
    });
  }

  disconnectedCallback() {
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
  }
}

/* A second evaluation of this module (manual install next to a HACS copy, or a cached
   and a fresh file) must not throw "the name has already been used with this registry". */
if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, VoesendorfWasteCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: "Vösendorf Abfallkalender",
    description: "Müllabfuhrkalender der Marktgemeinde Vösendorf mit Karte und Jahresübersicht",
    preview: false,
    documentationURL: "https://github.com/acdcnow/voesendorf-wastecalendar",
  });
}

console.info(`%c ${CARD_TYPE} %c v${VERSION} `, "color:white;background:#3f9e8f", "color:#3f9e8f;background:white");
