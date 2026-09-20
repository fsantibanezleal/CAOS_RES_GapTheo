from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def ingest(path: Path) -> list[dict[str, Any]]:
    scenarios = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(scenarios, list) or not scenarios:
        raise ValueError("scenario source must be a non-empty array")
    ids: set[str] = set()
    for scenario in scenarios:
        missing = {"id", "category", "alpha", "alphaMode", "pointCount", "allocator", "seed", "beta"} - scenario.keys()
        if missing:
            raise ValueError(f"{scenario.get('id', '<unknown>')}: missing {sorted(missing)}")
        if scenario["id"] in ids:
            raise ValueError(f"duplicate scenario id: {scenario['id']}")
        ids.add(scenario["id"])
    return scenarios
