import json
import os

os.environ["LLM_STUB_MODE"] = "1"
from routes.ai import AlertRequest, triage_alert


result = triage_alert(AlertRequest(alert="Power consumption is above the safe baseline."))
print(json.dumps(result, indent=2, ensure_ascii=False))
