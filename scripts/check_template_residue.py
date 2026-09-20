from __future__ import annotations

import pathlib
import subprocess
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
TOKENS = ("template_repo_product", "REPLACE_ME", "TODO_PRODUCT_NAME", "example.com")


def main() -> int:
    result = subprocess.run(["git", "ls-files", "-co", "--exclude-standard"], cwd=ROOT, check=True, capture_output=True, text=True)
    failures: list[str] = []
    for relative in result.stdout.splitlines():
        if relative == "scripts/check_template_residue.py":
            continue
        path = ROOT / relative
        if not path.is_file() or path.suffix.lower() not in {".md", ".tsx", ".ts", ".py", ".json", ".yml", ".yaml", ".html"}:
            continue
        text = path.read_text(encoding="utf-8")
        for token in TOKENS:
            if token.lower() in text.lower():
                failures.append(f"{relative}: contains template token {token}")
    if failures:
        print("\n".join(failures))
        return 1
    print("template residue check passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
