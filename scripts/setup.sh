#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
PYTHON="${PYTHON:-python}"
if [[ "${1:-}" == "--notebooks" ]]; then
  [[ $# -eq 1 ]] || { echo "usage: scripts/setup.sh [--notebooks]" >&2; exit 2; }
  [[ -d .venv-notebooks ]] || "$PYTHON" -m venv .venv-notebooks
  VP=.venv-notebooks/bin/python; [[ -x "$VP" ]] || VP=.venv-notebooks/Scripts/python.exe
  "$VP" -m pip install -r notebooks/requirements.txt
  echo "Notebook environment ready. Run: python scripts/run_notebooks.py --check"
  exit 0
fi
[[ $# -eq 0 ]] || { echo "usage: scripts/setup.sh [--notebooks]" >&2; exit 2; }
[[ -d .venv ]] || "$PYTHON" -m venv .venv
VP=.venv/bin/python; [[ -x "$VP" ]] || VP=.venv/Scripts/python.exe
"$VP" -m pip install -r requirements-precompute.txt -r requirements-dev.txt
npm --prefix frontend ci
echo "GapTheo environments ready. Run: npm run dev"
