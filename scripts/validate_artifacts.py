from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTIFACTS = ROOT / "data" / "artifacts"
MANIFEST = ROOT / "data" / "manifests" / "index.json"
BENCHMARK = ARTIFACTS / "benchmark.json"


def main() -> None:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    assert manifest["count"] >= 12
    for entry in manifest["artifacts"]:
        path = ARTIFACTS / Path(entry["path"]).name
        payload = json.loads(path.read_text(encoding="utf-8"))
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
