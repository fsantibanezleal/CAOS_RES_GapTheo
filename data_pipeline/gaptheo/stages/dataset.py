from __future__ import annotations

from typing import Any


def partition(scenarios: list[dict[str, Any]]) -> dict[str, list[str]]:
    result = {"theorem": [], "boundary": [], "contrast": []}
    for scenario in scenarios:
        lane = "contrast" if scenario["allocator"] != "rotation" else "boundary" if scenario["alphaMode"] == "rational" else "theorem"
        result[lane].append(scenario["id"])
    if not all(result.values()):
        raise ValueError("coverage matrix must contain theorem, boundary, and contrast cases")
    return result
