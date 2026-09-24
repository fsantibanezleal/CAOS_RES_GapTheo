# GapTheo ADR compliance rebuild specification

Date: 2026-09-24

Status: corrected in v0.03.001; production verification required

## Failure statement

The v0.02.002 public surface is not an acceptable implementation of the
approved product. The defect is structural rather than cosmetic:

- Introduction has no top-level tab architecture and the remaining research
  routes do not consistently expose their complete section structure above the
  fold.
- Teaching SVGs rely on undefined application classes. Browser SVG defaults
  therefore render large black fills and black labels, including the orbit
  figure on the live Introduction page.
- The teaching figures are sparse primitives rather than information-dense
  mathematical diagrams.
- Several research tabs contain only one or two short paragraphs, one equation,
  and a generic figure. They do not meet the documented deep-section recipe.
- The release checks count routes and strings but do not prove that every
  route has tabs, every figure has semantic theme styling, or every tab can be
  reached and read in both themes.
- Prior closure relied on HTTP, build, and partial rendered evidence despite
  these visible failures.

The v0.02.002 completion claim is withdrawn. This rebuild starts from current
remote `main` and preserves the ADR-0074 CI-budget correction already merged.

## Shell visual-ownership correction

The first rebuild still introduced a product-local teal/green visual system.
That was an implementation defect: ADR-0012 and ADR-0016 assign global palette,
typography, page surfaces, cards, buttons, tabs, and theme switching to the
shared CAOS app shell. GapTheo must not restyle those primitives.

From v0.03.001, the application stylesheet is limited to workbench layout and
scientific marks. It may consume only shell tokens. The theorem's three gap
classes use accent blue, magenta, and warning amber; success green is reserved
for certified/valid state. The stylesheet must not define root or theme tokens,
literal colours, decorative gradients, a font family outside the shell stack,
or selectors that replace shell-owned page and component styling. A static
guard enforces this boundary before tests and builds can pass.

## Required public architecture

Every research route uses the shared shell `Tabs` as its first substantial
element after the page heading. No route presents one long undifferentiated
article.

| Route | Top-level questions | Required nested structure |
| --- | --- | --- |
| Introduction | Problem; mechanism; linked readings; notation; scope | worked finite example and glossary |
| Methodology | direct geometry; Farey/genealogy; continued fractions; returns; symbolic dynamics; lattice/topology | per-family assumptions and derivation |
| Implementation | system; engines; contracts; evidence; performance; deployment | vertical engine and contract sub-tabs |
| Experiments | protocol; regime sweep; finite-size events; boundaries; contrasts; reproducibility | scenario/case matrix and adversarial controls |
| Benchmark | coverage; exact agreement; invariants; conditioning; contrasts; provenance | case-level evidence, not typed claims |

At most six sibling tabs appear in one rail. Deeper material uses `SubTabs`.
Every visible tab label is bilingual and every tab is reachable by pointer and
keyboard interaction.

## Teaching-figure contract

All research-page figures are inline React SVG so they inherit active theme
tokens and language state. Every shape declares its fill and stroke through a
semantic class. Browser-default fills are forbidden.

The shared vocabulary is:

- frame and plot surfaces;
- primary, secondary, theorem-valid, boundary, and contrast marks;
- axes, grids, arrows, annotations, legends, and mathematical labels;
- explicit `fill: none` for rings, paths, polylines, and lines;
- foreground token fills for all text.

Each diagram must explain a mathematical relationship that prose alone does
not show efficiently. A valid figure has a title, coordinate or process
context, semantic legend, labeled quantities, and a bilingual caption. Sparse
boxes or decorative circles are rejected.

The five architecture-modal SVGs are separately re-audited for token-only
colour, bilingual text nodes, real modules/contracts, labeled flows, and
legibility in both themes.

## Content contract

Each research tab contains:

1. a precise question and claim boundary;
2. multiple substantial bilingual paragraphs grounded in the persisted source
   dossier;
3. at least one captioned equation, with all symbols defined locally;
4. an assumptions or validity-boundary callout;
5. one purpose-built mathematical SVG;
6. section-scoped linked references.

The pages distinguish theorem, exact finite computation, numerical tolerance,
explanatory interpretation, and process contrast. No decimal input is called
irrational by computation, and no visual genealogy or topology reading is
presented as a new proof.

## Verification gates

The release is blocked until all gates pass:

1. Static content guard: all five research routes instantiate shared `Tabs`;
   no legacy `MethodFigure`; no undefined `diagram-*` classes; every scientific
   SVG uses semantic classes and an accessible label.
2. Unit tests: route headings, bilingual tab labels, tab switching, figures,
   equations, callouts, and per-tab references.
3. Browser matrix: every top-level tab on every route is clicked in English
   and Spanish, light and dark, desktop and 390 px phone width.
4. Visual gate: no computed SVG fill or text fill resolves to opaque black in
   either theme; screenshots are manually inspected, not merely generated.
5. Fit gate: no horizontal document overflow; the workbench remains a
   viewport-owned surface; documentation scroll belongs to its content area.
6. Production gate: task branch to develop to main; release/version update;
   CI and Pages succeed on the same main SHA; custom-domain routes are clicked
   and inspected after deployment.

## Acceptance

The rebuild is accepted only after the user can open any subpage and see its
tab architecture immediately, every diagram is legible and information-dense
in both themes, and the automated gates fail on a reintroduction of the black
SVG/default-fill defect.
