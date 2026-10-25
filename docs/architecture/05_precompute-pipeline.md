# Offline research pipeline

`python data-pipeline/run.py` reads `data/input/canonical-scenarios.json`, validates each scenario, computes a
certificate, and exports the canonical benchmark and manifest. The pipeline is deterministic and uses Python's
standard library; it does not train a model or require network access.

The stages under `data-pipeline/pipeline/gaptheo/stages/` separate ingestion, normalization, evaluation, and export.
The mathematical engine in `model.py` supplies both the offline certificates and notebook calculations. Generated
artifacts are validated before they are copied into the frontend's static artifact catalog.

```powershell
python data-pipeline/run.py
python scripts/validate_artifacts.py
```

The committed scenarios cover irrational and transcendental rotations, phase and finite-size changes, rational
periodicity, near-rational conditioning, and seeded or farthest-point controls. Non-rotation controls are never
treated as tests of the theorem.
