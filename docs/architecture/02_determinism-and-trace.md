# Deterministic certificates

Each scenario is a canonical JSON object in `data/input/canonical-scenarios.json`. The offline pipeline normalizes it,
computes the finite orbit and cyclic partition, derives arithmetic checks, and writes a certificate with a canonical
SHA-256 digest. Re-running the same version and inputs produces byte-identical artifacts.

The certificate preserves the input, generated points, sorted cyclic gaps including wraparound, grouped lengths,
multiplicities, theorem status, Farey bracket, continued-fraction terms, and closure residual. Numerical tolerance is
recorded and grouping never replaces the raw gap list. The digest detects changed bytes; it is not a mathematical proof.

The browser workbench computes the same finite object from interactive controls. Its TypeScript implementation and
Python pipeline are checked against shared scenario fixtures. Rational and synthetic allocations remain explicitly
labelled boundary or contrast cases.
