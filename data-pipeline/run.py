#!/usr/bin/env python3
"""Repo-local build tooling. Invoked BY PATH, never installed, never a distribution."""
from pipeline.gaptheo.pipeline import run_pipeline

def main() -> None:
    result = run_pipeline()
    summary = result["benchmark"].get("summary", {})
    print(f"generated {result['manifest']['count']} GapTheo certificates; benchmark summary: {summary}")

if __name__ == "__main__":
    main()
