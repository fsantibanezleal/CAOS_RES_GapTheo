# Requirements: the GapTheo workbench

EARS requirements for the synchronized finite-rotation workbench. The shell owns navigation, theme, typography, tokens, and page layout; GapTheo supplies the mathematical controls and views.

| ID | Requirement | Gate |
|---|---|---|
| WKB-001 | THE workbench SHALL expose the rotation step, point count, phase, target interval, allocation method, and seed where applicable. | `frontend/src/core/gapEngine.test.ts` |
| WKB-002 | THE circular partition SHALL preserve cyclic order, include the wrap interval, close to one turn, and obey the three-gap bound for declared irrational rotations. | `frontend/src/core/gapEngine.test.ts::adversarial: the irrational cyclic partition stays within three lengths and closes` |
| WKB-003 | THE workbench SHALL keep rational boundaries and non-rotation allocation controls outside the irrational theorem claim. | `frontend/src/core/gapEngine.test.ts::adversarial: rational residue collisions remain theorem boundaries` |
| WKB-004 | WHEN the rotation step changes, THE certificate SHALL change and all derived readings SHALL be recomputed from that selected scenario. | `tests/test_reference.py::test_adversarial_changing_rotation_step_changes_the_certificate` |
| WKB-005 | THE shell navigation SHALL remain visible on every documentation route and preserve the six-route order. | `frontend/src/App.test.tsx::adversarial: the Introduction-first order of shell 0.13.0 is refused, the landing does not move the tabs` |
| WKB-006 | THE built site SHALL materialize every supported deep route for direct load and refresh on GitHub Pages. | `frontend/scripts/materialize-routes.mjs` |
| WKB-007 | THE Introduction SHALL open on the sourced executive view and provide the technical chapters as its second outer view. | `frontend/src/App.test.tsx::the Introduction opens on the sourced overview and provides the technical chapters second` |
