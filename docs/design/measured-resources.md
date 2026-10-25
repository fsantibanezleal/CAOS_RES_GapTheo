# Committed experiment matrix

The canonical evidence set contains 12 named scenarios. Its benchmark artifact records 12 evaluation rows, all of which
pass their declared checks. This is a reproducibility matrix for selected finite inputs; it is not a statistical sample
and does not establish the theorem.

| Scenario class | Rows | Interpretation |
|---|---:|---|
| Irrational rotations | 3 | Declared theorem-regime examples with quadratic irrational steps. |
| Transcendental rotations | 2 | Declared theorem-regime examples using finite numerical representations of named constants. |
| Phase and finite size | 2 | Changes in phase or orbit length while retaining a rotation allocator. |
| Rational boundaries | 2 | Exact rational steps, where orbit collisions make the irrational theorem inapplicable. |
| Process contrasts | 2 | Seeded random and farthest-point allocations; neither is a circle rotation orbit. |
| Numerical conditioning | 1 | A near-rational step used to expose finite-precision sensitivity. |

Across the committed matrix, 8 rows carry the `certified` regime label, 2 are rational `boundary` rows, and 2 are
`contrast` rows. Seven rows show two distinct geometric lengths, four show three, and one contrast allocator shows
34. The contrast rows passing the benchmark means their behavior and status were computed and recorded correctly; it
does not mean they satisfy the three-gap conclusion.

## What is measured

The certificate stores the direct orbit, sorted circular gaps, multiplicities, partition-closure residual, additive
three-length residual when applicable, return-gap inventory, discrepancy, theorem status, method version, and a
canonical SHA-256 digest. The benchmark stores the check outcomes and residuals per scenario. The manifest binds each
scenario identifier to its artifact path, status, and digest.

Run `python scripts/validate_artifacts.py` to verify the committed artifacts. To recompute the full canonical set,
run `python scripts/precompute.ps1` on Windows or `./scripts/precompute.sh` on Unix. Tests pass a temporary output root
and do not overwrite the committed evidence.

No latency, generalization, or large-`N` performance claim is made by this matrix. The browser workbench recomputes
interactive finite examples; the committed benchmark is not a benchmark of browser throughput.
