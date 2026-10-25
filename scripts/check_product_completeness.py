from __future__ import annotations

import json
import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]


def require(condition: bool, message: str, failures: list[str]) -> None:
    if not condition:
        failures.append(message)


def main() -> int:
    failures: list[str] = []
    app = (ROOT / "frontend/src/App.tsx").read_text(encoding="utf-8")
    paths = re.findall(r'<Route\s+path="([^"]+)"', app)
    require(paths == ["/", "/app", "/introduction", "/methodology", "/implementation", "/experiments", "/benchmark", "*"], f"public route contract differs: {paths}", failures)
    scenarios = json.loads((ROOT / "data/input/canonical-scenarios.json").read_text(encoding="utf-8"))
    require(len(scenarios) >= 12, "canonical scenario deck must have at least 12 cases", failures)
    require(len({item["id"] for item in scenarios}) == len(scenarios), "scenario ids must be unique", failures)
    svgs = list((ROOT / "frontend/src/architecture").glob("*.svg"))
    require(len(svgs) >= 5, "architecture modal requires at least five SVG diagrams", failures)
    for path in (
        "docs/design/SDD.md",
        "docs/research/deep-review.md",
        "docs/research/mathematical-contract.md",
        "docs/research/reproducibility.md",
        "manuscripts/gaptheo/tex/main.tex",
        "frontend/public/CNAME",
    ):
        require((ROOT / path).is_file(), f"missing {path}", failures)
    require("gaptheo.fasl-work.com" in (ROOT / "frontend/public/CNAME").read_text(encoding="utf-8"), "CNAME does not name the requested domain", failures)
    require("Apache License" in (ROOT / "LICENSE").read_text(encoding="utf-8"), "LICENSE must be Apache-2.0", failures)
    version = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    require(bool(re.fullmatch(r"\d+\.\d{2}\.\d{3}", version)), f"invalid product version {version}", failures)
    require(f"## [{version}]" in (ROOT / "CHANGELOG.md").read_text(encoding="utf-8"), "CHANGELOG top entry does not match VERSION", failures)
    if failures:
        print("\n".join(failures))
        return 1
    print("product completeness passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
