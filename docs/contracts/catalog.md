# GapTheo contract catalog

The catalog binds canonical inputs and public outputs to their schemas, producer and consumer checks, and deterministic providers. Schema versions describe the JSON shape; the application release is tracked separately in `VERSION`.

| id | version | owner | schema file | example | producer test | consumer test | missing-data behavior | provider | swap test | model io | documents |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| scenario | 1.0.0 | GapTheo research | contracts/scenario.schema.json | contracts/examples/golden-baseline.json | tests/test_reference.py::test_pipeline_smoke_writes_only_to_sandbox | tests/test_reference.py::test_adversarial_scenario_and_certificate_schemas_reject_missing_fields | missing: pipeline rejects an absent canonical scenario catalog | baseline:data/input/canonical-scenarios.json | tests/test_reference.py::test_canonical_matrix_has_twelve_distinct_cases | - | contracts/examples/golden-baseline.json |
| certificate | 1.0.0 | GapTheo research | contracts/certificate.schema.json | data/artifacts/golden-baseline.json | tests/test_reference.py::test_pipeline_smoke_writes_only_to_sandbox | tests/test_reference.py::test_committed_benchmark_is_complete | missing: generation fails if a canonical certificate cannot be produced | baseline:data/artifacts/golden-baseline.json | tests/test_reference.py::test_adversarial_irrational_rotation_cases_respect_three_gap_bound | - | data/artifacts/*.json, !data/artifacts/benchmark.json, !data/artifacts/method-registry.json |

## History

| contract | version | date | change | kind |
| --- | --- | --- | --- | --- |
| scenario | 1.0.0 | 2026-10-24 | Initial reproducible rotation scenario schema and canonical example. | initial |
| certificate | 1.0.0 | 2026-10-24 | Initial deterministic certificate schema and generated evidence set. | initial |
