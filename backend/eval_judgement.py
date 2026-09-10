import json
import os

from judgement import _stub_judgement


CASES = [
    ("Power consumption is above the safe baseline.", "power"),
    ("Indoor temperature is 31°C.", "temperature"),
    ("CO2 and humidity are elevated.", "air_quality"),
    ("The HVAC device is not responding.", "device"),
    ("Smoke detected near the electrical room.", "other"),
    ("No abnormal signal was reported.", "other"),
    ("The load reached 9 kWh this hour.", "power"),
    ("The building is unusually cold.", "temperature"),
]

os.environ["LLM_ENABLED"] = "1"
results = []
for alert, expected_category in CASES:
    result = _stub_judgement(alert)
    results.append(result.category == expected_category)

print(json.dumps({"cases": len(results), "correct": sum(results), "score": sum(results) / len(results), "mode": "stub"}, indent=2))
