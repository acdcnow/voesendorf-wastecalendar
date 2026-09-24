#!/usr/bin/env python3
"""Build dist/voesendorf-waste-card.js from src/ + data/.

The card is shipped as ONE self-contained JavaScript file: the calendar data is
inlined, so it works without an integration, without a map and without a single
network request.

Usage:  python tools/build_card.py [--year 2026] [--version 1.0.0]
"""

from __future__ import annotations

import argparse
import json
import pathlib


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--year", type=int, default=2026)
    ap.add_argument("--version", default="1.0.0")
    ap.add_argument("--source", type=pathlib.Path,
                    default=pathlib.Path("src/voesendorf-waste-card.js"))
    ap.add_argument("--data", type=pathlib.Path, default=None)
    ap.add_argument("--out", type=pathlib.Path,
                    default=pathlib.Path("dist/voesendorf-waste-card.js"))
    args = ap.parse_args()

    data_path = args.data or pathlib.Path(f"data/voesendorf_waste_{args.year}.json")
    schedule = json.loads(data_path.read_text(encoding="utf-8"))

    # compact but still readable JSON, no pretty printing to keep the file small
    schedule_json = json.dumps(schedule, ensure_ascii=False, separators=(",", ":"))

    source = args.source.read_text(encoding="utf-8")
    for placeholder, payload in (("__SCHEDULE_DATA__", schedule_json),
                                 ("__VERSION__", args.version)):
        if placeholder not in source:
            raise SystemExit(f"placeholder {placeholder} missing in {args.source}")
        source = source.replace(placeholder, payload)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(source, encoding="utf-8")
    print(f"wrote {args.out}  ({args.out.stat().st_size / 1024:.0f} kB, card v{args.version})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
