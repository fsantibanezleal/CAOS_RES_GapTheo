from __future__ import annotations

import argparse
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from data_pipeline.gaptheo.pipeline import run_pipeline


def main() -> None:
    parser = argparse.ArgumentParser(description="Build deterministic GapTheo certificates.")
    parser.add_argument(
        "--output",
        type=Path,
        help="Sandbox output directory. Omit only for an intentional canonical bake.",
    )
    args = parser.parse_args()
    result = run_pipeline(output_root=args.output)
    print(
        f"generated {result['manifest']['count']} certificates, "
        f"{result['benchmark']['summary']['passed']} validated benchmark cells"
    )


if __name__ == "__main__":
    main()
