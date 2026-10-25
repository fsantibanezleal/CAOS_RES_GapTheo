# Architecture overview

GapTheo is a static research application for finite orbits of circle rotations. Its central state is the orbit
`x_n = {φ + nα}` for `0 ≤ n < N`, together with the sorted circular gaps and a certificate that records the
input conventions, observed lengths, multiplicities, theorem status, arithmetic projections, and numerical residuals.

## Computation lanes

| Lane | Implementation | Responsibility |
|---|---|---|
| Offline reference | `data-pipeline/pipeline/gaptheo/` | Validate canonical scenarios, compute certificates and benchmark rows, export deterministic artifacts. |
| Browser calculation | `frontend/src/core/gapEngine.ts` | Recompute a selected finite orbit as controls change. |
| Replay | `frontend/public/artifacts/` | Serve the committed certificate set to the static site. |
| API | `app/` | Dormant; the deployed product requires no server. |

The browser and Python implementations are checked against the same scenario inputs and normalized certificate fields.
The direct sorted orbit is the finite numerical reference. Farey, continued-fraction, return-time, symbolic, lattice,
and finite-topology views are derived readings with their own assumptions and units; they are not counted as independent
proofs.

## Artifact flow

`data/input/canonical-scenarios.json` is validated and normalized, partitioned into theorem and contrast regimes,
evaluated by the deterministic reference engine, then exported to `data/artifacts/` and the browser's public artifact
directory. The committed manifest records each artifact's identifier, path, status, and content hash. The frontend
renders those records and computes live states with the browser engine. A canonical bake is deliberate; tests use a
temporary output root.

## Product boundary

The static frontend is the deployed product. The dormant API, sample training stack, and template notebooks are not
runtime dependencies. Mathematical declarations such as irrationality are supplied by a scenario and cannot be proved
from a finite decimal or a finite computation. Rational inputs and non-rotation allocators are displayed as boundary or
contrast cases, not as counterexamples to the theorem.
