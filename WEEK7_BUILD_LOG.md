# Week 7 Build Log — EcoAI Energy Platform

## Scope

The existing `etikhacker/energy-platform` repository was selected after comparing the available API projects. It already has a FastAPI backend, an `/api/ai` route group, energy-monitoring data, and an existing AI integration. The Week 7 feature was added only to this approved repository.

The chosen job is **energy-alert judgement**: one messy energy-monitoring alert enters the API, and the service returns a closed, validated judgement for operations triage.

## Job card

Input: `{ "alert": "string, 1-2000 characters" }`.

Output fields are `severity`, `category`, `suggested_action`, `confidence`, and `reason`. Severity is one of `normal`, `warning`, or `critical`; category is one of `power`, `temperature`, `air_quality`, `device`, or `other`.

When uncertain, the implementation uses `normal`, `other`, and confidence below `0.5`. The model is not allowed to invent measurements or reveal the prompt.

## Iteration history

### Repository selection

The first implementation attempt was made in a different internship repository without confirmation. That was reverted completely with four revert commits and pushed back to its `main` branch. After comparing the repositories, Omar approved `energy-platform`, and all Week 7 work below was performed there.

### Contract before provider call

The response contract and `JOB-CARD.md` were written before the provider integration. `AlertJudgement` uses Pydantic `Literal` values and numeric bounds so model output cannot escape with arbitrary categories or an invalid confidence value.

### Test-first implementation

Eight tests were written before `judgement.py` existed. The first run failed with `ModuleNotFoundError`, confirming that the tests were exercising missing feature behavior. The implementation then added the schema parser, prompt builder, OpenRouter client, retry policy, repair attempt, cost logging, and kill switch. All eight tests passed after the first implementation slice.

### Scope-safe integration

A new `POST /api/ai/triage-alert` route was added to the existing AI router. The existing Gemini-powered `/recommendations` and `/ask` routes were not refactored. The new endpoint uses OpenRouter so the Week 7 provider lane is explicit and isolated from the existing feature.

### Evaluation iteration

The initial eight-case stub evaluation scored `7/8`. Investigation found that the stub classifier matched `HVAC` as a temperature signal before it could recognize an unavailable device. The device rule was moved ahead of the temperature rule. The second run scored `8/8`, or `1.0`.

## Reliability controls

Provider calls use an explicit eight-second timeout and at most two retries. Retries are restricted to request exceptions, HTTP 429, and HTTP 5xx. Invalid JSON or schema output receives exactly one repair call containing the validation error. A final failure becomes a clear API error rather than raw model text.

`LLM_ENABLED=0` is the kill switch. `LLM_STUB_MODE=1` enables deterministic local development without consuming provider quota. Each request writes provider, model, repair status, timestamp, endpoint, and estimated cost to `llm-cost.jsonl`, which is ignored by Git.

## Verification evidence

The eight automated tests pass. The deterministic evaluation reports `8/8`, score `1.0`. A real OpenRouter smoke test was run with synthetic data only:

```text
Synthetic test: power consumption is far above the safe baseline in a fictional building.
```

The real provider returned valid schema-compliant JSON with `severity: critical`, `category: power`, confidence `0.9`, and a practical action. No personal, employer, or confidential data was sent.

## Files

| File | Purpose |
|---|---|
| `backend/JOB-CARD.md` | Input/output contract and safe fallback behavior |
| `backend/judgement.py` | Schema, prompt loading, OpenRouter call, retry, repair, cost log, kill switch |
| `backend/prompts/energy_alert_v1.txt` | Versioned prompt specification |
| `backend/routes/ai.py` | New `/api/ai/triage-alert` route |
| `backend/tests/test_judgement.py` | Eight required test cases |
| `backend/eval_judgement.py` | Eight-case deterministic evaluation |
| `backend/smoke_judgement.py` | Real provider smoke test |
| `backend/.env.example` | Safe provider configuration template |
