# Data contract

The scenario contract defines reproducible input. The certificate contract defines inspectable output. JSON Schemas live in `contracts/` and are versioned with the implementation.

## Required invariants

- Scenario identity and category are stable.
- The circular partition residual is numerically zero within tolerance.
- Status follows the declared mathematical regime.
- The content hash is computed from canonical JSON before the hash field is appended.
- Every canonical scenario has one benchmark cell and one public replay artifact.

See [scenario fields](01-scenario.md) and [certificate fields](02-certificate.md).
