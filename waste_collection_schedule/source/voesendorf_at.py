"""Vösendorf (Austria) waste collection schedule.

The market town of Vösendorf publishes its waste calendar as a PDF containing one
grid per collection area ("Abfuhrgebiet": Oberort, Unterort, Seepark).  Parsing
that PDF reliably needs positional and colour information, so the verified
calendar dates are published as a small JSON file in a community repository:

    https://github.com/acdcnow/voesendorf-wastecalendar

This source reads that JSON (maintained from the official PDF, see the repository
for the parser and the street lists), which keeps the data reviewable and easy to
update for the following year.

Arguments
    zone: collection area - oberort, unterort or seepark
    year: calendar year, defaults to the current year
"""

import logging
from datetime import date

import requests

from waste_collection_schedule import Collection, Icons
from waste_collection_schedule.exceptions import (
    SourceArgumentNotFound,
    SourceArgumentNotFoundWithSuggestions,
)

_LOGGER = logging.getLogger(__name__)

TITLE = "Vösendorf"
DESCRIPTION = ("Waste collection calendar of the Austrian market town Vösendorf "
               "(Lower Austria).")
URL = "https://voesendorf.gv.at/buergerservice/muellkalender/"
COUNTRY = "at"

ZONES = {
    "oberort": "Oberort",
    "unterort": "Unterort",
    "seepark": "Seepark",
}

DATA_URL = ("https://raw.githubusercontent.com/acdcnow/voesendorf-wastecalendar/"
            "main/data/voesendorf_waste_{year}.json")

ICON_MAP = {
    "RM": Icons.GENERAL_WASTE,
    "RM4": Icons.GENERAL_WASTE,
    "Bio": Icons.ORGANIC,
}

HOW_TO_GET_ARGUMENTS_DESCRIPTION = {
    "en": (
        "Open https://voesendorf.gv.at/buergerservice/muellkalender/ and look up "
        "which Abfuhrgebiet (collection area) your street belongs to - the street "
        "lists are on that page and on pages 3, 5 and 7 of the PDF calendar. "
        "Use oberort, unterort or seepark accordingly."
    ),
    "de": (
        "Öffne https://voesendorf.gv.at/buergerservice/muellkalender/ und suche "
        "deine Straße in der Liste des Abfuhrgebiets (auch auf den Seiten 3, 5 "
        "und 7 des PDF-Kalenders). Verwende dann oberort, unterort oder seepark."
    ),
}

PARAM_DESCRIPTIONS = {
    "en": {"zone": "Collection area: oberort, unterort or seepark.",
           "year": "Calendar year (defaults to the current year)."},
    "de": {"zone": "Abfuhrgebiet: oberort, unterort oder seepark.",
           "year": "Kalenderjahr (Standard: aktuelles Jahr)"},
}

PARAM_TRANSLATIONS = {
    "en": {"zone": "Collection area", "year": "Year"},
    "de": {"zone": "Abfuhrgebiet", "year": "Jahr"},
}

TEST_CASES = {
    "Oberort_2026": {"zone": "oberort", "year": 2026},
    "Unterort_2026": {"zone": "unterort", "year": 2026},
    "Seepark_2026": {"zone": "seepark", "year": 2026},
}


class Source:
    def __init__(self, zone: str, year: int | None = None):
        if not zone:
            raise SourceArgumentNotFound("zone", zone)
        cleaned = zone.strip().lower()
        if cleaned not in ZONES:
            raise SourceArgumentNotFoundWithSuggestions("zone", zone, sorted(ZONES))
        self._zone = cleaned
        self._year = int(year) if year else date.today().year

    @staticmethod
    def _fetch_year(year: int) -> dict:
        response = requests.get(DATA_URL.format(year=year), timeout=30)
        response.raise_for_status()
        return response.json()

    def fetch(self) -> list[Collection]:
        payload = None
        # a new calendar is published in December, so fall back to earlier years
        # when the requested one is not available yet
        for year in range(self._year, self._year - 3, -1):
            try:
                payload = self._fetch_year(year)
                break
            except requests.HTTPError as error:
                _LOGGER.debug("No Vösendorf calendar data for %s: %s", year, error)
        if payload is None:
            raise ValueError(
                f"No Vösendorf calendar data found for {self._year} "
                f"(tried {self._year - 2} to {self._year})."
            )

        zone = payload["zones"][self._zone]
        legend = payload.get("legend", {})
        entries: list[Collection] = []
        for waste, dates in zone["dates"].items():
            name = legend.get(waste, {}).get("name", waste)
            for iso_date in dates:
                entries.append(
                    Collection(
                        date=date.fromisoformat(iso_date),
                        t=name,
                        icon=ICON_MAP.get(waste),
                    )
                )
        entries.sort(key=lambda entry: (entry.date, entry.t))
        return entries
