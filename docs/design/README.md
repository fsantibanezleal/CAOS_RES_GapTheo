# Design and requirements

The normative product specification is [`SDD.md`](SDD.md). It defines the mathematical object, source scope, hypotheses, certificate boundaries, toolchain, release risks, and applicable CAOS architecture decisions.

Product requirements and adversarial checks are maintained alongside each feature:

- [`features/workbench/`](features/workbench/): controls, linked finite views, and route behavior.
- [`features/contracts/`](features/contracts/): scenario and certificate schemas, producer invariants, and theorem-status controls.
- [`features/notebooks/`](features/notebooks/): bilingual, executed research notebooks and their static gates.
- [`features/web/`](features/web/): the shell-owned navigation, executive view, and scientific content routes.

The JSON Schemas live in the repository-root [`contracts/`](../../contracts/) folder. `scripts/check_sdd.py` verifies requirements against real gates; `scripts/check_doc_paths.py` checks repository links.
