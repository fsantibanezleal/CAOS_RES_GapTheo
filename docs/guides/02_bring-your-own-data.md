# Use a different rotation scenario

Copy a complete row in `data/input/canonical-scenarios.json` and change its identifier, angle expression, normalized step, phase, point count, or allocation control. Keep the declared regime consistent with the parameter: rational inputs need a numerator and denominator; an irrational decimal remains a numerical declaration and is not proof of irrationality.

Generate a certificate with `python data-pipeline/run.py`, then validate the full committed matrix with `python scripts/validate_artifacts.py`. Keep seeded random and farthest-point allocation cases labelled as controls. Review changes to `data/artifacts/benchmark.json` and `data/manifests/index.json` with the scenario edit.
