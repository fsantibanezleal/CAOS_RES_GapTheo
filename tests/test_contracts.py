from __future__ import annotations

import json
from pathlib import Path

import jsonschema

ROOT = Path(__file__).resolve().parents[1]


def test_committed_scenario_example_matches_the_scenario_contract() -> None:
    example = json.loads((ROOT / "contracts" / "examples" / "golden-baseline.json").read_text(encoding="utf-8"))
    schema = json.loads((ROOT / "contracts" / "scenario.schema.json").read_text(encoding="utf-8"))
    jsonschema.validate(example, schema)


def test_every_baked_certificate_matches_the_certificate_contract() -> None:
    paths = sorted((ROOT / "data" / "artifacts").glob("*.json"))
    paths = [path for path in paths if path.name not in {"benchmark.json", "method-registry.json"}]
    assert len(paths) == 12
    schema = json.loads((ROOT / "contracts" / "certificate.schema.json").read_text(encoding="utf-8"))
    for path in paths:
        jsonschema.validate(json.loads(path.read_text(encoding="utf-8")), schema)


def test_catalog_history_and_schema_lock_cover_the_public_contracts() -> None:
    catalog = (ROOT / "docs" / "contracts" / "catalog.md").read_text(encoding="utf-8")
    lock = json.loads((ROOT / "docs" / "contracts" / "versions.lock.json").read_text(encoding="utf-8"))
    assert set(lock) == {"scenario", "certificate"}
    assert "| scenario | 1.0.0 |" in catalog
    assert "| certificate | 1.0.0 |" in catalog
