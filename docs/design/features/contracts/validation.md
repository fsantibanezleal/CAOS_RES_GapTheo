# Adversarial validation: finite rotations and theorem boundaries

Each check states the defect introduced and names the test that detects it. `scripts/check_sdd.py` enforces one row per requirement and verifies that the test gates exist and can fail.

| requirement | adversarial check | gate |
|---|---|---|
| CT-001 | remove a required alpha input and a required certificate group field; schema validation must reject both malformed documents | `tests/test_reference.py::test_adversarial_scenario_and_certificate_schemas_reject_missing_fields` |
| CT-002 | perturb the declared irrational orbit so the gap count, additive relation, or closure residual leaves the theorem invariant | `tests/test_reference.py::test_adversarial_irrational_rotation_cases_respect_three_gap_bound` |
| CT-003 | use a rational step whose denominator divides N, producing repeated points; theorem status must remain boundary | `frontend/src/core/gapEngine.test.ts::adversarial: rational residue collisions remain theorem boundaries` |
| CT-004 | replay one random seed, verify the declared anchor sequence, and compare anchored and farthest placement; all non-rotations must remain outside theorem status | `frontend/src/core/gapEngine.test.ts::adversarial: seeded random, farthest insertion, and anchored insertion stay outside the theorem claim` |
