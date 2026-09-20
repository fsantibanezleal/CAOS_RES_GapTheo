from __future__ import annotations

from pathlib import Path
from typing import Any

from data_pipeline.gaptheo.stages.dataset import partition
from data_pipeline.gaptheo.stages.evaluate import evaluate
from data_pipeline.gaptheo.stages.export import export
from data_pipeline.gaptheo.stages.features import extract
from data_pipeline.gaptheo.stages.infer import infer
from data_pipeline.gaptheo.stages.ingest import ingest
from data_pipeline.gaptheo.stages.preprocess import preprocess
from data_pipeline.gaptheo.stages.train import register_methods
from data_pipeline.gaptheo.stages.validate import validate

REPO_ROOT = Path(__file__).resolve().parents[2]
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
