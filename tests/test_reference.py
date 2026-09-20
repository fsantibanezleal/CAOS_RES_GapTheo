from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from data_pipeline.gaptheo.model import allocate, certificate, continued_fraction, gap_partition, star_discrepancy
from data_pipeline.gaptheo.pipeline import REPO_ROOT, run_pipeline
from data_pipeline.gaptheo.stages.ingest import ingest
from data_pipeline.gaptheo.stages.preprocess import preprocess


class ReferenceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.scenarios = preprocess(ingest(REPO_ROOT / "data" / "input" / "canonical-scenarios.json"))

    def scenario(self, scenario_id: str) -> dict[str, object]:
        return next(item for item in self.scenarios if item["id"] == scenario_id)

    def test_canonical_matrix_has_twelve_distinct_cases(self) -> None:
        self.assertGreaterEqual(len(self.scenarios), 12)
        self.assertEqual(len(self.scenarios), len({item["id"] for item in self.scenarios}))

    def test_irrational_rotation_cases_respect_three_gap_bound(self) -> None:
        theorem_cases = [item for item in self.scenarios if item["allocator"] == "rotation" and item["alphaMode"] != "rational"]
        for scenario in theorem_cases:
            with self.subTest(scenario=scenario["id"]):
                result = certificate(scenario)
                self.assertLessEqual(result["distinctCount"], 3)
                self.assertTrue(result["sumCheck"]["holds"])
                self.assertLess(result["partitionResidual"], 1e-10)

    def test_rational_cases_are_boundaries(self) -> None:
        for scenario_id in ("rational-five-thirteenths", "rational-eight-twenty-one"):
            result = certificate(self.scenario(scenario_id))
            self.assertEqual(result["theoremStatus"], "boundary")

    def test_contrast_processes_are_not_certified(self) -> None:
        for scenario_id in ("farthest-contrast", "seeded-random-contrast"):
            result = certificate(self.scenario(scenario_id))
            self.assertEqual(result["theoremStatus"], "contrast")

    def test_farthest_allocator_is_deterministic(self) -> None:
        scenario = self.scenario("farthest-contrast")
        self.assertEqual(allocate(scenario), allocate(scenario))
        _, groups = gap_partition(allocate(scenario))
        self.assertGreaterEqual(len(groups), 2)

    def test_continued_fraction_and_discrepancy(self) -> None:
        alpha = (5**0.5 - 1) / 2
        cf = continued_fraction(alpha)
        self.assertEqual(cf["terms"][:5], [0, 1, 1, 1, 1])
        discrepancy = star_discrepancy(allocate(self.scenario("golden-baseline")))
        self.assertGreater(discrepancy, 0)
        self.assertLess(discrepancy, 0.1)

    def test_pipeline_smoke_writes_only_to_sandbox(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            result = run_pipeline(Path(directory))
            self.assertEqual(result["manifest"]["count"], 12)
            self.assertEqual(result["benchmark"]["summary"], {"total": 12, "passed": 12})
            self.assertTrue((Path(directory) / "artifacts" / "benchmark.json").exists())

    def test_committed_benchmark_is_complete(self) -> None:
        benchmark = json.loads((REPO_ROOT / "data" / "artifacts" / "benchmark.json").read_text(encoding="utf-8"))
        self.assertEqual(benchmark["summary"]["total"], benchmark["summary"]["passed"])


if __name__ == "__main__":
    unittest.main()
