#!/usr/bin/env python3
"""Parse the official Vösendorf waste calendar PDF into a JSON schedule.

The municipality publishes one PDF per year at
https://voesendorf.gv.at/buergerservice/muellkalender/ (link in the "Downloads" box).
The PDF contains one landscape calendar grid per collection area
("Abfuhrgebiet"): Oberort, Unterort and Seepark.

How the parser works
--------------------
Inside the grid every single day cell is a filled PDF rectangle whose fill colour
encodes the waste type:

    orange (1.0, 0.753, 0.0)      -> RM    Restmüll, 14-tägig
    purple (0.8, 0.6, 1.0)        -> RM4   Restmüll, 4-wöchig (same day as RM)
    green  (0.573, 0.816, 0.314)  -> Bio   Biomüll
    pink   (1.0, 0.851, 0.851)    -> holiday (no collection)

The day numbers themselves are text; they are used as exact row anchors, because
the rectangle tops drift a little over the height of the page.

IMPORTANT: neighbouring cells with the *same* colour are merged by the PDF writer
into a single wide rectangle, so a rectangle has to be assigned to *every* month
column it overlaps - not just to the column of its centre.

Usage
-----
    python tools/parse_calendar_pdf.py [--pdf Muellkalender-2026_web.pdf] [--year 2026]
                                       [--out build/schedule_2026.json]

Dependencies: pdfplumber  (pip install pdfplumber)
"""

from __future__ import annotations

import argparse
import collections
import datetime as dt
import json
import pathlib
import re
import sys
import urllib.request

PDF_URL = "https://voesendorf.gv.at/wp-content/uploads/2021/09/Muellkalender-2026_web.pdf"

MONTHS = ["Jänner", "Februar", "März", "April", "Mai", "Juni",
          "Juli", "August", "September", "Oktober", "November", "Dezember"]

# 0-based PDF page index -> collection area. Pages 2/4/6 carry the grids.
PAGES = {1: "oberort", 3: "unterort", 5: "seepark"}
ZONE_NAMES = {"oberort": "Oberort", "unterort": "Unterort", "seepark": "Seepark"}

# grid geometry in PDF points (A4 landscape, 842 x 595)
COL0, COLW = 43.5, 63.0

COLOUR2TYPE = {
    "(1.0, 0.753, 0.0)": "RM",
    "(0.8, 0.6, 1.0)": "RM4",
    "(0.573, 0.816, 0.314)": "Bio",
    "(1.0, 0.851, 0.851)": "HOLIDAY",
}

# the PDF font has a broken ToUnicode map
FIX = str.maketrans({"õ": "ä", "÷": "ö", "³": "ü", "▀": "ß", "Í": "Ö", "─": "-"})

WEEKDAY_ABBR = {"Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"}


def fragments(page, ymin: float, ymax: float):
    """Group the page characters into text fragments (day numbers, markers, ...)."""
    lines: dict[int, list] = collections.defaultdict(list)
    for char in page.chars:
        if ymin <= char["top"] <= ymax:
            lines[round(char["top"] / 4.0)].append(char)

    out = []
    for key in lines:
        for char in sorted(lines[key], key=lambda c: c["x0"]):
            if out and abs(out[-1][1] - char["top"]) < 2 and char["x0"] - out[-1][2] < 1.2:
                out[-1][2] = char["x1"]
                out[-1][3] += char["text"]
            else:
                out.append([char["x0"], char["top"], char["x1"], char["text"]])
    return out


def columns_covering(x0: float, x1: float, min_overlap: float = 3.0) -> list[int]:
    """All month columns a rectangle overlaps by more than `min_overlap` points."""
    covered = []
    for i in range(12):
        left = COL0 + i * COLW
        if min(x1, left + COLW) - max(x0, left) > min_overlap:
            covered.append(i)
    return covered


def parse(pdf_path: pathlib.Path, year: int) -> dict:
    import pdfplumber  # imported here so --help works without the dependency

    zones: dict[str, dict] = {}
    with pdfplumber.open(pdf_path) as pdf:
        for pageno, slug in PAGES.items():
            page = pdf.pages[pageno]

            # 1) exact row anchors: the printed day numbers per month column
            anchors: dict[int, dict[int, float]] = collections.defaultdict(dict)
            for x0, top, x1, text in fragments(page, 127, 492):
                text = text.translate(FIX).strip()
                if not re.fullmatch(r"\d{1,2}", text):
                    continue
                for col in columns_covering(x0, x1):
                    off = x0 - (COL0 + col * COLW)
                    if 2 <= off <= 9:  # day numbers sit ~5.5pt right of the column edge
                        anchors[col][int(text)] = top

            # 2) waste types from the coloured cells
            days: dict[dt.date, set[str]] = collections.defaultdict(set)
            for rect in page.rects:
                waste = COLOUR2TYPE.get(str(rect.get("non_stroking_color")))
                if waste is None or rect["height"] < 5 or not (124 < rect["top"] < 490):
                    continue
                for col in columns_covering(rect["x0"], rect["x1"]):
                    if not anchors[col]:
                        continue
                    dist, day = min((abs(anchors[col][d] - rect["top"]), d) for d in anchors[col])
                    if dist > 7:
                        continue
                    days[dt.date(year, col + 1, day)].add(waste)

            zone: dict[str, list[str]] = {"dates": {}, "holidays": []}
            for waste in ("RM", "RM4", "Bio"):
                zone["dates"][waste] = sorted(
                    d.isoformat() for d, kinds in days.items() if waste in kinds)
            zone["holidays"] = sorted(
                d.isoformat() for d, kinds in days.items() if "HOLIDAY" in kinds)
            zones[slug] = zone
    return zones


def validate(zones: dict) -> list[str]:
    """Sanity checks that catch the common extraction mistakes."""
    problems = []
    expected = {"RM": 26, "RM4": 13, "Bio": 37}
    for slug, zone in zones.items():
        holidays = [dt.date.fromisoformat(d) for d in zone["holidays"]]
        for waste, want in expected.items():
            dates = [dt.date.fromisoformat(d) for d in zone["dates"][waste]]
            if len(dates) != want:
                problems.append(f"{slug}/{waste}: {len(dates)} dates, expected ~{want}")
            # all collections of one type happen on the same weekday - except when a
            # public holiday pushes the collection by a day (vorverlegt/nachgeholt).
            common = collections.Counter(d.strftime("%a") for d in dates).most_common(1)
            main = common[0][0] if common else None
            for date in dates:
                if date.strftime("%a") == main:
                    continue
                if not any(abs((date - h).days) <= 1 for h in holidays):
                    problems.append(f"{slug}/{waste}: {date} is {date.strftime('%a')} "
                                    f"(usual: {main}) and not next to a holiday")
            gaps = {(b - a).days for a, b in zip(dates, dates[1:])}
            if not gaps <= {7, 13, 14, 15, 27, 28, 29, 35}:
                problems.append(f"{slug}/{waste}: unexpected gaps {sorted(gaps)}")
    return problems


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--pdf", type=pathlib.Path, default=pathlib.Path("build/Muellkalender.pdf"))
    ap.add_argument("--url", default=PDF_URL)
    ap.add_argument("--year", type=int, default=2026)
    ap.add_argument("--out", type=pathlib.Path, default=pathlib.Path("build/schedule.json"))
    args = ap.parse_args()

    if not args.pdf.exists():
        args.pdf.parent.mkdir(parents=True, exist_ok=True)
        print(f"downloading {args.url}")
        request = urllib.request.Request(args.url, headers={"User-Agent": "voesendorf-wastecalendar"})
        with urllib.request.urlopen(request, timeout=120) as response:
            args.pdf.write_bytes(response.read())

    zones = parse(args.pdf, args.year)
    problems = validate(zones)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps({"year": args.year, "zones": zones},
                                   ensure_ascii=False, indent=1), encoding="utf-8")

    for slug, zone in zones.items():
        counts = {w: len(v) for w, v in zone["dates"].items()}
        print(f"{slug:9} {counts}  holidays={len(zone['holidays'])}")
    if problems:
        print("\nVALIDATION PROBLEMS:", file=sys.stderr)
        for problem in problems:
            print(" -", problem, file=sys.stderr)
        return 1
    print(f"\nOK -> {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
