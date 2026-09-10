import json
import os

from judgement import classify_alert_with_meta, log_cost


alert = "Synthetic test: power consumption is far above the safe baseline in a fictional building."
if os.getenv("LLM_STUB_MODE", "0") == "1":
    result, repaired = classify_alert_with_meta(alert)
    provider = "stub"
else:
    result, repaired = classify_alert_with_meta(alert)
    provider = "openrouter"
log_cost(provider, repaired=repaired)
print(json.dumps({"status": "ok", "provider": provider, "repaired": repaired, "result": result.model_dump()}, indent=2))
