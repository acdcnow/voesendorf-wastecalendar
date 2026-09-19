#!/usr/bin/env python3
"""Build data/streets.geojson: the Vösendorf street network tagged with the waste
collection area it belongs to (this is what the Lovelace card draws on the map).

Data source: OpenStreetMap via the Overpass API (ODbL).

Two streets are shared between the areas Oberort and Unterort - the official lists
read "Ortsstraße (Badner Bahn bis Pizzeria Fontana)" for Oberort and "Ortsstraße
(Pizzeria Fontana bis Laxenburger Straße)" for Unterort, the same for the
Schönbrunner Allee. The split point is the address of the Pizzeria Fontana
(Ortsstraße 71 = 48.124724/16.328245 from OSM). Both streets are cut there, and each
half is assigned to the area on its side.

Usage:  python tools/fetch_street_geometry.py [--year 2026]
"""

from __future__ import annotations

import argparse
import json
import math
import pathlib
import re
import unicodedata
import urllib.parse
import urllib.request

OVERPASS = "https://overpass-api.de/api/interpreter"
USER_AGENT = "voesendorf-wastecalendar (github.com/acdcnow/voesendorf-wastecalendar)"

SPLIT_POINT = (48.1247238, 16.3282454)          # Pizzeria Fontana, Ortsstraße 71
SPLIT_STREETS = ["Ortsstraße", "Schönbrunner Allee"]

# residential areas (Siedlungen) as they are named in OSM -> collection area
SETTLEMENTS = {
    "Seeparksiedlung": "seepark",
    "Tröber Siedlung": "unterort",          # PDF: "Schönbrunner Allee ... bis Tröbersiedlung"
    "Anton Benya-Wohnhausanlage": "oberort",  # the Benyasiedlung
}

# settlements that only exist as a name in the official lists (no OSM polygon)
SETTLEMENT_NAMES = {"Haidfeldsiedlung", "Kalesasiedlung", "Roseggersiedlung",
                    "Jordansiedlung", "Tröbersiedlung", "Seeparksiedlung",
                    "Benyasiedlung", "Roseggersiedlung"}

QUERIES = {
    "streets": """
[out:json][timeout:120];
area["name"="Vösendorf"]["boundary"="administrative"]->.a;
way(area.a)[highway][name];
out geom tags;
""",
    "rail": """
[out:json][timeout:120];
area["name"="Vösendorf"]["boundary"="administrative"]->.a;
way(area.a)["railway"="light_rail"];
out geom tags;
""",
    "areas": """
[out:json][timeout:120];
area["name"="Vösendorf"]["boundary"="administrative"]->.a;
nwr(area.a)["landuse"="residential"]["name"];
out geom tags;
""",
}


def fetch(key: str, query: str, cache_dir: pathlib.Path) -> dict:
    cache = cache_dir / f"overpass_{key}.json"
    if cache.exists():
        return json.loads(cache.read_text(encoding="utf-8"))
    request = urllib.request.Request(
        OVERPASS, data=("data=" + urllib.parse.quote(query)).encode(),
        headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=180) as response:
        payload = json.load(response)
    cache.parent.mkdir(parents=True, exist_ok=True)
    cache.write_text(json.dumps(payload), encoding="utf-8")
    return payload


def norm(name: str) -> str:
    text = unicodedata.normalize("NFKD", name)
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.lower().replace("ß", "ss")
    text = re.sub(r"\(.*?\)", " ", text)
    text = re.sub(r"\b(dr|doktor)\b", " ", text)
    return re.sub(r"[^a-z0-9]", "", text)


def metres(a, b) -> float:
    return math.hypot((a[0] - b[0]) * 111_320,
                      (a[1] - b[1]) * 111_320 * math.cos(math.radians(a[0])))


def line_points(element: dict) -> list[tuple[float, float]]:
    return [(p["lat"], p["lon"]) for p in element.get("geometry") or []]


def distance_to_lines(point, lines) -> float:
    return min((metres(point, p) for line in lines for p in line), default=1e9)


def split_at_pivot(line, pivot) -> list[list[tuple[float, float]]]:
    if len(line) < 2:
        return []
    index = min(range(len(line)), key=lambda i: metres(line[i], pivot))
    return [part for part in (line[: index + 1], line[index:]) if len(part) > 1]


def axis_of(points) -> tuple[float, float]:
    """Normalised direction of the street (from its two extreme points)."""
    best, pair = 0.0, (points[0], points[-1])
    for i in range(0, len(points), 3):
        for j in range(0, len(points), 3):
            distance = metres(points[i], points[j])
            if distance > best:
                best, pair = distance, (points[i], points[j])
    lat = pair[1][0] - pair[0][0]
    lon = pair[1][1] - pair[0][1]
    length = math.hypot(lat, lon) or 1.0
    return lat / length, lon / length


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--year", type=int, default=2026)
    ap.add_argument("--data", type=pathlib.Path, default=None)
    ap.add_argument("--out", type=pathlib.Path, default=pathlib.Path("data/streets.geojson"))
    ap.add_argument("--cache-dir", type=pathlib.Path, default=pathlib.Path("build"))
    args = ap.parse_args()

    data_path = args.data or pathlib.Path(f"data/voesendorf_waste_{args.year}.json")
    data = json.loads(data_path.read_text(encoding="utf-8"))

    streets_payload = fetch("streets", QUERIES["streets"], args.cache_dir)
    rail_payload = fetch("rail", QUERIES["rail"], args.cache_dir)
    areas_payload = fetch("areas", QUERIES["areas"], args.cache_dir)
    rail_lines = [line_points(el) for el in rail_payload["elements"] if line_points(el)]

    by_norm: dict[str, list[list[tuple[float, float]]]] = {}
    for element in streets_payload["elements"]:
        name = (element.get("tags") or {}).get("name")
        if name and line_points(element):
            by_norm.setdefault(norm(name), []).append(line_points(element))

    features: list[dict] = []
    report: list[str] = []

    def add_line(line, street, zone, **extra):
        features.append({
            "type": "Feature",
            "properties": {"kind": "street", "street": street, "zone": zone, **extra},
            "geometry": {"type": "LineString",
                         "coordinates": [[round(lon, 6), round(lat, 6)] for lat, lon in line]},
        })

    # --- streets that belong to exactly one area -----------------------------
    for slug, zone in data["zones"].items():
        for street in zone["streets"]:
            if street in SETTLEMENT_NAMES:
                continue  # drawn as an area (if OSM knows it) or not at all
            lines = by_norm.get(norm(street), [])
            if not lines:
                report.append(f"{zone['name']}: no OSM geometry for '{street}'")
                continue
            for line in lines:
                add_line(line, street, slug)

    # --- streets shared between Oberort and Unterort -------------------------
    for street in SPLIT_STREETS:
        lines = by_norm.get(norm(street), [])
        if not lines:
            report.append(f"no OSM geometry for shared street '{street}'")
            continue
        all_points = [p for line in lines for p in line]
        axis = axis_of(all_points)
        halves: dict[str, list[list[tuple[float, float]]]] = {"before": [], "after": []}
        for line in lines:
            for part in split_at_pivot(line, SPLIT_POINT):
                projection = sum((p[0] - SPLIT_POINT[0]) * axis[0] +
                                 (p[1] - SPLIT_POINT[1]) * axis[1] for p in part) / len(part)
                halves["after" if projection < 0 else "before"].append(part)
        # the half closer to the Badner Bahn is Oberort, the other half Unterort
        distances = {key: distance_to_lines(parts[0][0], rail_lines)
                     for key, parts in halves.items() if parts}
        rail_side = min(distances, key=distances.get) if len(distances) > 1 else "after"
        for key, parts in halves.items():
            if not parts:
                continue
            zone_slug = "oberort" if key == rail_side else "unterort"
            part_label = "Badner Bahn bis Pizzeria Fontana" if zone_slug == "oberort" \
                else "Pizzeria Fontana bis Ortszentrum"
            for part in parts:
                add_line(part, street, zone_slug, shared=True, part=part_label)
        report.append(f"'{street}': split at Pizzeria Fontana -> "
                      f"{len(halves['after'])}/{len(halves['before'])} segments, "
                      f"Badner-Bahn side = {rail_side} (Oberort)")

    # --- railway, for orientation -------------------------------------------
    for line in rail_lines:
        features.append({
            "type": "Feature",
            "properties": {"kind": "rail", "street": "Badner Bahn", "zone": None},
            "geometry": {"type": "LineString",
                         "coordinates": [[round(lon, 6), round(lat, 6)] for lat, lon in line]},
        })

    # --- settlements without an own street name -----------------------------
    for element in areas_payload["elements"]:
        name = (element.get("tags") or {}).get("name")
        geometry = element.get("geometry")
        if name not in SETTLEMENTS or not geometry:
            continue
        properties = {"kind": "settlement", "street": name, "zone": SETTLEMENTS[name]}
        if name == "Anton Benya-Wohnhausanlage":
            properties["street"] = "Benyasiedlung"
            properties["shared"] = True
            properties["note"] = ("Gemeinde-Website: Anton-Benya-Straße gehört zu Oberort. "
                                 "Der Kalender 2026 nennt die Benyasiedlung auf der "
                                 "Seepark-Seite (dort wegen der Müllinseln).")
        features.append({
            "type": "Feature",
            "properties": properties,
            "geometry": {"type": "Polygon",
                         "coordinates": [[[round(p["lon"], 6), round(p["lat"], 6)]
                                          for p in geometry]]},
        })

    geojson = {
        "type": "FeatureCollection",
        "name": "voesendorf-abfuhrgebiete",
        "attribution": "© OpenStreetMap contributors (ODbL), via Overpass API",
        "features": features,
    }
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(geojson, ensure_ascii=False, separators=(",", ":")),
                        encoding="utf-8")
    print(f"wrote {args.out}  features={len(features)}  bytes={args.out.stat().st_size}")
    for line in report:
        print("  -", line)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
