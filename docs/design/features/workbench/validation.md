# Adversarial validation: the GapTheo workbench

Each row describes a condition that can expose a false product claim. Browser and shell rendering gates are run as local release checks.

| requirement | adversarial check | gate |
|---|---|---|
| WKB-001 | choose both endpoints of the exposed angle and point-count controls and compare the resulting certificate inputs | `frontend/src/core/gapEngine.test.ts::adversarial: the irrational cyclic partition stays within three lengths and closes` |
| WKB-002 | remove the wrap interval or perturb a gap length; the cyclic closure or three-gap invariant must fail | `frontend/src/core/gapEngine.test.ts::adversarial: the irrational cyclic partition stays within three lengths and closes` |
| WKB-003 | choose a rational step with repeated points, then choose synthetic allocators; neither result may be certified | `frontend/src/core/gapEngine.test.ts::adversarial: rational residue collisions remain theorem boundaries` |
| WKB-004 | change alpha while keeping the other inputs fixed; the deterministic certificate hash must change | `tests/test_reference.py::test_adversarial_changing_rotation_step_changes_the_certificate` |
| WKB-005 | move Introduction before App in the shared route list; the adversarial route test must reject the changed order | `frontend/src/App.test.tsx::adversarial: the Introduction-first order of shell 0.13.0 is refused, the landing does not move the tabs` |
| WKB-006 | omit a built nested route or the fallback page; route materialization must fail before deployment (local-only: requires Node to build and materialize the site) | `tests/adversarial/test_requirements_refuted.py::test_a_build_without_the_routes_or_the_theme_script_fails` |
| WKB-007 | remove the sourced ExecutiveView or place the technical outer view first; the route test must reject the changed order | `frontend/src/App.test.tsx::adversarial: the Introduction-first order of shell 0.13.0 is refused, the landing does not move the tabs` |
