from __future__ import annotations


def register_methods() -> dict[str, object]:
    return {
        "trainingApplicable": False,
        "reason": "GapTheo compares exact and numerical mathematical certificates; it does not fit statistical models.",
        "methods": [
            "direct-sorted-orbit",
            "incremental-gap-genealogy",
            "farey-cell",
            "continued-fraction",
            "dual-return-times",
            "zero-dimensional-rips",
            "cyclic-gap-word",
            "lattice-window",
            "two-interval-exchange",
            "star-discrepancy",
            "farthest-point-contrast",
            "seeded-random-contrast",
        ],
    }
