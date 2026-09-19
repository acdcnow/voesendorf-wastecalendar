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
      this._render();
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
        .months { display: grid; grid-template-columns: repeat(auto-fill, minmax(148px, 1fr)); gap: 12px; }
        .month { border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px; }
        .month-name { font-size: .85rem; font-weight: 500; margin-bottom: 4px; }
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
               background: var(--secondary-background-color, rgba(127,127,127,.1)); }
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

  _header(zone) {
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

    return `<div class="card">
      ${this._header({ ...zone, weekday: zone.weekday })}
      ${ambiguous ? `<div class="notice">${this._t("warningShared")}</div>` : ""}
      ${benya ? `<div class="notice">${this._t("warningBeny")}</div>` : ""}
      <h3>${this._t("next")}</h3>
      <div class="next">${nextHtml}</div>
      <div class="legend">${intervals}</div>
      <div class="legend"><span><span class="swatch" style="background:#d9534f"></span>${this._t("holiday")}</span></div>
      ${this._config.show_map ? `
        <h3>${this._t("map")} <span class="muted" style="font-weight:400">– ${this._t("mapHint")}</span></h3>
        <div id="map"></div>` : ""}
      <h3>${this._t("year", { year: SCHEDULE.year })}</h3>
      <div class="months">${this._monthsHtml(dateMapZone)}</div>
      ${containers ? `<h3>${this._t("containers")}</h3><ul class="info-list muted">${containers}</ul>` : ""}
      ${(zone.notes || []).length ? `<h3>${this._t("notes")}</h3>
        <ul class="info-list muted">${zone.notes.map((note) => `<li>${note}</li>`).join("")}</ul>` : ""}
      ${this._config.show_extras ? this._extrasHtml() : ""}
      <footer>
        <span><a href="${SCHEDULE.sources.info_page}" target="_blank" rel="noopener">
          ${this._t("source")}: Marktgemeinde Vösendorf</a> · ${SCHEDULE.year}</span>
        <span>Karte: © OpenStreetMap contributors</span>
      </footer>
    </div>`;
  }

  _weekdayName(short) {
    const index = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(short);
    return index >= 0 ? WEEKDAYS[this._lang][index] : short;
  }

  _monthsHtml(dateMapZone) {
    const year = SCHEDULE.year;
    const holidays = new Set(SCHEDULE.holidays.map((h) => h.date));
    const today = iso(new Date());
    let html = `<div class="legend" style="margin-bottom:10px">
      <span><span class="swatch" style="background:${TYPE_COLOURS.RM}"></span>Restmüll 14-tägig</span>
      <span><span class="swatch" style="background:${TYPE_COLOURS.RM4}"></span>Restmüll 4-wöchig</span>
      <span><span class="swatch" style="background:${TYPE_COLOURS.Bio}"></span>Biomüll</span>
      <span><span class="swatch" style="background:transparent;box-shadow:inset 0 0 0 1px #d9534f"></span>${this._t("holiday")}</span>
      <span><span class="swatch" style="background:transparent;box-shadow:inset 0 0 0 2px var(--primary-color)"></span>${this._t("today")}</span>
    </div>`;

    for (let month = 0; month < 12; month += 1) {
      const first = new Date(year, month, 1);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const offset = (first.getDay() + 6) % 7; // Monday first
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
      html += `<div class="month"><div class="month-name">${MONTHS[this._lang][month]}</div>
        <div class="days">${cells}</div></div>`;
    }
    return html;
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

  async _renderMap(zone) {
    const container = this.shadowRoot.getElementById("map");
    if (!container) return;
    container.innerHTML = `<div class="muted" style="padding:10px">${this._t("mapLoading")}</div>`;
    let L;
    try {
      L = await ensureLeaflet();
    } catch (error) {
      container.innerHTML = `<div class="muted" style="padding:10px">${this._t("mapUnavailable")}</div>`;
      return;
    }
    this._leafletCss = await ensureLeafletCss();
    this._applyLeafletCss();
    container.innerHTML = "";
    const map = L.map(container, { scrollWheelZoom: false, attributionControl: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

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

    if (this._resizeObserver) this._resizeObserver.disconnect();
    this._resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
      if (!this._viewApplied) this._viewApplied = applyView();
    });
    this._resizeObserver.observe(container);
    map.on("dragstart", () => { this._viewApplied = true; });
  }

  disconnectedCallback() {
    if (this._resizeObserver) this._resizeObserver.disconnect();
    if (this._map) {
      this._map.remove();
      this._map = null;
    }
  }
}

customElements.define(CARD_TYPE, VoesendorfWasteCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TYPE,
  name: "Vösendorf Abfallkalender",
  description: "Müllabfuhrkalender der Marktgemeinde Vösendorf mit Karte und Jahresübersicht",
  preview: false,
  documentationURL: "https://github.com/acdcnow/voesendorf-wastecalendar",
});

console.info(`%c ${CARD_TYPE} %c v${VERSION} `, "color:white;background:#3f9e8f", "color:#3f9e8f;background:white");
