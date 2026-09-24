# Changelog

## 0.03.001 - 2026-09-24

### Changed

- Removed the application-owned teal/green theme, decorative gradients, custom
  font stack, and local imitations of CAOS shell components.
- Returned palette, typography, themes, cards, buttons, tabs, page structure,
  and callouts to the shared CAOS app shell; scientific gap marks now use the
  approved blue, magenta, and amber semantic tokens.
- Enlarged the primary orbit instrument so the visualization owns a majority
  of the workbench width at desktop sizes.

### Fixed

- Eliminated the green brand wash and non-ADR visual language from every route.
- Added a fail-closed frontend guard that rejects root/theme ownership, literal
  CSS colours, decorative gradients, non-shell fonts, legacy palette tokens,
  and application overrides of shell primitives.
- Normalized generated artifact colours to the approved CAOS data palette.

## 0.03.000 - 2026-09-23

### Added

- A purpose-built scientific SVG system covering orbit closure, gap splitting,
  Farey cells, continued fractions, return gaps, symbolic readings, lattices,
  topology, evidence contracts, experiments, and benchmark provenance.
- Five Introduction tabs and six-tab Implementation and Benchmark atlases using
  the shared CAOS shell controls.
- A frontend ADR guard for tab contracts, accessible figures, language-scoped
  architecture labels, and theme-safe color usage.

### Changed

- Rebuilt the workbench as a compact research instrument with five linked views
  and shared-shell subtabs for all extension readings.
- Deepened every methodology chapter to four explanatory paragraphs, two
  equations, a dedicated figure, validity boundaries, and scoped sources.
- Expanded every documentation tab with artifact-backed scientific content and
  bilingual explanations.

### Fixed

- Removed the undefined legacy SVG classes that rendered opaque black figures.
- Restored visible shared-shell tabs on every documentation route.
- Replaced hard-coded SVG paint values with semantic theme tokens.
- Normalized GitHub Pages trailing-slash routes before research-page dispatch.

## 0.02.002 - 2026-09-19

### Fixed

- Constrained documentation routes and benchmark cards to the phone viewport at 680px and below.

## 0.02.001 - 2026-09-19

### Fixed

- Separated benchmark scenario, category, and count fields in compact and light-theme cards.

## 0.02.000 - 2026-09-19

### Added

- Twelve-case canonical scenario matrix with generated benchmark evidence.
- Deep Introduction, Methodology, Implementation, Experiments, and Benchmark routes.
- Five themed architecture diagrams, discrepancy view, and finite-size event sweep.
- Staged Python reference pipeline, product guards, and a hierarchical documentation wiki.

### Changed

- Upgraded the GitHub Actions and Vite/Vitest toolchains.
- Moved release evidence generation out of deployment and into an intentional bake step.
- Adopted Apache-2.0 and synchronized runtime version display with `VERSION`.

### Fixed

- Restored the exact six-route public information architecture.
- Removed development dependency vulnerabilities and expanded cross-method validation.

## 0.01.000 - 2026-09-13

- Initial public research workbench.
- Added direct, incremental, Farey, continued-fraction, dual, topology, word,
  lattice, interval-exchange, allocator, and two-frequency lenses.
- Added deterministic Python reference certificates and manuscript source.
