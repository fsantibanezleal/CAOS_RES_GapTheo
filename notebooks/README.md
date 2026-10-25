# Research notebooks

The English and Spanish notebooks provide five matched lessons using the canonical GapTheo engine. They cover cyclic ordering, insertion, arithmetic approximants, theorem-boundary controls, and literature scope. The notebooks preserve executed outputs and cite only sources listed in the software design document.

- [English index](en/README.md)
- [Índice en español](es/README.md)
- [Notebook requirements](requirements.txt)

Run the static notebook gate with `python scripts/check_notebooks.py`. Execute in the pinned local notebook environment with `python scripts/run_notebooks.py`; use `CAOS_TEMP_ROOT` for the read-only execution check. Product calculations are imported from `data-pipeline/pipeline/gaptheo/model.py` rather than copied into notebooks.
