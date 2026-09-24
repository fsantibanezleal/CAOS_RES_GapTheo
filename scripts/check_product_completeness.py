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
    paths = re.findall(r"path:\s*[\"']([^\"']+)", app)
    require(paths == ["/", "/introduction", "/methodology", "/implementation", "/experiments", "/benchmark"], f"public route contract differs: {paths}", failures)
    scenarios = json.loads((ROOT / "data/input/canonical-scenarios.json").read_text(encoding="utf-8"))
    require(len(scenarios) >= 12, "canonical scenario deck must have at least 12 cases", failures)
    require(len({item["id"] for item in scenarios}) == len(scenarios), "scenario ids must be unique", failures)
    svgs = list((ROOT / "frontend/public/svg/tech").glob("*.svg"))
    require(len(svgs) >= 5, "architecture modal requires at least five SVG diagrams", failures)
    for directory in ("architecture", "frameworks", "guides", "problem-types", "use-cases", "data-contract"):
        require((ROOT / "docs" / directory / f"{directory}.md").is_file(), f"missing docs/{directory}/{directory}.md", failures)
    require("Apache License" in (ROOT / "LICENSE").read_text(encoding="utf-8"), "LICENSE must be Apache-2.0", failures)
    version = (ROOT / "VERSION").read_text(encoding="utf-8").strip()
    require(version == "0.03.002", f"unexpected release version {version}", failures)
    if failures:
        print("\n".join(failures))
        return 1
    print("product completeness passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
