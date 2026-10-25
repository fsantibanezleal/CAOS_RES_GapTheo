# Canonical scenario matrix

The canonical deck contains twelve cases. Each has a stable identifier, a declared angle representation, a point
count, phase, allocator, and theorem-regime label. The complete inputs are in
[`data/input/canonical-scenarios.json`](../../data/input/canonical-scenarios.json); the committed output certificate
for each case is listed in [`data/manifests/index.json`](../../data/manifests/index.json).

| Scenario | Category | Role in the matrix |
|---|---|---|
| `golden-baseline` | Irrational rotations | Badly approximable quadratic baseline. |
| `silver-ratio` | Irrational rotations | Independent quadratic irrational. |
| `sqrt-three` | Irrational rotations | A three-distinct-length example for the additive relation. |
| `e-tail` | Transcendental rotations | Finite numerical representation of a named transcendental constant. |
| `pi-tail` | Transcendental rotations | Second named-constant example. |
| `phase-shifted-golden` | Phase and finite size | Phase sensitivity under the same rotation. |
| `low-n-golden` | Phase and finite size | Small finite-orbit boundary. |
| `near-five-thirteenths` | Numerical conditioning | Near-rational conditioning probe. |
| `rational-five-thirteenths` | Rational boundaries | Exact rational step and collision behavior. |
| `rational-eight-twenty-one` | Rational boundaries | A second exact rational boundary. |
| `farthest-contrast` | Process contrasts | Deterministic largest-gap insertion; not a rotation orbit. |
| `seeded-random-contrast` | Process contrasts | Seeded independent points; not a rotation orbit. |

The final two allocators are intentionally outside the theorem hypotheses. A passing row confirms that the application
computed and labelled the contrast correctly; it does not extend the three-gap theorem to those point sets.
