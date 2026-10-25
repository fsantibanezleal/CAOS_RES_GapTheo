#!/usr/bin/env bash
# Regenerate the canonical GapTheo certificate matrix in .venv-pipeline.
set -euo pipefail
cd "$(dirname "$0")/.."
VP=".venv-pipeline/bin/python"; [ -x "$VP" ] || VP=".venv-pipeline/Scripts/python.exe"
"$VP" data-pipeline/run.py "$@"
