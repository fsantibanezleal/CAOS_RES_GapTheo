from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def _write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def export(
    certificates: list[dict[str, Any]],
    benchmark: dict[str, Any],
    scenarios: list[dict[str, Any]],
    method_registry: dict[str, object],
    root: Path,
    frontend_root: Path | None,
) -> dict[str, Any]:
    artifact_dir = root / "artifacts"
    manifest_dir = root / "manifests"
    manifest_entries = []
    for cert in certificates:
        name = cert["scenarioId"] + ".json"
        _write_json(artifact_dir / name, cert)
        manifest_entries.append(
            {"id": cert["scenarioId"], "path": "artifacts/" + name, "hash": cert["hash"], "status": cert["theoremStatus"]}
        )
        if frontend_root:
            _write_json(frontend_root / "public" / "artifacts" / name, cert)
    _write_json(artifact_dir / "benchmark.json", benchmark)
    _write_json(artifact_dir / "method-registry.json", method_registry)
    manifest = {"version": "0.02.000", "count": len(manifest_entries), "artifacts": manifest_entries}
    _write_json(manifest_dir / "index.json", manifest)
    if frontend_root:
        _write_json(frontend_root / "public" / "artifacts" / "index.json", manifest)
        _write_json(frontend_root / "src" / "data" / "benchmark.json", benchmark)
        _write_json(frontend_root / "src" / "data" / "scenarios.json", scenarios)
    return manifest
