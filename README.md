# GapTheo

[![CI](https://github.com/fsantibanezleal/CAOS_RES_GapTheo/actions/workflows/ci.yml/badge.svg)](https://github.com/fsantibanezleal/CAOS_RES_GapTheo/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-0.03.000-58d2c2)](VERSION)
[![License](https://img.shields.io/badge/license-Apache--2.0-f1b66e)](LICENSE)
[![Live](https://img.shields.io/badge/live-gaptheo.fasl--work.com-d98cff)](https://gaptheo.fasl-work.com/)

GapTheo is a public, research-grade visual atlas of the three-gap theorem. It connects exact finite circle rotations to gap genealogy, Farey cells, continued fractions, return times, cyclic words, lattice geometry, interval exchange, star discrepancy, finite topology, and controlled contrasts.

## Product surface

- Twelve canonical, deep-linkable scenarios across theorem, boundary, and contrast regimes.
- Eleven synchronized mathematical readings driven by one live certificate.
- Exact six-route CAOS shell: App, Introduction, Methodology, Implementation, Experiments, and Benchmark.
- English and Spanish UI, light and dark themes, responsive interaction, and five hand-authored architecture diagrams.
- A twelve-cell benchmark generated from versioned, checksummed artifacts.

For an irrational rotation, the points `{n alpha}` on the unit circle have at most three consecutive gap lengths. When three occur, the largest is the sum of the other two. Rational inputs and alternative allocators remain visible as explicit boundary or contrast experiments. The app never infers irrationality from a decimal and does not present numerical evidence as a formal proof.

## Run locally

Requirements: Node 22 or later, npm 10 or later, and Python 3.11 or later.

```text
npm install --prefix frontend
npm run generate
npm run ci
npm run dev
```

`npm run generate` is the intentional canonical bake. CI smoke tests instead write into a temporary directory, and deployment only validates committed scientific evidence before building the static site.

## Research and documentation

- [Documentation hub](docs/README.md)
- [Architecture](docs/architecture/architecture.md)
- [Framework map](docs/frameworks/frameworks.md)
- [Experiment guides](docs/guides/guides.md)
- [Problem types](docs/problem-types/problem-types.md)
- [Canonical use cases](docs/use-cases/use-cases.md)
- [Data contracts](docs/data-contract/data-contract.md)
- [State-of-the-art review](docs/research/deep-review.md)
- [Manuscript source](manuscripts/gaptheo/tex/main.tex)

The browser workbench is entirely client-side. It requires no account, API, database, private credential, or runtime mathematical service.

## License

Apache-2.0. Linked mathematical publications remain the property of their authors and publishers.
