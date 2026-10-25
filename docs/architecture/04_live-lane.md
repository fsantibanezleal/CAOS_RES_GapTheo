# Browser calculation lane

The live lane evaluates the selected finite orbit directly in the browser. Given an angle step `α`, phase `φ`, point
count `N`, and allocator, it constructs the positions, sorts them on `[0,1)`, closes the final-to-first arc, groups
equal lengths under the declared tolerance, and reports the partition residual and theorem status.

The implementation is `frontend/src/core/gapEngine.ts`. It keeps rational input handling, duplicate positions,
floating-point exploratory values, and non-rotation allocators distinguishable. A seeded random allocator replays from
its seed. The farthest-point allocator inserts into a currently largest empty arc and is explicitly a contrast process.
Neither contrast allocator enters the classical theorem's hypotheses.

## Evidence and limits

The direct orbit is the numerical reference for a selected finite state. Farey neighbours, continued fractions,
return gaps, cyclic words, lattice coordinates, and finite `H₀` consume that state and expose their own residuals or
validity limits. The direct and arithmetic descriptions are compared; agreement is an implementation cross-check, not
an independent proof.

The scenario carries the declared mathematical regime. A decimal approximation cannot establish irrationality, and a
finite run cannot prove the theorem. Rational collisions are represented as duplicate residues rather than fabricated
positive gaps. Every circular partition must close to one turn, including in contrast and boundary cases.

## Checks

`frontend/src/core/gapEngine.test.ts` checks orbit construction, wrap handling, multiplicities, rational boundaries,
allocator behavior, and certificate invariants. The Python reference tests in `tests/test_reference.py` exercise the
same canonical scenario deck through `data-pipeline/pipeline/gaptheo/`. `npm run gate` measures the built static site at
five viewports, both themes, and both interface languages, including the workbench's Focus mode.
