from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "data" / "input" / "canonical-scenarios.json"
ARTIFACT_DIR = ROOT / "data" / "artifacts"
MANIFEST_DIR = ROOT / "data" / "manifests"
FRONTEND_ARTIFACT_DIR = ROOT / "frontend" / "public" / "artifacts"
COLORS = ["#f1b66e", "#58d2c2", "#d98cff"]


def frac(value: float) -> float:
    return value - math.floor(value)


def seeded(seed: int):
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
            return [frac(phase + ((p * i) % q) / q) for i in range(count)]
        return [frac(phase + i * alpha) for i in range(count)]
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


def groups(values: list[float]) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    ordered = sorted(values)
    gaps = []
    for index, start in enumerate(ordered):
        end = ordered[(index + 1) % len(ordered)]
        length = end - start if index < len(ordered) - 1 else 1 - start + end
        gaps.append({"id": f"gap-{index}", "start": start, "end": end, "length": length})
    result: list[dict[str, Any]] = []
    for gap in sorted(gaps, key=lambda item: item["length"]):
        current = next((item for item in result if abs(item["length"] - gap["length"]) < 1e-8), None)
        if current:
            current["count"] += 1
        else:
            index = len(result)
            result.append({"type": chr(97 + index), "length": gap["length"], "count": 1, "color": COLORS[index] if index < len(COLORS) else "#9aa6b2"})
    for gap in gaps:
        group = next(item for item in result if abs(item["length"] - gap["length"]) < 1e-8)
        gap["type"] = group["type"]
    return gaps, result


def certificate(scenario: dict[str, Any]) -> dict[str, Any]:
    points = allocate(scenario)
    gaps, gap_groups = groups(points)
    lengths = [item["length"] for item in gap_groups]
    residual = abs(lengths[2] - lengths[1] - lengths[0]) if len(lengths) == 3 else 0.0
    collision = len({round(value, 10) for value in points}) != len(points)
    contrast = scenario.get("allocator") != "rotation"
    status = "contrast" if contrast else "boundary" if scenario.get("alphaMode") == "rational" or collision else "certified" if len(lengths) <= 3 and residual < 1e-7 else "warning"
    payload = {
        "scenarioId": scenario["id"],
        "method": "direct-sorted-orbit",
        "methodVersion": "0.01.000",
        "theoremStatus": status,
        "pointCount": len(points),
        "distinctCount": len(gap_groups),
        "groups": gap_groups,
        "gaps": gaps,
        "sumCheck": {"holds": len(lengths) < 3 or residual < 1e-7, "residual": residual},
        "points": [{"index": i, "value": value} for i, value in enumerate(points)],
        "source": ["arXiv:2308.11999", "HAL:hal-04769002"],
    }
    encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
    payload["hash"] = hashlib.sha256(encoded).hexdigest()
    return payload


def main() -> None:
    scenarios = json.loads(INPUT.read_text(encoding="utf-8"))
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    MANIFEST_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []
    for scenario in scenarios:
        artifact = certificate(scenario)
        name = scenario["id"] + ".json"
        encoded = json.dumps(artifact, indent=2, sort_keys=True) + "\n"
        (ARTIFACT_DIR / name).write_text(encoded, encoding="utf-8")
        (FRONTEND_ARTIFACT_DIR / name).write_text(encoded, encoding="utf-8")
        manifest.append({"id": scenario["id"], "path": "artifacts/" + name, "hash": artifact["hash"], "status": artifact["theoremStatus"]})
    manifest_payload = {"version": "0.01.000", "count": len(manifest), "artifacts": manifest}
    (MANIFEST_DIR / "index.json").write_text(json.dumps(manifest_payload, indent=2) + "\n", encoding="utf-8")
    (FRONTEND_ARTIFACT_DIR / "index.json").write_text(json.dumps(manifest_payload, indent=2) + "\n", encoding="utf-8")
    print(f"generated {len(manifest)} certificates")


if __name__ == "__main__":
    main()
