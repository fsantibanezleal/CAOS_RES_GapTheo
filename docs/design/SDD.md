# GapTheo software design document

Status: implementation complete; owner review pending

GapTheo is a bilingual research instrument for finite orbits of circle rotations. Its core object is the ordered partition induced by `{nα + φ} mod 1`; it places the direct geometric computation beside arithmetic and dynamical descriptions, and makes theorem hypotheses explicit in every result. It is an exploratory and reproducibility tool, not a proof assistant and not a claim of new theorem-level results.

## Problem and non-goals

For an irrational rotation number α, the first N orbit points partition the unit circle into at most three distinct arc lengths (with the two-gap cases included). The application must make point-count and indexing conventions visible, distinguish the raw finite computation from the theorem’s irrationality hypothesis, and permit readers to compare rotation orbits with processes that do not satisfy that hypothesis.

The primary user action is to vary α, N, phase φ, and the point-allocation rule, then inspect one synchronized certificate through circle, sorted interval, gap multiplicity, Farey/continued-fraction, return-time, cyclic-word, and threshold-topology views. All views derive from one input state. Rational inputs and seeded non-rotation allocations are counter-regimes; their outcomes must never be labelled as theorem confirmations or counterexamples.

Non-goals: proving irrationality from a decimal; presenting finite computation as proof of the infinite theorem; claiming every result of the cited word-combinatorics or higher-dimensional literature is implemented; general persistent homology beyond the documented H₀ filtration; and asserting novelty of the theorem. Research scope and claim boundaries are detailed in `docs/research/deep-review.md`.

## Executive brief

The Introduction opens with the executive view authored for this research problem, then provides a technical introduction. The brief frames the gap between the geometric partition and its arithmetic descriptions, identifies the convention and hypothesis risks, and links each cited claim to a source. It does not substitute promotional copy for mathematical explanation.

Data file: content/executive.json

## Research basis

The product’s mathematical and visual choices are grounded in the persisted review at `docs/research/deep-review.md`, with its detailed boundary and reproducibility contracts in `docs/research/mathematical-contract.md` and `docs/research/reproducibility.md`.

| Design decision | Evidence and scope | Primary source |
|---|---|---|
| Use the finite orbit `{nα}` and sort modulo one before computing cyclic gaps | Hamada develops a geometric finite-orbit account and explicit gap descriptions; indexing remains an implementation-level convention that the app states. | [Hamada, A concise geometric proof of the three distance theorem](https://arxiv.org/abs/2308.11999) |
| Include continued fractions and Farey neighbors as an arithmetic certificate | The three possible lengths and multiplicities are tied to convergents and neighboring rational approximants; the app cross-checks these against direct sorting. | [Alessandri and Berthé, Three distance theorems and combinatorics on words](https://www.irif.fr/~berthe/Articles/3d.pdf) |
| Treat gap sequences as finite words with their own combinatorics | The HAL work develops three-distance results through arithmetic and words; GapTheo presents inspectable sequences and avoids claiming a complete formal classification. | [HAL record hal-04769002](https://hal.science/hal-04769002/document) |
| Keep irrational rotation, rational periodicity, and arbitrary allocations distinct | The theorem’s hypothesis is irrationality; a finite decimal cannot establish it. Rational and seeded allocation controls are contrasts. | [Three-gap theorem overview](https://en.wikipedia.org/wiki/Three-gap_theorem) |
| Use return-time, lattice, interval-exchange, and H₀ views as related interpretations | These are related mathematical constructions with distinct assumptions and are labelled as explanatory or exploratory where the cited work does not establish a direct equivalence for the selected finite configuration. | [Marklof and Strömbergsson](https://arxiv.org/abs/1304.3363); [Taha](https://arxiv.org/abs/1503.02272); [Suárez-Salas and Perea](https://arxiv.org/abs/2306.08826) |
| Verify claims by independent calculations and adversarial regimes | A direct sort is compared with the Farey/continued-fraction prediction; rational, duplicate, endpoint, near-boundary, and allocation controls test the interpretation boundary. | [Coq formalization](https://www.irif.fr/~mayero/three-gap/) |

UNVERIFIED: the review records bibliographic and scope claims from the named sources, but does not claim a line-by-line formal verification of every proposition in those works. The lattice and topology views are explanatory implementations, not proof certificates.

## Sizing and contracts

The primary input contract is a finite, serializable scenario: normalized rotation number, mode (`irrational`, `rational`, or `numeric`), point count N, phase, allocation (`rotation`, seeded random, farthest-point, or anchored), seed, and optional second frequency for an explicitly labelled extension. Validation rejects non-finite values, invalid denominators, out-of-range counts, and incompatible mode/allocation combinations with a visible reason.

The computational certificate records input provenance, generated orbit points, sorted cyclic order, every ungrouped gap including wraparound, tolerance-grouped lengths and multiplicities, closure residual, theorem applicability, and derived views. The UI must not infer theorem status from a floating-point result. The direct geometric count is authoritative for the finite numeric sample; Farey/continued-fraction output is an independent prediction where its hypotheses and indexing conventions apply.

The compact, deterministic scenario and certificate contracts are `contracts/scenario.schema.json` and `contracts/certificate.schema.json`. The offline generator writes reproducible artifacts under `data/artifacts/`; the app’s scenario catalog and benchmark summary are generated from the same source scenarios. A schema or producer change updates the validator and its fixtures in the same change.

## Technology and versions

The browser application is TypeScript, React, Vite, and the pinned `@fasl-work/caos-app-shell` 0.19.2. The shell owns navigation, typography, tokens, tabs, accessibility primitives, and layout. Product styles are restricted to research-specific instrument geometry and visualization layout; they do not redefine shell colors, typography, page width, or component appearance. KaTeX renders equations. The deterministic offline certificate lane is Python; JSON schemas and committed artifacts form the reproducibility boundary. Exact package versions are recorded below and in `frontend/package-lock.json`.

| component | package | version | use | alternative considered |
|---|---|---|---|---|
| Browser shell | `@fasl-work/caos-app-shell` | 0.19.2 | shared navigation, tokens, route tabs and accessibility | product-owned shell, rejected by ADR |
| Browser UI | `react` | 19.3.0 | stateful interactive workbench | hand-written DOM |
| Browser renderer | `react-dom` | 19.3.0 | accessible component rendering | canvas-only UI |
| Routing | `react-router` | 8.4.0 | six static routes and direct links | one long page |
| Build | `vite` | 8.3.5 | lazy route bundles, separate React/KaTeX vendors, each JavaScript chunk at most 500 KiB, and route materialization | server runtime |
| React integration | `@vitejs/plugin-react` | 6.1.1 | JSX transform in Vite | not applicable |
| Type declarations | `@types/node` | 24.19.1 | build-script types | not applicable |
| Type declarations | `@types/react` | 19.3.0 | component types | not applicable |
| Type declarations | `@types/react-dom` | 19.3.0 | renderer types | not applicable |
| Types | `typescript` | 5.9.3 | checked UI and numerical interfaces | untyped JavaScript |
| Equations | `katex` | 0.19.1 | rendered mathematical notation | raster equation images |
| Charts | `uplot` | 1.6.32 | numeric plots | custom plot primitives |
| Icons | `lucide-react` | 1.52.0 | consistent interaction icons | hand-coded glyphs |
| State | `zustand` | 5.0.15 | workbench state management | duplicated panel state |
| Browser automation | `playwright` | 1.63.0 | measured browser gates | not applicable |
| Test runner | `vitest` | 5.0.3 | frontend behavior checks | not applicable |
| Python validation | `jsonschema` | 4.26.0 | scenario and certificate schema validation | unchecked ad hoc parsing |
| Python tests | `pytest` | 9.1.1 | local reference-engine tests | not applicable |
| Python lint | `ruff` | 0.15.18 | Python source checks | not applicable |
| Notebook kernel | `ipykernel` | 7.4.0 | execute bilingual research notebooks | not applicable |
| Notebook plots | `matplotlib` | 3.11.2 | notebook figures | not applicable |
| Notebook execution | `nbclient` | 0.11.0 | clean notebook replays | not applicable |
| Notebook format | `nbformat` | 5.11.1 | validate notebook structure | not applicable |
| Notebook arrays | `numpy` | 2.4.6 | numerical examples | not applicable |

The app is statically deployed on GitHub Pages at `https://gaptheo.fasl-work.com`. Client-side routes must work through the Pages fallback, and the custom domain is preserved by the deployment workflow. No server is required to inspect the committed research content.

## Resources

| stage | memory | disk | time | where it runs |
|---|---|---|---|---|
| bake | proportional to scenario count and N; orbit sorting is O(N log N) | compact JSON certificates and checksums | bounded by the largest declared scenario | local pinned Python environment |
| tests | one scenario/certificate and browser test workers | temporary directories outside canonical data | seconds to minutes, machine dependent | local and CI |
| build | Vite/TypeScript worker set | generated static bundle and route snapshots | seconds to minutes, machine dependent | CI |
| deploy | static artifact only | GitHub Pages artifact | workflow dependent | GitHub Actions |

## Lanes

| Lane | Responsibility | Evidence and boundary |
|---|---|---|
| Direct finite computation | Generate and sort the selected finite point set; compute cyclic gaps, multiplicities, and closure | `frontend/src/core/gapEngine.ts`; deterministic unit and parity tests |
| Arithmetic cross-check | Predict admissible gap lengths/counts from rational approximants when applicable | Certificate fields are compared with direct computation; boundary cases stay explicit |
| Offline research bake | Produce canonical cases, benchmark summaries, and manifests | `python data-pipeline/run.py`; output is reproducible and validated before commit |
| Browser exploration | Recompute the selected scenario and update linked geometric/derived views | `/app`; controls change the common scenario state and outputs |
| Static replay | Serve committed certificates and reference material | GitHub Pages; no request-time mutation of research artifacts |

## Method ladder

| Method or view | Role | Status and limitation |
|---|---|---|
| Sorted orbit and cyclic gaps | Exact finite numeric baseline | Implemented; floating-point inputs do not prove irrationality |
| Gap multiplicity grouping | Count distinct observed lengths under a documented tolerance | Implemented; raw lengths remain available to inspect tolerance effects |
| Farey-neighbor prediction | Arithmetic cross-check for irrational rotation cases | Implemented with explicit finite convention; compared to direct gaps |
| Continued-fraction convergents | Explain approximation scales and transition regimes | Implemented as a finite numerical expansion |
| Return-time gaps | Dual finite inspection for a target interval | Related dynamical view; parameterized target and finite boundary are explicit |
| Farthest-point allocation | Deterministic contrast that maximizes distance from existing sites | Not a rotation orbit; never tested as a theorem case |
| Seeded random allocation | Reproducible negative control | Not a rotation orbit; randomness is seeded and outcome is labelled synthetic |
| Anchored allocation | Place points near selected geometric anchors | Contrast only; allocation provenance is visible |
| Cyclic gap word | Inspect adjacency and symbol sequence of grouped gap classes | Exploratory symmetry observations are not a complete classification |
| H₀ threshold filtration | Show component merges as threshold crosses observed gaps | Finite one-dimensional construction; no claim of higher homology |
| Lattice and interval-exchange interpretations | Provide geometric context for related formulations | Explanatory views; they do not replace the direct certificate |
| Two-frequency extension | Contrast higher-dimensional distance behavior | Extension panel only; the one-dimensional theorem is not generalized |

No learned model is relevant to this theorem demonstration: the outputs are exactly computable from the finite input and adding an ML method would obscure rather than improve the mathematical contract.

## Cases

The canonical set includes golden-ratio and silver-ratio rotations, square-root and π-derived numeric rotations, rational periodic boundaries, low-N and phase-shifted cases, near-rational regimes, and seeded-random/farthest-point controls. Each case states its input formula, N, phase, allocation, seed where applicable, theorem applicability, and expected qualitative relation. Synthetic allocation cases are explicitly marked. The complete machine-readable source is `data/input/canonical-scenarios.json` and generated artifacts are named by `data/manifests/index.json`.

## Oracles

The direct oracle independently forms `{nα+φ}` modulo one, sorts with stable index tie-breaking, includes the wrap gap, checks non-negativity and total length one, and groups lengths only after preserving raw values. The arithmetic oracle computes convergents/Farey neighbors and predicts candidate lengths and multiplicities for eligible irrational-rotation configurations. Their comparison is a cross-check, not two copies of one routine.

Adversarial checks include N=1 and small N, zero phase, exact rational inputs with denominator dividing N, duplicate points, points numerically adjacent to the wrap, near-rational α, tolerance perturbations, seeded replay, and non-rotation allocation. The theorem label follows the declared scenario mode and documented hypothesis; the code never derives irrationality from a decimal.

## Beyond the state of the art

The cited literature already contains geometric, continued-fraction, word-theoretic, dynamical, formal, and interactive treatments. GapTheo’s defensible contribution is an integrated, inspectable finite research atlas: synchronized views share one explicit scenario; direct and arithmetic certificates are compared; contrast allocators expose hypothesis boundaries; and the app provides reproducible, bilingual, source-linked exploration. This is an implementation and pedagogy contribution, not a new theorem or a claim to supersede the cited mathematics.

None claimed. The integrated finite atlas, bilingual explanations, and synchronized views are product and pedagogy work; they are not claimed as a new theorem, classification, or validated learning outcome.

## Deploy driver

GitHub Actions builds the static frontend, validates contracts and committed artifacts, materializes the supported route entry points, preserves `frontend/public/CNAME`, and publishes the generated site to GitHub Pages. The deployed host is `gaptheo.fasl-work.com`. Deployment is accepted only after workflow success, a valid HTTPS response, root and direct nested-route loads, and browser inspection of the active visualization and theme/language controls. A local build is not deployment evidence.

## Risks and kill criteria

| Risk | Detection | Response |
|---|---|---|
| Convention mismatch (`N` points vs `N+1`, start index, or omitted wrap) | Compare raw sorted points, gap count, and closure residual against independent hand-calculated small cases | Stop release; correct the contract and every view together |
| Decimal input presented as certified irrational | Inspect theorem-status label and scenario metadata for numeric modes | Mark status unverified/applicability not certified; never infer irrationality |
| Floating-point tolerance merges distinct lengths | Perturb near-rational inputs and compare raw/grouped tables | Expose tolerance and raw lengths; report sensitivity |
| Contrast allocator presented as theorem evidence | Inspect labels and app state transitions for each allocator | Keep it in negative-control status; block misleading labels |
| Visual panels drift from selected scenario | Change α, N, phase, seed, and allocator in browser and compare linked views | Treat any stale panel as a defect |
| Static nested route fails on Pages | Open and refresh every nested route on the deployed host | Fix workflow fallback before release |
| A secondary literature view overstates cited results | Review the relevant persisted source notes and claim-level citations | Narrow or remove the claim; state unverified scope |

## ADR fit

| Decision area | Product fit |
|---|---|
| ADR-0017 frontend bar | Six shell routes, bilingual content, inline citations, domain-specific interactive App, and research depth; every page and view still requires measured gate and screenshot evidence |
| ADR-0070 | Focus applies to this interactive mathematical workbench; every App route and view retains the shell's Focus control and gate coverage |
| ADR-0057 product template | Template v0.11.002 and shell 0.19.2 provide the common product baseline; all template example content must be replaced by GapTheo content |
| ADR-0071 viewport and navigation | Shell owns page width and navigation; the workbench uses grouped, bounded views and responsive controls |
| ADR-0075 design document | This SDD states the GapTheo problem, research basis, cases, methods, risks, and deploy boundary before declaring the implementation complete |
| ADR-0078 template adoption | `.template-version` records the exact adopted template version; template residue is a failing gate, never an allowlist |
| ADR-0080 contract-first design | Scenario and certificate schemas, producers, consumers, fixtures, and validators change together |

| Requirement | Adversarial check | Gate |
|---|---|---|
| Rotational cases have a cyclic partition summing to one | rational, duplicate, and wrap-boundary inputs | `frontend/src/core/gapEngine.test.ts` |
| Non-rotation allocations are never certified theorem cases | seeded replay and allocator-switch checks | `frontend/src/core/gapEngine.test.ts` |
| Every browser view follows the selected scenario | vary each exposed control and compare result signatures | `frontend/src/App.test.tsx` |
| Baked cases conform to their declared certificate | independently validate generated files and checksums | `scripts/check_artifacts.py` |
| Deployment routes and public domain are correct | direct-load and refresh nested paths over HTTPS | `scripts/check_live.py` |
