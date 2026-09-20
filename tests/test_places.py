#!/usr/bin/env python3
"""Sanity checks for data/places.json and packages/voesendorf_places.yaml.

The package is written by tools/fetch_places.py; this test makes sure that the
generated Home Assistant package matches the places data, that no container site
from the official schedule got lost on the way, and that the coordinates are
inside the municipality (a bounding box lookup once pulled in a recycling centre
from Brunn am Gebirge, 4 km away).
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLACES = ROOT / "data" / "places.json"
PACKAGE = ROOT / "packages" / "voesendorf_places.yaml"
SCHEDULE = ROOT / "data" / "voesendorf_waste_2026.json"

# Rough box around Vösendorf, deliberately tighter than the neighbours.
BOX = {"south": 48.10, "north": 48.15, "west": 16.29, "east": 16.37}

KINDS = {"asz", "blumenerde", "muellinsel", "gruenschnitt"}
STATES = {"Gemeindegebiet", "Oberort", "Unterort", "Seepark"}

# Container sites the calendar lists that cannot be pinned down (see docs/PLACES.md):
# the Karglhaus is in no address list, "Seepark/Spitz" has no mappable point and the
# Benyasiedlung container has no location yet. "Badgasse" is the Bachgasse (typo in
# the PDF) and is therefore matched through its real name.
UNRESOLVED = {"Seepark", "Neuer Standort folgt 2026"}

problems: list[str] = []


def check(condition: bool, message: str) -> None:
    if not condition:
        problems.append(message)


def main() -> int:
    places = json.loads(PLACES.read_text(encoding="utf-8"))["places"]
    package = PACKAGE.read_text(encoding="utf-8")
    schedule = json.loads(SCHEDULE.read_text(encoding="utf-8"))

    check(len(places) >= 12, f"only {len(places)} places")
    ids = [place["id"] for place in places]
    check(len(ids) == len(set(ids)), "duplicate place ids")
    names = [place["name"] for place in places]
    check(len(names) == len(set(names)), "duplicate place names")

    for place in places:
        where = place["id"]
        check(place["kind"] in KINDS, f"{where}: unknown kind {place['kind']!r}")
        check(place["state"] in STATES, f"{where}: odd state {place['state']!r}")
        check(
            BOX["south"] < place["latitude"] < BOX["north"],
            f"{where}: latitude {place['latitude']} outside the municipality",
        )
        check(
            BOX["west"] < place["longitude"] < BOX["east"],
            f"{where}: longitude {place['longitude']} outside the municipality",
        )
        check(bool(place["source"]), f"{where}: no source recorded")
        check(not place["source"].startswith("openstreetmap:openstreetmap:"),
              f"{where}: doubled source prefix")

        # the package must contain exactly this place, with the same position
        check(f'unique_id: voesendorf_place_{where.replace("-", "_")}' in package,
              f"{where}: missing in the package")
        check(f'latitude: {place["latitude"]}' in package,
              f"{where}: latitude not in the package")
        check(f'longitude: {place["longitude"]}' in package,
              f"{where}: longitude not in the package")

    check(package.count("- name:") == len(places),
          "package does not declare one sensor per place")
    check("template:" in package and "- sensor:" in package,
          "package is not a template sensor block")
    check(package.count("latitude:") == len(places),
          "a sensor is missing its latitude")
    for line in package.splitlines():
        if line.strip().startswith("unique_id:"):
            check(line.split(":", 1)[1].strip().isascii(),
                  f"non-ascii unique_id: {line.strip()}")

    # every container site from the official schedule is either mapped or documented
    known = " ".join(names).lower()
    for zone, info in schedule["zones"].items():
        for group in info.get("containers") or []:
            for site in group["places"]:
                keyword = site.split("/")[0].strip()
                if keyword in UNRESOLVED:
                    continue
                # "Badgasse" is printed in the PDF, the street is called Bachgasse
                keyword = "Bachgasse" if keyword == "Badgasse" else keyword
                check(keyword.lower() in known,
                      f"{zone}: container site {site!r} has no place entry")

    check(any(place["kind"] == "asz" for place in places), "the ASZ is missing")

    if problems:
        for problem in problems:
            print(f"FAIL {problem}")
        print(f"\n{len(problems)} problem(s)")
        return 1
    print(f"OK   {len(places)} places, package consistent, coordinates inside the village")
    print("places check passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
