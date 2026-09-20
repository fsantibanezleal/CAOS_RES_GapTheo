from __future__ import annotations

from typing import Any


def preprocess(scenarios: list[dict[str, Any]]) -> list[dict[str, Any]]:
    normalized: list[dict[str, Any]] = []
    for source in scenarios:
        scenario = {**source}
        scenario.setdefault("phase", 0.0)
        scenario.setdefault("strictBeta", True)
        scenario.setdefault("rationalP", 5)
        scenario.setdefault("rationalQ", 13)
        if scenario["alphaMode"] == "rational":
            scenario["alpha"] = scenario["rationalP"] / scenario["rationalQ"]
        if not 0 < float(scenario["alpha"]) < 1:
            raise ValueError(f"{scenario['id']}: alpha must lie in (0, 1)")
        if not 3 <= int(scenario["pointCount"]) <= 900:
            raise ValueError(f"{scenario['id']}: pointCount outside [3, 900]")
        normalized.append(scenario)
    return normalized
