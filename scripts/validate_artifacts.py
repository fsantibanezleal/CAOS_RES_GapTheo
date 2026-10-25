from __future__ import annotations

import hashlib
import json
from pathlib import Path
import jsonschema

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "data" / "artifacts"
MANIFEST = ROOT / "data" / "manifests" / "index.json"
BENCHMARK = ARTIFACTS / "benchmark.json"
SCENARIO_SCHEMA = json.loads((ROOT / "contracts" / "scenario.schema.json").read_text(encoding="utf-8"))
CERTIFICATE_SCHEMA = json.loads((ROOT / "contracts" / "certificate.schema.json").read_text(encoding="utf-8"))


def validate_scenario(scenario: dict) -> None:
    jsonschema.validate(scenario, SCENARIO_SCHEMA)


def validate_certificate(certificate: dict) -> None:
    jsonschema.validate(certificate, CERTIFICATE_SCHEMA)


def main() -> None:
    source = json.loads((ROOT / "data" / "input" / "canonical-scenarios.json").read_text(encoding="utf-8"))
    for scenario in source:
        validate_scenario(scenario)
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assert manifest["count"] >= 12
    for entry in manifest["artifacts"]:
        path = ARTIFACTS / Path(entry["path"]).name
        payload = json.loads(path.read_text(encoding="utf-8"))
        validate_certificate(payload)
        expected = payload.pop("hash")
        encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode()
        actual = hashlib.sha256(encoded).hexdigest()
        assert actual == expected == entry["hash"], path
        assert payload["distinctCount"] <= len(payload["gaps"])
        assert payload["sumCheck"]["holds"] or payload["distinctCount"] != 3
        assert payload["partitionResidual"] < 1e-10
    benchmark = json.loads(BENCHMARK.read_text(encoding="utf-8"))
    assert benchmark["summary"]["total"] == manifest["count"]
    assert benchmark["summary"]["passed"] == manifest["count"]
    print(f"validated {manifest['count']} certificates and the complete benchmark matrix")


if __name__ == "__main__":
    main()
