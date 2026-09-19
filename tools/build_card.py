#!/usr/bin/env python3
"""Build dist/voesendorf-waste-card.js from src/ + data/.

The card is shipped as ONE self-contained JavaScript file: the calendar data and a
simplified copy of the street geometry are inlined, so the card works without any
integration (only the map tiles are loaded from the internet).

Usage:  python tools/build_card.py [--year 2026] [--version 1.0.0]
"""

from __future__ import annotations

import argparse
import json
import math
import pathlib

# Douglas-Peucker tolerance in degrees (~1e-5 deg is roughly 1 metre)
TOLERANCE = 1.2e-5


def simplify(points: list[list[float]], tolerance: float = TOLERANCE) -> list[list[float]]:
    """Douglas-Peucker line simplification (points are [lon, lat])."""
    if len(points) < 3:
        return points

    def distance(point, start, end) -> float:
        if start == end:
            return math.hypot(point[0] - start[0], point[1] - start[1])
        dx, dy = end[0] - start[0], end[1] - start[1]
        t = ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / (dx * dx + dy * dy)
        t = max(0.0, min(1.0, t))
        return math.hypot(point[0] - (start[0] + t * dx), point[1] - (start[1] + t * dy))

    def run(start: int, end: int, keep: set[int]) -> None:
        worst, index = 0.0, None
        for i in range(start + 1, end):
            value = distance(points[i], points[start], points[end])
            if value > worst:
                worst, index = value, i
        if index is not None and worst > tolerance:
            keep.add(index)
            run(start, index, keep)
            run(index, end, keep)

    keep = {0, len(points) - 1}
    run(0, len(points) - 1, keep)
    return [points[i] for i in sorted(keep)]


def simplify_geojson(geojson: dict) -> dict:
    features = []
    for feature in geojson["features"]:
        geometry = feature.get("geometry") or {}
        coordinates = geometry.get("coordinates")
        if coordinates is None:
            continue
        if geometry["type"] == "LineString":
            coordinates = simplify(coordinates)
        elif geometry["type"] == "Polygon":
            coordinates = [ring if len(ring) <= 4 else simplify(ring + [ring[0]])[:-1]
                           for ring in coordinates]
        features.append({**feature, "geometry": {**geometry, "coordinates": coordinates}})
    return {**geojson, "features": features}


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--year", type=int, default=2026)
    ap.add_argument("--version", default="1.0.0")
    ap.add_argument("--source", type=pathlib.Path,
                    default=pathlib.Path("src/voesendorf-waste-card.js"))
    ap.add_argument("--data", type=pathlib.Path, default=None)
    ap.add_argument("--geometry", type=pathlib.Path, default=pathlib.Path("data/streets.geojson"))
    ap.add_argument("--out", type=pathlib.Path,
                    default=pathlib.Path("dist/voesendorf-waste-card.js"))
    args = ap.parse_args()

    data_path = args.data or pathlib.Path(f"data/voesendorf_waste_{args.year}.json")
    schedule = json.loads(data_path.read_text(encoding="utf-8"))
    geometry = simplify_geojson(json.loads(args.geometry.read_text(encoding="utf-8")))

    # compact but still readable JSON, no pretty printing to keep the file small
    schedule_json = json.dumps(schedule, ensure_ascii=False, separators=(",", ":"))
    geometry_json = json.dumps(geometry, ensure_ascii=False, separators=(",", ":"))

    source = args.source.read_text(encoding="utf-8")
    for placeholder, payload in (("__SCHEDULE_DATA__", schedule_json),
                                 ("__STREET_GEOJSON__", geometry_json),
                                 ("__VERSION__", args.version)):
        if placeholder not in source:
            raise SystemExit(f"placeholder {placeholder} missing in {args.source}")
        source = source.replace(placeholder, payload)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(source, encoding="utf-8")
    print(f"wrote {args.out}  ({args.out.stat().st_size / 1024:.0f} kB, "
          f"features={len(geometry['features'])}, card v{args.version})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
