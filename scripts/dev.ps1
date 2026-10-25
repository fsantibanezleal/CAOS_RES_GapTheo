$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
if (-not (Test-Path "frontend/node_modules")) { npm --prefix frontend ci }
npm run dev
