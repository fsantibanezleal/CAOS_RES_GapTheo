# Scenario and certificate contracts

GapTheo has two JSON Schema contracts in the repository-root `contracts/` directory. `scenario.schema.json` governs
the declared rotation parameters and allocation regime. `certificate.schema.json` governs the finite computation and
its theorem applicability, exact inputs, raw and grouped gaps, and residuals.

The canonical producer is `data-pipeline/pipeline/gaptheo/`; `scripts/validate_artifacts.py` checks every committed
certificate, the benchmark summary, manifest membership, and hashes. The browser loads committed static artifacts
and recomputes interactive scenarios in its local mathematical engine. A finite decimal never certifies
irrationality, and a schema-valid certificate is evidence about one finite input rather than a proof of the theorem.
