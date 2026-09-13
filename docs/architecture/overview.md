# Architecture

## Product shape

GapTheo is a static React and TypeScript workbench published through GitHub
Pages. The root surface is a viewport-contained interactive instrument. The
same certificate feeds the circle view, gap inventory, genealogy, Farey atlas,
dual return-time view, topology panel, and extension lenses.

## Three lanes

1. Reference lane: Python generates deterministic certificates and replay
   artifacts from canonical scenarios.
2. Live lane: TypeScript recomputes bounded scenarios in the browser as
   controls change.
3. Replay lane: JSON artifacts are checked into the frontend so the research
   narrative remains stable and inspectable.

There is no account, API, database, server runtime, model, or secret. The
analytic pipeline uses the template train slot as an explicit not-applicable
stage. No learned weights or opaque inference are present.

## Shell

The app uses the shared CAOS shell version 0.6.8 for the common header, footer,
language and theme controls, architecture modal, citation primitives, KaTeX
equations, and animation lifecycle. Product-specific controls and
visualizations remain in the product repository.

## State flow

Scenario controls -> normalized Scenario -> direct orbit oracle -> grouped
gaps -> derived certificates -> synchronized visual panels.

The direct oracle is authoritative. Derived methods expose their own inputs,
formula, and residual checks. An allocator contrast can never silently become
an arithmetic rotation.

## Rendering boundary

Canvas and SVG are used for exact 2D geometry, with a compact SVG lattice view.
The workbench remains usable at phone scale, uses internal scrolling rather
than document overflow, and provides a visible pause control for animation.
