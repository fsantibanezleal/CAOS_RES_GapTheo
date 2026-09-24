from __future__ import annotations

import pathlib
import re
import sys


ROOT = pathlib.Path(__file__).resolve().parents[1]
FRONTEND = ROOT / "frontend"


def require(condition: bool, message: str, failures: list[str]) -> None:
    if not condition:
        failures.append(message)


def function_block(source: str, name: str, next_name: str | None) -> str:
    start = source.index(f"export function {name}Page()")
    end = source.index(f"export function {next_name}Page()", start) if next_name else len(source)
    return source[start:end]


def main() -> int:
    failures: list[str] = []
    pages = (FRONTEND / "src/pages/ResearchPages.tsx").read_text(encoding="utf-8")
    figures = (FRONTEND / "src/pages/ScientificFigures.tsx").read_text(encoding="utf-8")
    app = (FRONTEND / "src/App.tsx").read_text(encoding="utf-8")

    require("Legacy" not in pages, "legacy research renderers are forbidden", failures)
    require("diagram-" not in pages, "undefined legacy diagram classes are forbidden", failures)
    require("extension-tabs" not in app, "custom extension tab controls are forbidden; use shell SubTabs", failures)
    require(
        'location.pathname.replace(/\\/+$/, "") || "/"' in app,
        "route handling must normalize GitHub Pages trailing slashes",
        failures,
    )

    page_order = ["Introduction", "Methodology", "Implementation", "Experiments", "Benchmark"]
    next_names = page_order[1:] + [None]
    for name, next_name in zip(page_order, next_names):
        block = function_block(pages, name, next_name)
        require("<Tabs" in block, f"{name} must render shell Tabs", failures)

    intro = function_block(pages, "Introduction", "Methodology")
    for tab_id in ("problem", "mechanism", "readings", "notation", "scope"):
        require(f'id: "{tab_id}"' in intro, f"Introduction missing {tab_id} tab", failures)

    svg_starts = [match.start() for match in re.finditer(r"<svg\b", figures)]
    for index, start in enumerate(svg_starts):
        tag_end = figures.find(">", start)
        tag = figures[start:tag_end]
        require('role="img"' in tag, f"scientific SVG {index + 1} lacks role=img", failures)
        require("aria-label=" in tag, f"scientific SVG {index + 1} lacks an aria-label", failures)

    for path in (FRONTEND / "public/svg/tech").glob("*.svg"):
        text = path.read_text(encoding="utf-8")
        require(not re.search(r"#[0-9a-fA-F]{3,8}", text), f"{path.name} contains hard-coded hex color", failures)
        allowed_tokens = {
            "--color-surface",
            "--color-surface-2",
            "--color-border",
            "--color-accent",
            "--color-good",
            "--color-warn",
            "--color-fg",
            "--color-fg-subtle",
        }
        used_tokens = set(re.findall(r"var\((--[a-zA-Z0-9-]+)", text))
        require(
            used_tokens <= allowed_tokens,
            f"{path.name} uses unknown shell tokens: {sorted(used_tokens - allowed_tokens)}",
            failures,
        )
        for match in re.finditer(r"<text\b([^>]*)>", text):
            attrs = match.group(1)
            require(
                re.search(r'class="[^"]*\bl-(?:en|es|neutral)\b', attrs) is not None,
                f"{path.name} contains an unscoped text label: {match.group(0)}",
                failures,
            )

    for path in (FRONTEND / "src").rglob("*.tsx"):
        text = path.read_text(encoding="utf-8")
        require(
            not re.search(r"#[0-9a-fA-F]{3,8}", text),
            f"{path.relative_to(FRONTEND)} contains a hard-coded hex color",
            failures,
        )

    if failures:
        print("\n".join(failures))
        return 1
    print("frontend ADR guard passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
