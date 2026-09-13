import json
import unittest
from pathlib import Path

from data_pipeline.run import certificate


class ReferenceCertificateTests(unittest.TestCase):
    def setUp(self):
        self.scenarios = json.loads(
            (Path(__file__).parents[1] / "data" / "input" / "canonical-scenarios.json").read_text()
        )

    def test_irrational_certificate(self):
        result = certificate(self.scenarios[0])
        self.assertLessEqual(result["distinctCount"], 3)
        self.assertTrue(result["sumCheck"]["holds"])
        self.assertEqual(result["theoremStatus"], "certified")

    def test_rational_boundary(self):
        result = certificate(self.scenarios[1])
        self.assertEqual(result["theoremStatus"], "boundary")

    def test_contrast_boundary(self):
        result = certificate(self.scenarios[2])
        self.assertEqual(result["theoremStatus"], "contrast")


if __name__ == "__main__":
    unittest.main()
