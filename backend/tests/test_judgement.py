import json
import os
import tempfile
import unittest
from unittest.mock import patch

from judgement import (
    AlertJudgement,
    classify_alert,
    log_cost,
    parse_judgement,
    retryable_status,
)


class EnergyAlertJudgementTests(unittest.TestCase):
    def test_valid_judgement_has_closed_schema(self):
        result = parse_judgement(
            {
                "severity": "warning",
                "category": "temperature",
                "suggested_action": "Inspect HVAC settings.",
                "confidence": 0.91,
                "reason": "The alert reports elevated indoor temperature.",
            }
        )
        self.assertIsInstance(result, AlertJudgement)
        self.assertEqual(result.category, "temperature")

    def test_rejects_unknown_category(self):
        with self.assertRaises(ValueError):
            parse_judgement(
                {
                    "severity": "warning",
                    "category": "unknown",
                    "suggested_action": "Do something.",
                    "confidence": 0.5,
                    "reason": "Unclear.",
                }
            )

    def test_rejects_confidence_outside_range(self):
        with self.assertRaises(ValueError):
            parse_judgement(
                {
                    "severity": "normal",
                    "category": "other",
                    "suggested_action": "No action.",
                    "confidence": 1.2,
                    "reason": "Invalid confidence.",
                }
            )

    def test_rejects_non_json_model_output(self):
        with self.assertRaises(ValueError):
            parse_judgement("not json")

    def test_retries_only_transient_statuses(self):
        self.assertTrue(retryable_status(429))
        self.assertTrue(retryable_status(500))
        self.assertTrue(retryable_status(503))
        self.assertFalse(retryable_status(400))
        self.assertFalse(retryable_status(401))

    def test_classify_repairs_invalid_first_response_once(self):
        responses = iter([
            "not json",
            '{"severity":"critical","category":"power","suggested_action":"Inspect the load immediately.","confidence":0.88,"reason":"Power draw exceeds the safe threshold."}',
        ])
        with patch("judgement.call_openrouter", side_effect=lambda prompt, repair=False: next(responses)) as mocked:
            result = classify_alert("Power consumption is far above the safe threshold.")
        self.assertEqual(result.severity, "critical")
        self.assertEqual(mocked.call_count, 2)

    def test_kill_switch_raises_before_provider_call(self):
        with patch.dict(os.environ, {"LLM_ENABLED": "0", "LLM_STUB_MODE": "0"}, clear=False):
            with self.assertRaises(RuntimeError):
                classify_alert("Temperature is elevated.")

    def test_cost_log_records_provider_and_estimated_cost(self):
        with tempfile.TemporaryDirectory() as directory:
            path = os.path.join(directory, "cost.jsonl")
            with patch.dict(os.environ, {"COST_LOG_PATH": path}, clear=False):
                log_cost("openrouter", repaired=True)
            with open(path, encoding="utf-8") as handle:
                record = json.loads(handle.readline())
            self.assertEqual(record["provider"], "openrouter")
            self.assertTrue(record["repaired"])
            self.assertEqual(record["estimated_cost_usd"], 0.0)


if __name__ == "__main__":
    unittest.main()
