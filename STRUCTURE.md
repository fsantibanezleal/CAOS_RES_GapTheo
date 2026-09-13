# Repository structure

GapTheo follows the CAOS scientific-product template with an analytic
adaptation of the data pipeline.

- data_pipeline/: deterministic reference implementation and artifact
  generation.
- contracts/: scenario and certificate JSON schemas.
- data/: source fixtures, generated artifacts, and manifests.
- frontend/: Vite React application and checked-in replay artifacts.
- docs/: architecture, research, deployment, and user-facing wiki material.
- manuscripts/: reproducible manuscript source and figures.
- scripts/: validation and release checks.
- tests/: Python and frontend contract tests.

The template's train slot is explicitly not applicable: GapTheo uses analytic
methods and does not contain learned weights or hidden inference.
