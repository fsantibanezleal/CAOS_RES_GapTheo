# Offline reference pipeline

The reproducible Python implementation lives in `pipeline/gaptheo/` and runs by path as `python data-pipeline/run.py`.
It uses Python's standard library and reads the canonical 12-scenario deck at `data/input/canonical-scenarios.json`.

The stages validate and normalize scenario inputs, split theorem and contrast regimes, compute direct orbit
certificates, evaluate declared invariants, export artifacts and the benchmark, then validate the output. A deliberate
canonical bake writes beneath `data/artifacts/` and `frontend/public/artifacts/`. Tests use a temporary output root.

See [the architecture overview](../docs/architecture/01_overview.md),
[the experiment matrix](../docs/design/measured-resources.md), and
[the reproduction record](../docs/research/reproducibility.md).
