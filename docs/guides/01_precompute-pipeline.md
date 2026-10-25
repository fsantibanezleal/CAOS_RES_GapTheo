# Rebuild the GapTheo certificates

From the repository root, run `python data-pipeline/run.py`. This reads the canonical scenario matrix and rewrites the
12 deterministic certificates, benchmark summary, and manifest. The mathematical engine and its stage descriptions
are in [`data-pipeline/README.md`](../../data-pipeline/README.md).

Validate the generated set with `python scripts/validate_artifacts.py`. The validator checks each artifact against its
scenario, declared theorem status, gap partition, arithmetic fields, and canonical hash. Rebuild generated data as a
reviewable mathematical change; do not edit certificates by hand.
