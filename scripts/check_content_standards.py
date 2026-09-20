from __future__ import annotations

import pathlib
import subprocess
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
TEXT_SUFFIXES = {".md", ".tsx", ".ts", ".py", ".json", ".yml", ".yaml", ".html", ".css", ".svg", ".tex"}
FORBIDDEN = {"\u2014": "em dash", "\u2015": "horizontal bar"}


def tracked_files() -> list[pathlib.Path]:
    result = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=ROOT, check=True, capture_output=True, text=True)
    return [ROOT / line for line in result.stdout.splitlines() if line]


def main() -> int:
    failures: list[str] = []
    for path in tracked_files():
        if path.suffix.lower() not in TEXT_SUFFIXES or not path.is_file():
            continue
        text = path.read_text(encoding="utf-8")
        for token, name in FORBIDDEN.items():
            if token in text:
                failures.append(f"{path.relative_to(ROOT)}: contains {name}")
        if "D:\\_Repos" in text or "C:\\Users\\" in text:
            failures.append(f"{path.relative_to(ROOT)}: contains a local workstation path")
    if failures:
        print("\n".join(failures))
        return 1
    print("content standards passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
