# Requirements: finite rotations and theorem boundaries

EARS requirements for the product certificate and its browser presentation. Every requirement names a live gate.

| ID | Requirement | Gate |
|---|---|---|
| CT-001 | THE canonical scenario matrix SHALL validate against `contracts/scenario.schema.json`, and every committed result SHALL validate against `contracts/certificate.schema.json`. | `tests/test_reference.py::test_adversarial_scenario_and_certificate_schemas_reject_missing_fields` |
| CT-002 | THE direct orbit certificate SHALL retain N cyclic gaps including wraparound and report a closed partition with at most three distinct lengths for declared irrational rotations. | `tests/test_reference.py::test_adversarial_irrational_rotation_cases_respect_three_gap_bound` |
| CT-003 | WHEN an exact rational orbit collides, THE certificate SHALL label it a boundary and SHALL NOT present it as an irrational theorem case. | `frontend/src/core/gapEngine.test.ts::adversarial: rational residue collisions remain theorem boundaries` |
| CT-004 | WHEN an allocator is not a rotation, THE certificate SHALL label the result a contrast and a fixed random seed SHALL reproduce the same point set. | `frontend/src/core/gapEngine.test.ts::adversarial: seeded random and farthest insertion stay outside the theorem claim` |
