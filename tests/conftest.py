"""Test guard: product tests never modify canonical scenarios or committed certificates."""
from __future__ import annotations

import hashlib
import pathlib
import sys

import pytest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "data-pipeline"))
GUARDED = (ROOT / "data", ROOT / "manifests", ROOT / "frontend" / "public" / "artifacts")


def _snapshot() -> dict[str, str]:
    out: dict[str, str] = {}
    for base in GUARDED:
        if not base.exists():
            continue
        for path in sorted(base.rglob("*")):
            if path.is_file():
                out[path.relative_to(ROOT).as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    return out


def pytest_sessionstart(session: pytest.Session) -> None:
    session.config._gaptheo_snapshot = _snapshot()  # type: ignore[attr-defined]


def pytest_sessionfinish(session: pytest.Session, exitstatus: int) -> None:
    before = getattr(session.config, "_gaptheo_snapshot", None)
    if before is None:
        return
    after = _snapshot()
    changed = sorted(path for path in before.keys() | after.keys() if before.get(path) != after.get(path))
    if changed:
        listing = "\n  ".join(changed[:20])
        print(f"\nERROR: tests changed committed research inputs or outputs:\n  {listing}")
        session.exitstatus = 1
