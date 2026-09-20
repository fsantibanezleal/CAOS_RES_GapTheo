from __future__ import annotations

from typing import Any


def evaluate(certificates: list[dict[str, Any]], partitions: dict[str, list[str]]) -> dict[str, Any]:
    cells: list[dict[str, Any]] = []
    for cert in certificates:
        theorem_case = cert["scenarioId"] in partitions["theorem"]
        pass_bound = not theorem_case or (cert["distinctCount"] <= 3 and cert["sumCheck"]["holds"])
        pass_partition = cert["partitionResidual"] < 1e-10
        pass_dual = cert["dual"] is None or cert["dual"]["distinctCount"] <= 3
        cells.append(
            {
                "scenarioId": cert["scenarioId"],
                "category": cert["category"],
                "status": cert["theoremStatus"],
                "distinctCount": cert["distinctCount"],
                "dualDistinctCount": cert["dual"]["distinctCount"] if cert["dual"] else None,
                "sumResidual": cert["sumCheck"]["residual"],
                "partitionResidual": cert["partitionResidual"],
                "starDiscrepancy": cert["starDiscrepancy"],
                "checks": {"threeGap": pass_bound, "partition": pass_partition, "dualBound": pass_dual},
                "passed": pass_bound and pass_partition and pass_dual,
            }
        )
    return {
        "version": "0.02.000",
        "protocol": "deterministic full canonical matrix",
        "partitions": partitions,
        "summary": {"total": len(cells), "passed": sum(cell["passed"] for cell in cells)},
        "cells": cells,
    }
