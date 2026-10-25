"""Build the theorem-specific, bilingual executive diagrams from deterministic geometry."""
from __future__ import annotations

import math
from html import escape
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "frontend" / "public" / "executive"
ALPHA = (math.sqrt(5) - 1) / 2


def text(x: float, y: float, en: str, es: str, size: int = 18, *, anchor: str = "start", tone: str = "fg") -> str:
    # The CAOS executive figure is capped at 640 CSS pixels by the shell. Scale
    # SVG labels against that actual display size so mathematical annotations
    # remain readable instead of being designed for the 1000-unit viewBox.
    attrs = f'x="{x:g}" y="{y:g}" text-anchor="{anchor}" fill="var(--color-{tone})" font-size="{size * 1.25:g}"'
    return f'<text data-lang="en" {attrs}>{escape(en)}</text><text data-lang="es" {attrs}>{escape(es)}</text>'


def panel(x: int, y: int, width: int, height: int) -> str:
    return (f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="18" '
            'fill="var(--color-surface)" stroke="var(--color-border)" stroke-width="2"/>')


def orbit(cx: float, cy: float, radius: float, count: int, *, selected: int = 0, selected_gap: int | None = None, dot: float = 5) -> str:
    result = [f'<circle cx="{cx:g}" cy="{cy:g}" r="{radius:g}" fill="none" stroke="var(--color-border)" stroke-width="2"/>']
    pts = sorted(((i * ALPHA) % 1, i) for i in range(count))
    for j, (value, index) in enumerate(pts):
        nxt = pts[(j + 1) % count][0]
        delta = (nxt - value) % 1
        start = 2 * math.pi * value - math.pi / 2
        end = start + 2 * math.pi * delta
        x1, y1 = cx + radius * math.cos(start), cy + radius * math.sin(start)
        x2, y2 = cx + radius * math.cos(end), cy + radius * math.sin(end)
        active = selected_gap == j
        klass = "warn" if active else "accent" if delta < 0.03 else "accent-2"
        result.append(f'<path d="M{x1:.2f} {y1:.2f} A{radius:g} {radius:g} 0 {int(delta > .5)} 1 {x2:.2f} {y2:.2f}" '
                      f'fill="none" stroke="var(--color-{klass})" stroke-width="{7 if active else 5}" stroke-linecap="round"/>')
    active_endpoints = set()
    if selected_gap is not None:
        active_endpoints = {pts[selected_gap % count][1], pts[(selected_gap + 1) % count][1]}
    for value, index in pts:
        angle = 2 * math.pi * value - math.pi / 2
        x, y = cx + radius * math.cos(angle), cy + radius * math.sin(angle)
        active = index in active_endpoints if selected_gap is not None else index == selected
        result.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{dot + (2 if active else 0):g}" '
                      f'fill="var(--color-{ "warn" if active else "fg"})" stroke="var(--color-surface)" stroke-width="2"/>')
    return "".join(result)


def svg(name: str, aria: str, body: str, *, animated: bool = False) -> str:
    motion = '''<style>.selected-gap { animation: pulse 5s ease-in-out infinite alternate; }
@keyframes pulse { from { opacity: .55; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .selected-gap { animation: none; } }</style>''' if animated else ""
    label = escape(aria, quote=True)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 540" role="img" aria-label="{label}">'
            f'<title>{escape(aria)}</title>{motion}{body}</svg>\n')


def pain() -> str:
    body = panel(28, 24, 944, 492)
    body += text(56, 62, "One finite orbit · two geometric encodings", "Una órbita finita · dos codificaciones geométricas", 22)
    body += text(56, 96, "Same α and N; conventions must still be stated", "Mismos α y N; las convenciones deben declararse", 16, tone="fg-subtle")
    body += panel(54, 122, 404, 334) + panel(542, 122, 404, 334)
    body += text(78, 158, "CIRCLE  ·  ℝ / ℤ", "CÍRCULO  ·  ℝ / ℤ", 15, tone="accent")
    body += text(566, 158, "SORTED INTERVAL  ·  [0, 1)", "INTERVALO ORDENADO  ·  [0, 1)", 15, tone="accent")
    body += orbit(254, 304, 112, 21, selected_gap=7, dot=4)
    vals = sorted((i * ALPHA) % 1 for i in range(21))
    x0, x1, yy = 585, 904, 304
    body += f'<path d="M{x0} {yy}H{x1}" stroke="var(--color-fg-faint)" stroke-width="2"/>'
    for j, value in enumerate(vals):
        x = x0 + (x1 - x0) * value
        body += f'<path d="M{x:.2f} {yy-13}V{yy+13}" stroke="var(--color-{ "warn" if j == 7 else "accent"})" stroke-width="3"/>'
    gap_start, gap_end = vals[7], vals[8]
    gx1, gx2 = x0 + (x1 - x0) * gap_start, x0 + (x1 - x0) * gap_end
    body += f'<path class="selected-gap" d="M{gx1:.2f} {yy-25}H{gx2:.2f}" stroke="var(--color-warn)" stroke-width="5"/>'
    body += text((gx1 + gx2) / 2, yy - 34, "gᵢ", "gᵢ", 16, anchor="middle", tone="warn")
    body += text(585, 356, "0", "0", 15, tone="fg-subtle") + text(904, 356, "1", "1", 15, anchor="end", tone="fg-subtle")
    body += text(78, 402, "xₙ = {φ + nα} mod 1", "xₙ = {φ + nα} mod 1", 18, tone="accent")
    body += text(566, 402, "N points  →  N cyclic gaps", "N puntos  →  N brechas cíclicas", 18, tone="accent")
    body += text(78, 434, "Circle preserves adjacency", "El círculo preserva adyacencia", 15, tone="fg-subtle")
    body += text(566, 434, "The final-to-first wrap is included", "Se incluye el cierre último-a-primero", 15, tone="fg-subtle")
    body += '<path d="M462 286H538" stroke="var(--color-bad)" stroke-width="2" stroke-dasharray="5 8"/>'
    body += text(500, 270, "convention", "convención", 15, anchor="middle", tone="bad")
    return svg("pain", "One finite circle rotation shown as its circular partition and sorted interval", body, animated=True)


def situation() -> str:
    body = panel(28, 24, 944, 492)
    body += text(56, 62, "Three established descriptions · one finite object", "Tres descripciones establecidas · un objeto finito", 22)
    body += text(56, 96, "Each answers a different question and carries its own conventions", "Cada una responde otra pregunta y tiene sus propias convenciones", 16, tone="fg-subtle")
    cols = [(52, "GEOMETRY", "GEOMETRÍA"), (356, "ARITHMETIC", "ARITMÉTICA"), (660, "SYMBOLIC", "SIMBÓLICA")]
    for x, en, es in cols:
        body += panel(x, 124, 288, 300)
        body += text(x + 22, 160, en, es, 15, tone="accent")
    body += orbit(196, 274, 73, 17, selected=5, dot=3.5)
    body += text(196, 377, "gaps in cyclic order", "brechas en orden cíclico", 15, anchor="middle")
    body += text(500, 218, "p/q < α < r/s", "p/q < α < r/s", 22, anchor="middle", tone="accent")
    body += text(500, 258, "rq − ps = 1", "rq − ps = 1", 19, anchor="middle")
    body += '<path d="M406 312H594" stroke="var(--color-border)" stroke-width="2"/>'
    body += '<path d="M420 312H464M472 312H520M528 312H580" stroke="var(--color-accent-2)" stroke-width="10" stroke-linecap="round"/>'
    body += text(500, 377, "convergents and counts", "convergentes y conteos", 15, anchor="middle")
    for i, symbol in enumerate("abbababbaba"):
        x = 691 + i * 19
        fill = "accent" if symbol == "a" else "accent-2"
        body += f'<rect x="{x}" y="244" width="15" height="44" rx="4" fill="var(--color-{fill})"/>'
        body += text(x + 7.5, 317, symbol, symbol, 16, anchor="middle", tone="fg-subtle")
    body += text(804, 377, "cyclic word of gap classes", "palabra cíclica de clases", 15, anchor="middle")
    body += text(500, 466, "Related views are cross-checks, not independent proofs", "Las vistas se contrastan; no son pruebas independientes", 16, anchor="middle", tone="fg-subtle")
    return svg("situation", "Geometric, continued-fraction, and symbolic descriptions of the three-gap theorem", body)


def proposal() -> str:
    body = panel(28, 24, 944, 492)
    body += text(56, 62, "One scenario state · linked research views", "Un estado de escenario · vistas de investigación vinculadas", 22)
    body += text(56, 96, "Controls change a shared finite input; every panel reports its scope", "Los controles cambian una entrada finita común; cada panel declara su alcance", 16, tone="fg-subtle")
    body += panel(54, 132, 224, 312)
    body += text(78, 170, "SCENARIO", "ESCENARIO", 15, tone="accent")
    body += text(78, 216, "α  =  (√5 − 1)/2", "α  =  (√5 − 1)/2", 20)
    body += text(78, 258, "N  =  21", "N  =  21", 20)
    body += text(78, 300, "φ  =  0", "φ  =  0", 20)
    body += text(78, 342, "mode  =  irrational", "modo  =  irracional", 16)
    body += text(78, 399, "declared hypothesis", "hipótesis declarada", 15, tone="fg-subtle")
    # Four linked views are laid out as a precise dashboard, not as decorative thumbnails.
    views = [(330, 132, "DIRECT PARTITION", "PARTICIÓN DIRECTA"),
             (638, 132, "FAREY / CF", "FAREY / FC"),
             (330, 292, "GAP MULTIPLICITIES", "MULTIPLICIDADES"),
             (638, 292, "CERTIFICATE", "CERTIFICADO")]
    for x, y, en, es in views:
        body += panel(x, y, 286, 136) + text(x + 18, y + 30, en, es, 15, tone="accent")
    body += orbit(393, 219, 43, 13, selected_gap=4, dot=2.7)
    body += text(493, 214, "N cyclic arcs", "N arcos cíclicos", 15)
    body += text(493, 239, "Σ gᵢ = 1", "Σ gᵢ = 1", 17, tone="accent")
    body += text(662, 207, "pₖ/qₖ", "pₖ/qₖ", 20)
    body += text(662, 238, "neighboring bounds", "cotas vecinas", 16, tone="fg-subtle")
    body += '<path d="M662 264H881" stroke="var(--color-border)" stroke-width="2"/><path d="M680 264H738M750 264H832" stroke="var(--color-accent-2)" stroke-width="8" stroke-linecap="round"/>'
    body += text(350, 365, "a  ·  8 ×", "a  ·  8 ×", 17, tone="accent")
    body += text(467, 365, "b  ·  13 ×", "b  ·  13 ×", 17, tone="accent-2")
    body += text(662, 365, "Dₙ = 2  ≤  3", "Dₙ = 2  ≤  3", 20)
    body += text(662, 396, "closure residual: 0", "residuo de cierre: 0", 16, tone="fg-subtle")
    body += '<path d="M278 285H314M608 200H626M608 356H626M470 268V282M782 268V282" stroke="var(--color-border)" stroke-width="2" stroke-dasharray="4 6"/>'
    body += text(500, 482, "Numeric agreement does not certify irrationality", "El acuerdo numérico no certifica irracionalidad", 16, anchor="middle", tone="warn")
    return svg("proposal", "A shared rotation scenario linked to direct, arithmetic, multiplicity, and theorem-status views", body)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name, render in (("pain", pain), ("situation", situation), ("proposal", proposal)):
        (OUT / f"{name}.svg").write_text(render(), encoding="utf-8")


if __name__ == "__main__":
    main()
