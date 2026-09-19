"""Offline test for the upstream source ``waste_collection_schedule/voesendorf_at.py``.

The module is imported with stubbed ``waste_collection_schedule`` classes so the
data mapping can be verified without installing the integration.  The JSON that
the source normally downloads is replaced by the local ``data/`` file.

Run:  python tests/test_upstream_source.py
"""

import json
import pathlib
import sys
import types

ROOT = pathlib.Path(__file__).resolve().parents[1]

WASTE_LABELS = (("RM", "Restmüll"), ("RM4", "Restmüll (4-wöchig)"), ("Bio", "Biomüll"))


def _stub_waste_collection_schedule() -> None:
    package = types.ModuleType("waste_collection_schedule")
    package.__path__ = []

    class Collection:
        def __init__(self, date=None, t=None, icon=None):
            self.date, self.t, self.icon = date, t, icon

    class Icons:
        GENERAL_WASTE = "general_waste"
        ORGANIC = "organic"

    exceptions = types.ModuleType("waste_collection_schedule.exceptions")

    class SourceArgumentNotFound(Exception):
        pass

    class SourceArgumentNotFoundWithSuggestions(Exception):
        pass

    exceptions.SourceArgumentNotFound = SourceArgumentNotFound
    exceptions.SourceArgumentNotFoundWithSuggestions = SourceArgumentNotFoundWithSuggestions
    package.Collection = Collection
    package.Icons = Icons
    sys.modules["waste_collection_schedule"] = package
    sys.modules["waste_collection_schedule.exceptions"] = exceptions


def main() -> int:
    _stub_waste_collection_schedule()
    sys.path.insert(0, str(ROOT / "waste_collection_schedule" / "source"))
    import voesendorf_at  # noqa: PLC0415

    verified = json.loads(
        (ROOT / "data/voesendorf_waste_2026.json").read_text(encoding="utf-8"))

    problems: list[str] = []
    for zone_slug in ("oberort", "unterort", "seepark"):
        source = voesendorf_at.Source(zone_slug, 2026)
        source._fetch_year = staticmethod(lambda year: verified)  # noqa: SLF001
        entries = source.fetch()

        collected: dict[str, set[str]] = {}
        for entry in entries:
            collected.setdefault(entry.t, set()).add(entry.date.isoformat())

        print(f"=== {zone_slug} ===")
        for waste, name in WASTE_LABELS:
            expected = set(verified["zones"][zone_slug]["dates"][waste])
            actual = collected.get(name, set())
            missing, extra = sorted(expected - actual), sorted(actual - expected)
            status = "OK  " if not missing and not extra else "FAIL"
            print(f"  {status} {name:22} parsed={len(actual):2} expected={len(expected):2}"
                  f" missing={missing} extra={extra}")
            if missing or extra:
                problems.append(f"{zone_slug}/{waste}: missing={missing} extra={extra}")

        expected_total = sum(
            len(dates) for dates in verified["zones"][zone_slug]["dates"].values())
        if len(entries) != expected_total:
            problems.append(
                f"{zone_slug}: {len(entries)} collection entries, expected {expected_total}")

    try:
        voesendorf_at.Source("does-not-exist")
        problems.append("an unknown zone was accepted")
    except voesendorf_at.SourceArgumentNotFoundWithSuggestions:
        print("\nOK   unknown zone rejected")

    if problems:
        print("\nPROBLEMS:")
        for problem in problems:
            print(" -", problem)
        return 1
    print("\nall checks passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
