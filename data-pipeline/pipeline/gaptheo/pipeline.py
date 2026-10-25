from __future__ import annotations

from pathlib import Path
from typing import Any

from .stages.dataset import partition
from .stages.evaluate import evaluate
from .stages.export import export
from .stages.features import extract
from .stages.infer import infer
from .stages.ingest import ingest
from .stages.preprocess import preprocess
from .stages.train import register_methods
from .stages.validate import validate

REPO_ROOT = Path(__file__).resolve().parents[3]
INPUT = REPO_ROOT / "data" / "input" / "canonical-scenarios.json"


def run_pipeline(output_root: Path | None = None) -> dict[str, Any]:
    scenarios = preprocess(ingest(INPUT))
    partitions = partition(scenarios)
    method_registry = register_methods()
    certificates = infer(extract(scenarios))
    benchmark = evaluate(certificates, partitions)
    data_root = output_root if output_root else REPO_ROOT / "data"
    frontend_root = None if output_root else REPO_ROOT / "frontend"
    manifest = export(certificates, benchmark, scenarios, method_registry, data_root, frontend_root)
    validate(data_root, manifest, benchmark)
    return {"manifest": manifest, "benchmark": benchmark, "methodRegistry": method_registry}
