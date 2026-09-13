# Mathematical contract

## Primal theorem

Let alpha be irrational and let the finite orbit be the fractional parts of
0, alpha, through (N - 1) alpha modulo one. Sort the points on the circle and
measure the consecutive circular gaps. At most three distinct lengths occur.
If three occur, the largest equals the sum of the other two.

The app labels N as the number of sampled points. Sources may use n + 1
points; the convention is stated beside each certificate.

## Farey certificate

For the Farey pair a/b < alpha < c/d associated with the finite stage, the
candidate lengths are:

- b alpha - a, with multiplicity N - b;
- c - d alpha, with multiplicity N - d;
- (b - d) alpha + c - a, with multiplicity b + d - N when positive.

The third candidate is algebraically the sum of the first two. The live atlas
uses the current alpha and displays the bracket and candidate values.

## Dual theorem

For a target beta, the return-time view selects indices whose fractional part
lies in the target interval [0, beta), with a visible strict-boundary
convention. It reports the index jumps and their two-gap or three-gap regime.

## Topology

The topology view is the finite zero-dimensional Rips filtration of the circle
sample. Each component merge is linked to an observed adjacent gap length.
This is a transparent derived lens, not a general persistent-homology engine.

## Scope boundaries

Farthest-point allocation, seeded random placement, two-frequency sampling,
interval-exchange extensions, and lattice geometry are comparative lenses.
They illuminate the theorem's mechanism and limits but do not broaden the
classical certificate.

Primary sources:

- Hamada, arXiv:2308.11999: https://arxiv.org/abs/2308.11999
- Alessandri and Berthé: https://www.irif.fr/~berthe/Articles/3d.pdf
- Berthé and Reutenauer, HAL hal-04769002v1: https://hal.science/hal-04769002v1
- Marklof and Strömbergsson: https://arxiv.org/abs/1612.04906
- Taha: https://arxiv.org/abs/1708.04380
