# Research notebooks

The matched English and Spanish notebooks explain the finite orbit convention, insertion mechanism, arithmetic
approximants, rational boundaries, and literature scope. They import the canonical GapTheo engine; no notebook
reimplements a method.

Run `python scripts/check_notebooks.py` for the static layout and content gate. To execute all ten notebooks in fresh
kernels, use `python scripts/run_notebooks.py`. Check mode requires an external temporary root, for example:

```powershell
$env:CAOS_TEMP_ROOT = Join-Path $env:TEMP 'GapTheo-notebooks'
python scripts/run_notebooks.py --check
```
