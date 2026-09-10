import json
import os
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

import requests
from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
PROMPT_PATH = BASE_DIR / "prompts" / "energy_alert_v1.txt"

Severity = Literal["normal", "warning", "critical"]
Category = Literal["power", "temperature", "air_quality", "device", "other"]


class AlertJudgement(BaseModel):
    severity: Severity
    category: Category
    suggested_action: str = Field(min_length=1, max_length=240)
    confidence: float = Field(ge=0.0, le=1.0)
    reason: str = Field(min_length=1, max_length=240)


def retryable_status(status_code: int) -> bool:
    return status_code == 429 or 500 <= status_code <= 599


def parse_judgement(raw: Any) -> AlertJudgement:
    if isinstance(raw, str):
        try:
            raw = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise ValueError("model output is not valid JSON") from exc
    if not isinstance(raw, dict):
        raise ValueError("model output must be a JSON object")
    return AlertJudgement.model_validate(raw)


def build_prompt(alert: str, repair: bool = False, error: str = "") -> str:
    template = PROMPT_PATH.read_text(encoding="utf-8")
    prompt = template.replace("{{alert}}", alert)
    if repair:
        prompt += f"\nPrevious output failed validation: {error}\nReturn only corrected JSON."
    return prompt


def _stub_judgement(alert: str) -> AlertJudgement:
    lowered = alert.lower()
    if any(word in lowered for word in ("fire", "danger", "critical", "smoke")):
        return AlertJudgement(
            severity="critical", category="other", suggested_action="Escalate immediately and inspect the site.", confidence=0.96, reason="The alert contains an immediate safety signal."
        )
    if any(word in lowered for word in ("temperature", "hot", "cold", "hvac")):
        return AlertJudgement(
            severity="warning", category="temperature", suggested_action="Inspect HVAC settings and the temperature sensor.", confidence=0.92, reason="The alert describes an abnormal temperature condition."
        )
    if any(word in lowered for word in ("power", "consumption", "load", "kwh")):
        return AlertJudgement(
            severity="warning", category="power", suggested_action="Inspect current load and compare it with the baseline.", confidence=0.9, reason="The alert describes an energy consumption issue."
        )
    if any(word in lowered for word in ("co2", "humidity", "air")):
        return AlertJudgement(
            severity="warning", category="air_quality", suggested_action="Inspect ventilation and the air-quality sensor.", confidence=0.88, reason="The alert describes an air-quality signal."
        )
    return AlertJudgement(
        severity="normal", category="other", suggested_action="Review the alert manually.", confidence=0.35, reason="The alert does not match a known energy category."
    )


def call_openrouter(prompt: str, repair: bool = False) -> str:
    if os.getenv("LLM_ENABLED", "1") != "1":
        raise RuntimeError("LLM integration is disabled by the kill switch.")
    api_key = os.getenv("OPENROUTER_API_KEY", "")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY is not configured.")

    url = os.getenv("LLM_BASE_URL", "https://openrouter.ai/api/v1") + "/chat/completions"
    timeout = float(os.getenv("LLM_TIMEOUT_SECONDS", "8"))
    max_retries = int(os.getenv("LLM_MAX_RETRIES", "2"))
    body = {
        "model": os.getenv("LLM_MODEL", "openrouter/free"),
        "messages": [
            {"role": "system", "content": "You are a strict energy-alert JSON classification service."},
            {"role": "user", "content": prompt},
        ],
        "temperature": 0,
        "response_format": {"type": "json_object"},
    }
    last_error = "unknown provider error"
    for attempt in range(max_retries + 1):
        try:
            response = requests.post(
                url,
                headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
                json=body,
                timeout=timeout,
            )
            if response.ok:
                data = response.json()
                return data["choices"][0]["message"]["content"]
            last_error = f"provider returned HTTP {response.status_code}"
            if not retryable_status(response.status_code) or attempt >= max_retries:
                break
        except requests.RequestException as exc:
            last_error = str(exc)
            if attempt >= max_retries:
                break
        time.sleep(min(0.25 * (2 ** attempt), 1.0))
    raise RuntimeError(last_error)


def classify_alert_with_meta(alert: str) -> tuple[AlertJudgement, bool]:
    if os.getenv("LLM_ENABLED", "1") != "1":
        raise RuntimeError("LLM integration is disabled by the kill switch.")
    if os.getenv("LLM_STUB_MODE", "0") == "1":
        return _stub_judgement(alert), False

    try:
        result = parse_judgement(call_openrouter(build_prompt(alert)))
        return result, False
    except (ValueError, json.JSONDecodeError) as exc:
        repaired = call_openrouter(build_prompt(alert, repair=True, error=str(exc)), repair=True)
        return parse_judgement(repaired), True


def classify_alert(alert: str) -> AlertJudgement:
    return classify_alert_with_meta(alert)[0]


def log_cost(provider: str, repaired: bool = False) -> None:
    path = Path(os.getenv("COST_LOG_PATH", "llm-cost.jsonl"))
    record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "endpoint": "/api/ai/triage-alert",
        "provider": provider,
        "model": os.getenv("LLM_MODEL", "openrouter/free"),
        "repaired": repaired,
        "estimated_cost_usd": 0.0,
    }
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record) + "\n")
