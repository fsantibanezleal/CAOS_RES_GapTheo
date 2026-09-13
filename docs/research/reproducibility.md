# Reproducibility

## Requirements

- Python 3.11 or later
- Node 20 or later
- npm 10 or later

## Generate and validate

From the repository root:

    python data_pipeline/run.py
    python scripts/validate_artifacts.py
    python -m unittest discover -s tests -p "test_*.py"
    npm --prefix frontend install
    npm --prefix frontend run typecheck
    npm --prefix frontend run test
    npm --prefix frontend run build

The generator reads data/input/canonical-scenarios.json and writes matching
JSON to data/artifacts, data/manifests, and frontend/public/artifacts. Each
artifact carries a SHA-256 hash over its canonical payload.

## Canonical cases

- golden-baseline: irrational rotation
- rational-boundary: exact periodic residue case
- farthest-contrast: greedy largest-arc midpoint allocation

The live workbench additionally supports seeded random placement, dual beta
experiments, topology thresholds, and a two-frequency extension.

## What is independently checked

The reference tests compare the three-gap bound, additive residual, rational
boundary labelling, seeded reproducibility, and contrast status. The browser
engine has matching Vitest tests. CI runs both lanes before Pages deployment.
