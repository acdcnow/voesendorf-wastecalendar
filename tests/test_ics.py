"""Check the generated ICS files: structure, RFC 5545 line folding, event count.

Run:  python tests/test_ics.py
"""

import glob
import os
import re

EXPECTED_EVENTS = 80  # 26 RM + 13 RM4 + 37 Bio + 4 Blumenerde-Aktion

ok = True
for path in sorted(glob.glob("Abfallkalender_*.ics")):
    # keep the CRLF endings so the octet length of every physical line can be checked
    physical = open(path, encoding="utf-8", newline="").read().split("\r\n")
    text = open(path, encoding="utf-8").read()  # universal newlines for matching

    too_long = [line for line in physical if len(line.encode()) > 75 and not line.startswith(" ")]
    events = len(re.findall(r"^BEGIN:VEVENT$", text, re.M))
    events_end = len(re.findall(r"^END:VEVENT$", text, re.M))
    balanced = text.count("BEGIN:") == text.count("END:")
    summaries = sorted({m.group(1).strip() for m in re.finditer(r"^SUMMARY:(.*)$", text, re.M)})
    dates = re.findall(r"^DTSTART;VALUE=DATE:(\d{8})$", text, re.M)
    sorted_dates = dates == sorted(dates)
    line_ending_ok = "\r\n" in open(path, encoding="utf-8", newline="").read()

    checks = (not too_long, balanced, events == events_end == EXPECTED_EVENTS,
              sorted_dates, line_ending_ok)
    status = "OK  " if all(checks) else "FAIL"
    ok = ok and all(checks)
    print(f"{status} {os.path.basename(path):46} {os.path.getsize(path):6} B  "
          f"events={events} balanced={balanced} sorted={sorted_dates} "
          f"crlf={line_ending_ok} over75={len(too_long)}")
    print(f"     summaries: {summaries}")
    for line in too_long[:3]:
        print(f"     TOO LONG ({len(line.encode())}): {line[:90]}")

print("\nICS check", "passed" if ok else "FAILED")
raise SystemExit(0 if ok else 1)
