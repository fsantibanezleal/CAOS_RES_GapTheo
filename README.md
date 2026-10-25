# GapTheo

[![CI](https://img.shields.io/github/actions/workflow/status/fsantibanezleal/CAOS_RES_GapTheo/ci.yml?branch=main&label=CI)](https://github.com/fsantibanezleal/CAOS_RES_GapTheo/actions)
[![License](https://img.shields.io/github/license/fsantibanezleal/CAOS_RES_GapTheo)](LICENSE)
[![Live](https://img.shields.io/badge/site-gaptheo.fasl--work.com-0969da)](https://gaptheo.fasl-work.com)

A bilingual research instrument for finite orbits of circle rotations and the three-gap theorem. Explore the sorted cyclic partition, arithmetic approximants, return times, symbolic order, and finite topology from one selected scenario. Rational and non-rotation processes are marked as boundary cases or controls.

## Areas

| Area | Folder | Status | What it holds |
|---|---|---|---|
| Web | [`frontend/`](frontend/) | active | Interactive workbench and six research routes. |
| API | [`app/`](app/) | dormant: GitHub Pages serves a static client and needs no API server | No request-time computation or service is required. |
| Core pipelines | [`data-pipeline/`](data-pipeline/) | active | Deterministic scenario processing and certificate generation. |
| Packages | [pytest](https://pypi.org/project/pytest/), [ruff](https://pypi.org/project/ruff/), [jsonschema](https://pypi.org/project/jsonschema/), [numpy](https://pypi.org/project/numpy/), [matplotlib](https://pypi.org/project/matplotlib/), [nbclient](https://pypi.org/project/nbclient/), [nbformat](https://pypi.org/project/nbformat/), [ipykernel](https://pypi.org/project/ipykernel/) | active | Python validation, tests, and notebook runtime dependencies. |
| Notebooks | [`notebooks/`](notebooks/) | active | Ten executed lessons mirrored in English and Spanish. |
| Data | [`data/`](data/) | active | Canonical scenarios, certificates, benchmark, and manifests. |
| Contracts | [`contracts/`](contracts/) | active | JSON Schemas for scenarios and computation certificates. |
| Documentation | [`docs/`](docs/) | active | Mathematical review, design, case notes, methods, and deployment. |
| Tests and gates | [`tests/`](tests/), [`scripts/`](scripts/) | active | Python oracle checks, frontend unit tests, and release gates. |
| Deploy | [`deploy/`](deploy/) | active: GitHub Pages | Deployment target, workflow, and public domain instructions. |

## Run locally

```powershell
python data-pipeline/run.py
python scripts/validate_artifacts.py
python -m pytest tests/test_reference.py -q
cd frontend
npm ci
npm run typecheck
npm test
npm run build
npm run gate
```

## Research and implementation

- [Software design and requirements](docs/design/SDD.md)
- [Deep literature review](docs/research/deep-review.md)
- [Mathematical contract](docs/research/mathematical-contract.md)
- [Reproducibility record](docs/research/reproducibility.md)
- [Research note manuscript](manuscripts/gaptheo/tex/main.tex)

The static site is deployed at [gaptheo.fasl-work.com](https://gaptheo.fasl-work.com). A finite numerical result demonstrates a case and checks implementation invariants; it does not prove irrationality or establish the infinite theorem.
