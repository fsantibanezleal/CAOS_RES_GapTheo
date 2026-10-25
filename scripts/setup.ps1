param([switch]$Notebooks)
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
$python = if ($env:PYTHON) { $env:PYTHON } else { "python" }

if ($Notebooks) {
  if (-not (Test-Path ".venv-notebooks")) { & $python -m venv .venv-notebooks }
  $venvPython = Join-Path ".venv-notebooks" "Scripts\python.exe"
  if (-not (Test-Path $venvPython)) { $venvPython = Join-Path ".venv-notebooks" "bin/python" }
  & $venvPython -m pip install -r notebooks/requirements.txt
  Write-Host "Notebook environment ready. Run: python scripts/run_notebooks.py --check"
  exit 0
}

if (-not (Test-Path ".venv")) { & $python -m venv .venv }
$venvPython = Join-Path ".venv" "Scripts\python.exe"
if (-not (Test-Path $venvPython)) { $venvPython = Join-Path ".venv" "bin/python" }
& $venvPython -m pip install -r requirements-precompute.txt -r requirements-dev.txt
npm --prefix frontend ci
Write-Host "GapTheo environments ready. Run: npm run dev"
