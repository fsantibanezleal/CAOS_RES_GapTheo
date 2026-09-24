from __future__ import annotations

import hashlib
import json
import math
from collections.abc import Callable
from typing import Any

COLORS = ["#58a6ff", "#f778ba", "#d29922", "#3fb1c8", "#f85149"]
TOLERANCE = 1e-8


def frac(value: float) -> float:
    return value - math.floor(value)


def seeded(seed: int) -> Callable[[], float]:
    state = (seed & 0xFFFFFFFF) ^ 0x9E3779B9

    def random() -> float:
        nonlocal state
        state = ((state ^ (state >> 15)) * (1 | state)) & 0xFFFFFFFF
        state ^= (state + (((state ^ (state >> 7)) * (61 | state)) & 0xFFFFFFFF)) & 0xFFFFFFFF
        return ((state ^ (state >> 14)) & 0xFFFFFFFF) / 4294967296

    return random


def allocate(scenario: dict[str, Any]) -> list[float]:
    count = int(scenario["pointCount"])
    alpha = float(scenario["alpha"])
    phase = float(scenario.get("phase", 0))
    allocator = scenario.get("allocator", "rotation")
    if allocator == "rotation":
        if scenario.get("alphaMode") == "rational":
            p, q = int(scenario.get("rationalP", 0)), int(scenario.get("rationalQ", 1))
            return [frac(phase + ((p * index) % q) / q) for index in range(count)]
        return [frac(phase + index * alpha) for index in range(count)]
    if allocator == "random":
        random = seeded(int(scenario.get("seed", 17)))
        return [random() for _ in range(count)]
    points = [frac(phase)]
    for _ in range(1, count):
        ordered = sorted(points)
        gaps = []
        for index, start in enumerate(ordered):
            end = ordered[(index + 1) % len(ordered)]
            length = end - start if index < len(ordered) - 1 else 1 - start + end
            gaps.append((length, start))
        largest, start = sorted(gaps, key=lambda item: (-item[0], item[1]))[0]
        points.append(frac(start + largest / 2))
    return points


def gap_partition(values: list[float]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    ordered = sorted(values)
    gaps: list[dict[str, Any]] = []
    for index, start in enumerate(ordered):
        end = ordered[(index + 1) % len(ordered)]
        length = end - start if index < len(ordered) - 1 else 1 - start + end
        gaps.append({"id": f"gap-{index}", "start": start, "end": end, "length": length})
    groups: list[dict[str, Any]] = []
    for gap in sorted(gaps, key=lambda item: item["length"]):
        current = next((item for item in groups if abs(item["length"] - gap["length"]) < TOLERANCE), None)
        if current:
            current["count"] += 1
        else:
            index = len(groups)
            groups.append(
                {
                    "type": chr(97 + index),
                    "length": gap["length"],
                    "count": 1,
                    "color": COLORS[index] if index < len(COLORS) else "#9aa6b2",
                }
            )
    for gap in gaps:
        group = next(item for item in groups if abs(item["length"] - gap["length"]) < TOLERANCE)
        gap["type"] = group["type"]
    return gaps, groups


def continued_fraction(alpha: float, limit: int = 12) -> dict[str, Any]:
    terms: list[int] = []
    convergents: list[dict[str, Any]] = []
    x = alpha
    p_nm2, p_nm1 = 0, 1
    q_nm2, q_nm1 = 1, 0
    for _ in range(limit):
        term = math.floor(x)
        terms.append(term)
        p = term * p_nm1 + p_nm2
        q = term * q_nm1 + q_nm2
        convergents.append({"p": p, "q": q, "error": abs(alpha - p / q) if q else 0.0})
        remainder = x - term
        if abs(remainder) < 1e-14:
            break
        x = 1 / remainder
        p_nm2, p_nm1 = p_nm1, p
        q_nm2, q_nm1 = q_nm1, q
    return {"terms": terms, "convergents": convergents}


def farey_bracket(alpha: float, order: int) -> dict[str, Any]:
    fractions = sorted(
        {(p / q, p, q) for q in range(1, order + 1) for p in range(q + 1) if math.gcd(p, q) == 1}
    )
    left = (0, 1)
    right = (1, 1)
    for value, p, q in fractions:
        if value <= alpha:
            left = (p, q)
        else:
            right = (p, q)
            break
    return {"left": list(left), "right": list(right)}


def star_discrepancy(values: list[float]) -> float:
    ordered = sorted(values)
    count = len(ordered)
    return max(
        max((index + 1) / count - value, value - index / count)
        for index, value in enumerate(ordered)
    )


def dual_return_gaps(scenario: dict[str, Any]) -> dict[str, Any]:
    alpha = float(scenario["alpha"])
    phase = float(scenario.get("phase", 0))
    beta = float(scenario.get("beta", 0.31))
    strict = bool(scenario.get("strictBeta", True))
    limit = max(120, int(scenario["pointCount"]) * 8)
    selected = [
        index
        for index in range(limit)
        if (frac(phase + index * alpha) < beta if strict else frac(phase + index * alpha) <= beta)
    ][: max(8, int(scenario["pointCount"]))]
    jumps = [selected[index + 1] - selected[index] for index in range(len(selected) - 1)]
    distinct = sorted(set(jumps))
    return {"selected": selected, "jumps": jumps, "distinct": distinct, "distinctCount": len(distinct)}


def certificate(scenario: dict[str, Any]) -> dict[str, Any]:
    points = allocate(scenario)
    gaps, gap_groups = gap_partition(points)
    lengths = [item["length"] for item in gap_groups]
    residual = abs(lengths[2] - lengths[1] - lengths[0]) if len(lengths) == 3 else 0.0
    collision = len({round(value, 12) for value in points}) != len(points)
    contrast = scenario.get("allocator") != "rotation"
    status = (
        "contrast"
        if contrast
        else "boundary"
        if scenario.get("alphaMode") == "rational" or collision
        else "certified"
        if len(lengths) <= 3 and residual < 1e-7
        else "warning"
    )
    dual = dual_return_gaps(scenario) if scenario.get("allocator") == "rotation" else None
    payload: dict[str, Any] = {
        "scenarioId": scenario["id"],
        "category": scenario["category"],
        "method": "direct-sorted-orbit",
        "methodVersion": "0.02.000",
        "theoremStatus": status,
        "pointCount": len(points),
        "distinctCount": len(gap_groups),
        "groups": gap_groups,
        "gaps": gaps,
        "sumCheck": {"holds": len(lengths) != 3 or residual < 1e-7, "residual": residual},
        "partitionResidual": abs(sum(item["length"] for item in gaps) - 1),
        "points": [{"index": index, "value": value} for index, value in enumerate(points)],
        "continuedFraction": continued_fraction(float(scenario["alpha"])),
        "farey": farey_bracket(float(scenario["alpha"]), int(scenario["pointCount"])),
        "dual": dual,
        "starDiscrepancy": star_discrepancy(points),
        "source": ["arXiv:2308.11999", "HAL:hal-04769002"],
    }
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    payload["hash"] = hashlib.sha256(encoded).hexdigest()
    return payload
