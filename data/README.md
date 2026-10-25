# Research inputs and artifacts

| Path | Purpose | Versioning |
|---|---|---|
| `input/canonical-scenarios.json` | Twelve named rotation, rational-boundary, conditioning, and allocator-contrast cases. | Committed; source of the canonical bake. |
| `artifacts/*.json` | Direct orbit certificates, method registry, benchmark rows, and per-case evidence. | Committed; each certificate is content-hashed. |
| `data/manifests/index.json` | Maps scenario identifiers to certificate paths, hashes, and theorem-status labels. | Committed. |
| `demo/`, `examples/`, `samples/` | Small fixtures for reproducibility and contract checks. | Committed only when used by a live check. |

There is no private or raw external dataset in the canonical matrix. Transcendental constants are represented by
finite machine values and must not be read as proofs of irrationality. Rational cases and non-rotation allocators are
labelled as boundary and contrast scenarios. The published benchmark is a reproducibility record of these selected
inputs, not a statistical generalization claim.

Run `python scripts/validate_artifacts.py` to verify digests, partition closure, theorem checks, and benchmark totals.
