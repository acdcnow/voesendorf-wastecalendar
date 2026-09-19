#!/usr/bin/env python3
"""Generate the .ics calendars from data/voesendorf_waste_<year>.json.

The files are written to the repository root so that the raw GitHub URLs stay stable
and can be fed directly into Home Assistant:

    waste_collection_schedule:
      sources:
        - name: ics
          args:
            url: https://raw.githubusercontent.com/acdcnow/voesendorf-wastecalendar/main/Abfallkalender_Voesendorf_Oberort_2026.ics

Usage:  python tools/build_ics.py [--year 2026]
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import pathlib

PRODID = "-//voesendorf-wastecalendar//Abfallkalender Vösendorf//DE"
TYPE_SUMMARY = {
    "RM": "Restmüll 14-tägig",
    "RM4": "Restmüll 4-wöchig",
    "Bio": "Biomüll",
}
VTIMEZONE = """BEGIN:VTIMEZONE
TZID:Europe/Vienna
X-LIC-LOCATION:Europe/Vienna
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE""".splitlines()


def fold(line: str) -> str:
    """RFC 5545 line folding at 75 octets."""
    data = line.encode("utf-8")
    if len(data) <= 75:
        return line
    parts, chunk = [], b""
    limit = 75
    for char in line:
        encoded = char.encode("utf-8")
        if len(chunk) + len(encoded) > limit:
            parts.append(chunk)
            chunk = b""
            limit = 74  # continuation lines start with a space
        chunk += encoded
    parts.append(chunk)
    return "\r\n ".join(p.decode("utf-8") for p in parts)


def event(uid: str, date: dt.date, summary: str, description: str = "",
          categories: str = "", stamp: str = "20260101T000000Z") -> list[str]:
    lines = [
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{stamp}",
        f"DTSTART;VALUE=DATE:{date:%Y%m%d}",
        f"SUMMARY:{summary}",
        "TRANSP:TRANSPARENT",
        "X-MICROSOFT-CDO-ALLDAYEVENT:TRUE",
    ]
    if description:
        lines.append(f"DESCRIPTION:{description}")
    if categories:
        lines.append(f"CATEGORIES:{categories}")
    lines.append("END:VEVENT")
    return lines


def timed_event(uid: str, date: dt.date, start: str, end: str, summary: str,
                location: str = "", description: str = "",
                stamp: str = "20260101T000000Z") -> list[str]:
    lines = [
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{stamp}",
        f"DTSTART;TZID=Europe/Vienna:{date:%Y%m%d}T{start}",
        f"DTEND;TZID=Europe/Vienna:{date:%Y%m%d}T{end}",
        f"SUMMARY:{summary}",
    ]
    if location:
        lines.append(f"LOCATION:{location}")
    if description:
        lines.append(f"DESCRIPTION:{description}")
    lines.append("END:VEVENT")
    return lines


def build_zone(zone_slug: str, zone: dict, data: dict, stamp: str) -> str:
    year = data["year"]
    name = zone["name"]
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        f"PRODID:{PRODID}",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:Abfallkalender Vösendorf {year} - {name}",
        "X-WR-TIMEZONE:Europe/Vienna",
        *VTIMEZONE,
    ]

    holiday_by_date = {h["date"]: h["name"] for h in data["holidays"]}
    events: list[tuple[dt.date, list[str]]] = []
    for waste in ("RM", "RM4", "Bio"):
        legend = data["legend"][waste]
        dates = [dt.date.fromisoformat(iso) for iso in zone["dates"][waste]]
        usual = {"Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3, "Fri": 4, "Sat": 5, "Sun": 6}[
            zone["weekday"][waste]]
        for date in dates:
            description = f"{name}: {legend['name']}, {legend['interval']}"
            if date.weekday() != usual:
                moved = holiday_by_date.get((date + dt.timedelta(days=1)).isoformat()) or \
                        holiday_by_date.get((date - dt.timedelta(days=1)).isoformat())
                suffix = f" (verschoben wegen {moved})" if moved else " (verschobener Termin)"
                description += suffix
            events.append((date, event(
                uid=f"{date:%Y%m%d}-{waste.lower()}-{zone_slug}-voesendorf@wastecalendar",
                date=date,
                summary=TYPE_SUMMARY[waste],
                description=description,
                categories=f"Abfall,Vösendorf,{name}",
                stamp=stamp,
            )))

    for entry in data["extras"]["blumenerde"]["events"]:
        date = dt.date.fromisoformat(entry["date"])
        events.append((date, timed_event(
            uid=f"{date:%Y%m%d}-blumenerde-{zone_slug}-voesendorf@wastecalendar",
            date=date,
            start="100000",
            end="130000",
            summary="Blumenerde-Aktion" + (" (Ersatztermin)" if entry.get("replacement") else ""),
            location=entry["place"],
            description="Kompost-/Blumenerde-Aktion der Marktgemeinde Vösendorf",
            stamp=stamp,
        )))

    for _, lines_of_event in sorted(events, key=lambda item: item[0]):
        lines += lines_of_event

    lines.append("END:VCALENDAR")
    return "\r\n".join(fold(line) for line in lines) + "\r\n"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--year", type=int, default=2026)
    ap.add_argument("--data", type=pathlib.Path, default=None)
    ap.add_argument("--outdir", type=pathlib.Path, default=pathlib.Path("."))
    args = ap.parse_args()

    data_path = args.data or pathlib.Path(f"data/voesendorf_waste_{args.year}.json")
    data = json.loads(data_path.read_text(encoding="utf-8"))
    stamp = f"{dt.datetime.now(dt.timezone.utc):%Y%m%dT%H%M%SZ}"

    for slug, zone in data["zones"].items():
        out = args.outdir / f"Abfallkalender_Voesendorf_{zone['name']}_{args.year}.ics"
        out.write_text(build_zone(slug, zone, data, stamp), encoding="utf-8", newline="")
        events = out.read_text(encoding="utf-8").count("BEGIN:VEVENT")
        print(f"{out}  ({events} events)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
