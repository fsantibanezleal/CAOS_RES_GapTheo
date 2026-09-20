from __future__ import annotations

from typing import Any

from data_pipeline.gaptheo.model import certificate


def extract(scenarios: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [certificate(scenario) for scenario in scenarios]
