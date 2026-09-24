/**
 * voesendorf-waste-card
 * ---------------------------------------------------------------------------
 * A self-contained Lovelace card for the waste collection calendar of the
 * Austrian municipality Vösendorf (2331 Vösendorf, Lower Austria).
 *
 * Features
 *   - pick your street, the card derives your collection area ("Abfuhrgebiet")
 *   - next collections with "tomorrow"/"in 3 days" hints
 *   - single-month calendar, colour coded like the official PDF
 *   - containers, notes and the extra dates in a dialog
 *   - works without an integration and without a single network request: the
 *     calendar data is bundled in this file - there is no map and no Leaflet
 *
 * The card is generated from src/ + data/ by tools/build_card.py - the
 * placeholder below is replaced with the real data at build time.
 *
 * Licence: GNU General Public License v3.0 (see LICENSE).
 */

const VERSION = "2.0.0";
const SCHEDULE = {"year":2026,"municipality":"Marktgemeinde Vösendorf, 2331 Vösendorf, Schlossplatz 1","sources":{"info_page":"https://voesendorf.gv.at/buergerservice/muellkalender/","pdf":"https://voesendorf.gv.at/wp-content/uploads/2021/09/Muellkalender-2026_web.pdf","street_geometry":"OpenStreetMap (ODbL) via Overpass API"},"generated":"2026-09-20","legend":{"RM":{"name":"Restmüll","short":"RM","interval":"14-tägig","description":"Restmülltonne, 14-tägige Abholung"},"RM4":{"name":"Restmüll (4-wöchig)","short":"RM4","interval":"4-wöchig","description":"Restmülltonne mit 4-wöchigem Rhythmus; wird am selben Tag wie die 14-tägige Sammlung abgeholt"},"Bio":{"name":"Biomüll","short":"Bio","interval":"14-tägig / wöchentlich","description":"14-tägig im Winter, wöchentlich vom Frühjahr bis Ende September"}},"zones":{"oberort":{"name":"Oberort","description":"Nördlicher/westlicher Ortsteil, Triester Straße, Haidfeld- und Kalesasiedlung","weekday":{"RM":"Tue","RM4":"Tue","Bio":"Wed"},"colours":{"RM":"#f0a000","RM4":"#a78bfa","Bio":"#7cb342"},"streets":["Am Haidegrund","Am Petersbach","Baslergasse","Böheimgasse","Doktor-Robert-Firneis-Straße","Dr. Karl Renner-Gasse","Dr. Pertich-Gasse","Franz Gruber-Gasse","Franz Schubert-Gasse","Franz Spiegel-Gasse","Fritz Schmerold-Gasse","Haidfeldstraße","Heinrich Tröber-Gasse","Jakob Janisch-Gasse","Karl Weiss-Gasse","Konsumstraße","Leopold Mandl-Gasse","Marktstraße","Mitterberggasse","Raimundgasse","Rossödengasse","Schweizer Gasse","Sperlinggasse","Stefan Brauneder-Gasse","Leopold Stipcak-Gasse","Triester Straße","Weinberggasse","Willi Hafenscher-Gasse","Haidfeldsiedlung","Kalesasiedlung","Roseggersiedlung"],"split_streets":{"Ortsstraße":"Badner Bahn bis Pizzeria Fontana","Schönbrunner Allee":"Pizzeria Fontana bis Badner Bahn"},"containers":[{"container":"Grünschnittcontainer","places":["Franz Spiegel-Gasse","Konsumstraße","Mitterberggasse"]}],"notes":["Kein Müllinsel-Standort im Abfuhrgebiet Oberort."],"dates":{"RM":["2026-01-13","2026-01-27","2026-02-10","2026-02-24","2026-03-10","2026-03-24","2026-04-07","2026-04-21","2026-05-05","2026-05-19","2026-06-02","2026-06-16","2026-06-30","2026-07-14","2026-07-28","2026-08-11","2026-08-25","2026-09-08","2026-09-22","2026-10-06","2026-10-20","2026-11-03","2026-11-17","2026-12-01","2026-12-15","2026-12-29"],"RM4":["2026-01-13","2026-02-10","2026-03-10","2026-04-07","2026-05-05","2026-06-02","2026-06-30","2026-07-28","2026-08-25","2026-09-22","2026-10-20","2026-11-17","2026-12-15"],"Bio":["2026-01-14","2026-01-28","2026-02-11","2026-02-25","2026-03-11","2026-03-25","2026-04-08","2026-04-22","2026-04-29","2026-05-06","2026-05-13","2026-05-20","2026-05-27","2026-06-03","2026-06-10","2026-06-17","2026-06-24","2026-07-01","2026-07-08","2026-07-15","2026-07-22","2026-07-29","2026-08-05","2026-08-12","2026-08-19","2026-08-26","2026-09-02","2026-09-09","2026-09-16","2026-09-23","2026-09-30","2026-10-14","2026-10-28","2026-11-11","2026-11-25","2026-12-09","2026-12-23"]}},"unterort":{"name":"Unterort","description":"Südöstlicher Ortsteil rund um Schlossplatz, Laxenburger Straße und Roßdorfstraße","weekday":{"RM":"Tue","RM4":"Tue","Bio":"Wed"},"colours":{"RM":"#f0a000","RM4":"#a78bfa","Bio":"#7cb342"},"streets":["Bachgasse","Birkenweg","Brunnerweg","Föhrengasse","Freiheitsstraße","Hutweidenweg","Jordanstraße","Kindbergstraße","Klausengasse","Laxenburger Straße","Lindengasse","Meisengasse","Mühlfeldgasse","Mühlgasse","Roßdorfstraße","Schlossplatz","Taubengasse","Zeisiggasse","Jordansiedlung","Tröbersiedlung"],"split_streets":{"Ortsstraße":"Pizzeria Fontana bis Laxenburger Straße","Schönbrunner Allee":"Pizzeria Fontana bis Tröbersiedlung"},"containers":[{"container":"Grünschnittcontainer","places":["Brunnerweg","Badgasse","Friedhof","Lindengasse","Schloss/Parkplatz","Schönbrunner Allee","NÖ Pflege- und Betreuungszentrum"]}],"notes":[],"dates":{"RM":["2026-01-07","2026-01-20","2026-02-03","2026-02-17","2026-03-03","2026-03-17","2026-03-31","2026-04-14","2026-04-28","2026-05-12","2026-05-26","2026-06-09","2026-06-23","2026-07-07","2026-07-21","2026-08-04","2026-08-18","2026-09-01","2026-09-15","2026-09-29","2026-10-13","2026-10-27","2026-11-10","2026-11-24","2026-12-07","2026-12-22"],"RM4":["2026-01-20","2026-02-17","2026-03-17","2026-04-14","2026-05-12","2026-06-09","2026-07-07","2026-08-04","2026-09-01","2026-09-29","2026-10-27","2026-11-24","2026-12-22"],"Bio":["2026-01-14","2026-01-28","2026-02-11","2026-02-25","2026-03-11","2026-03-25","2026-04-08","2026-04-22","2026-04-29","2026-05-06","2026-05-13","2026-05-20","2026-05-27","2026-06-03","2026-06-10","2026-06-17","2026-06-24","2026-07-01","2026-07-08","2026-07-15","2026-07-22","2026-07-29","2026-08-05","2026-08-12","2026-08-19","2026-08-26","2026-09-02","2026-09-09","2026-09-16","2026-09-23","2026-09-30","2026-10-14","2026-10-28","2026-11-11","2026-11-25","2026-12-09","2026-12-23"]}},"seepark":{"name":"Seepark","description":"Seeparksiedlung im Südosten (Seeparkstraße, Strandstraße, Seeweg)","weekday":{"RM":"Mon","RM4":"Mon","Bio":"Tue"},"colours":{"RM":"#f0a000","RM4":"#a78bfa","Bio":"#7cb342"},"streets":["Fischerstraße","Seeparkstraße","Seeweg","Strandstraße","Zum Anningerblick","Seeparksiedlung"],"split_streets":{},"containers":[{"container":"Grünschnittcontainer","places":["Seepark/Spitz"]},{"container":"Müllinseln","places":["Benyasiedlung"]},{"container":"Grünschnittcontainer Benyasiedlung","places":["Neuer Standort folgt 2026"]}],"notes":["Die Gemeinde-Website nennt das Seepark-Viertel noch nicht; dort ist die Seeparksiedlung nicht als eigenes Abfuhrgebiet angeführt.","Die Benyasiedlung (Anton-Benya-Straße) wird auf der Seepark-Seite des Kalenders nur wegen der Müllinseln genannt - laut Gemeinde-Website zählt die Anton-Benya-Straße zum Abfuhrgebiet Oberort."],"dates":{"RM":["2026-01-05","2026-01-19","2026-02-02","2026-02-16","2026-03-02","2026-03-16","2026-03-30","2026-04-13","2026-04-27","2026-05-11","2026-05-26","2026-06-08","2026-06-22","2026-07-06","2026-07-20","2026-08-03","2026-08-17","2026-08-31","2026-09-14","2026-09-28","2026-10-12","2026-10-27","2026-11-09","2026-11-23","2026-12-07","2026-12-21"],"RM4":["2026-01-05","2026-02-02","2026-03-02","2026-03-30","2026-04-27","2026-05-26","2026-06-22","2026-07-20","2026-08-17","2026-09-14","2026-10-12","2026-11-09","2026-12-07"],"Bio":["2026-01-13","2026-01-27","2026-02-10","2026-02-24","2026-03-10","2026-03-24","2026-04-07","2026-04-21","2026-04-28","2026-05-05","2026-05-12","2026-05-19","2026-05-26","2026-06-02","2026-06-09","2026-06-16","2026-06-23","2026-06-30","2026-07-07","2026-07-14","2026-07-21","2026-07-28","2026-08-04","2026-08-11","2026-08-18","2026-08-25","2026-09-01","2026-09-08","2026-09-15","2026-09-22","2026-09-29","2026-10-13","2026-10-27","2026-11-10","2026-11-24","2026-12-09","2026-12-22"]}}},"holidays":[{"date":"2026-01-01","name":"Neujahr"},{"date":"2026-01-06","name":"Heilige Drei Könige"},{"date":"2026-04-03","name":"Karfreitag"},{"date":"2026-04-06","name":"Ostermontag"},{"date":"2026-05-01","name":"Staatsfeiertag"},{"date":"2026-05-14","name":"Christi Himmelfahrt"},{"date":"2026-05-25","name":"Pfingstmontag"},{"date":"2026-06-04","name":"Fronleichnam"},{"date":"2026-10-26","name":"Nationalfeiertag"},{"date":"2026-11-01","name":"Allerheiligen"},{"date":"2026-12-08","name":"Mariä Empfängnis"},{"date":"2026-12-25","name":"Christtag"},{"date":"2026-12-26","name":"Stefanitag"}],"no_collection_hints":[{"date":"2026-02-17","name":"Faschingsdienstag"},{"date":"2026-11-02","name":"Allerseelen"},{"date":"2026-11-15","name":"Leopolditag"},{"date":"2026-12-24","name":"Heiliger Abend"},{"date":"2026-12-31","name":"Silvester"}],"extras":{"asz":{"name":"Altstoffsammelzentrum (ASZ)","hours":{"Montag bis Donnerstag":"10:00 - 15:00","Freitag":"10:00 - 12:00","Samstag":"08:00 - 12:00"},"note":"Letzte Einfahrt 15 Minuten vor Betriebsschluss. Ohne Entsorgungskarte und nur für Vösendorfer Haushalte.","closed":[{"date":"2026-02-17","label":"Faschingsdienstag"},{"date":"2026-04-03","label":"Karfreitag"},{"date":"2026-11-02","label":"Allerseelen"},{"date":"2026-11-15","label":"Leopolditag"},{"date":"2026-12-24","label":"Heiliger Abend"},{"date":"2026-12-31","label":"Silvester"}],"closed_note":"und an allen gesetzlichen Feiertagen"},"sperrmuell":{"name":"Sperrmüllabholung","note":"Einmal pro Jahr nach telefonischer Terminvereinbarung unter 01/699 03-35, Abholung an der Grundstücksgrenze.","not_collected":["Bauschutt","Flüssigkeiten/Problemstoffe","Grünschnitt","Plastik","Kartonagen","Sperrmüll von Mehrparteienhäusern"]},"blumenerde":{"name":"Blumenerde-Aktion 2026","events":[{"date":"2026-04-11","time":"10:00 - 13:00","place":"Feuerwehrhaus, Karglhaus, Benyasiedlung"},{"date":"2026-05-09","time":"10:00 - 13:00","place":"Feuerwehrhaus, Karglhaus, Benyasiedlung"},{"date":"2026-04-18","time":"10:00 - 13:00","place":"Feuerwehrhaus, Karglhaus, Benyasiedlung","replacement":true},{"date":"2026-05-16","time":"10:00 - 13:00","place":"Feuerwehrhaus, Karglhaus, Benyasiedlung","replacement":true}]}}};

const CARD_TYPE = "voesendorf-waste-card";
const STORAGE_KEY = "voesendorf-waste-card";

const ZONE_COLOURS = {
  oberort: "#e08a1e",
  unterort: "#3d7ebd",
  seepark: "#3f9e8f",
};
const TYPE_COLOURS = { RM: "#ef9d0c", RM4: "#8b5cf6", Bio: "#6ea83c" };
const TYPE_ORDER = ["RM", "RM4", "Bio"];

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
    details: "Details & Zusatztermine",
    monthPrev: "Voriger Monat",
    monthNext: "Nächster Monat",
    monthCurrent: "Aktueller Monat",
    close: "Schließen",
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
    details: "Details & extra dates",
    monthPrev: "Previous month",
    monthNext: "Next month",
    monthCurrent: "Current month",
    close: "Close",
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
      show_types: TYPE_ORDER,
      days_ahead: 6,
      show_extras: true,
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
  }

  getCardSize() {
    return 8;
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

  _readState() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
    } catch (error) {
      return null;
    }
  }

  _saveState() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(
        { zone: this._zone, street: this._street }));
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
                           this._config.show_extras, this._monthOffset,
                           this._showSettings, this._config.show_types]);
  }

  _render() {
    if (!this._config || !this.isConnected) return;
    this._restoreStateOnce();
    const hash = this._hash();
    if (hash === this._renderedHash && this.shadowRoot.querySelector(".card")) return;
    this._renderedHash = hash;

    if (!this._zone) {
      this.shadowRoot.innerHTML = this._shell(this._bodyAllZones());
      this._attachHandlers();
      return;
    }
    const zone = this._zoneEntry(this._zone);
    this.shadowRoot.innerHTML = this._shell(this._bodyZone(zone));
    this._attachHandlers();
    if (this._detailsOpen) {
      const dialog = this.shadowRoot.getElementById("details");
      if (dialog) dialog.showModal();
    }
  }

  _restoreStateOnce() {
    if (this._restored) return;
    this._restored = true;
    const saved = this._readState();
    if (!this._zone && !this._street) {
      if (saved?.street) this._setStreet(saved.street, false);
      else if (saved?.zone && SCHEDULE.zones[saved.zone]) this._zone = saved.zone;
    }
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
      ${this._monthSection(dateMapZone)}
      <footer>
        <span><a href="${SCHEDULE.sources.info_page}" target="_blank" rel="noopener">
          ${this._t("source")}: Marktgemeinde Vösendorf</a> · ${SCHEDULE.year}</span>
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
    description: "Müllabfuhrkalender der Marktgemeinde Vösendorf mit Monatsübersicht und Zusatzterminen",
    preview: false,
    documentationURL: "https://github.com/acdcnow/voesendorf-wastecalendar",
  });
}

console.info(`%c ${CARD_TYPE} %c v${VERSION} `, "color:white;background:#3f9e8f", "color:#3f9e8f;background:white");
