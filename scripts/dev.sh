#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
[[ -d frontend/node_modules ]] || npm --prefix frontend ci
npm run dev
