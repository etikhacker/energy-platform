from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
import json
import os
import urllib.error
import urllib.request

load_dotenv()

router = APIRouter()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")


class QuestionRequest(BaseModel):
    question: str


def call_gemini(prompt: str, system_instruction: str | None = None) -> str:
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured")

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
    }
    if system_instruction:
        payload["system_instruction"] = {"parts": [{"text": system_instruction}]}

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"
    )
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="ignore")
        raise HTTPException(status_code=exc.code, detail=detail or "Gemini request failed") from exc
    except urllib.error.URLError as exc:
        raise HTTPException(status_code=502, detail=f"Gemini backend unreachable: {exc.reason}") from exc

    return (
        data.get("candidates", [{}])[0]
        .get("content", {})
        .get("parts", [{}])[0]
        .get("text", "Cavab alınmadı.")
    )


def fallback_recommendations():
    return [
        {
            "id": "ac",
            "title": "Kondisioner rejimini optimallaşdırın",
            "description": "26°C əvəzinə 28°C seçin, bu aylıq enerji xərclərini hiss ediləcək qədər azalda bilər.",
            "saving": "~$18/ay",
            "priority": "Yüksək",
            "category": "İstilik/Soyutma",
        },
        {
            "id": "night",
            "title": "Gecə gözləmə rejimini söndürün",
            "description": "Gözləmə rejimində qalan cihazlar da boş yerə enerji sərf edir.",
            "saving": "~$12/ay",
            "priority": "Yüksək",
            "category": "Cihaz",
        },
        {
            "id": "solar",
            "title": "Günəş saatlarında yükü artırın",
            "description": "10:00-15:00 arasında ağır cihazları işə salmaq şəbəkə yükünü azaldır.",
            "saving": "~$9/ay",
            "priority": "Orta",
            "category": "Cədvəl",
        },
    ]


@router.get("/recommendations")
def get_recommendations():
    prompt = """
Sən enerji qənaət ekspertisən. Azərbaycan üçün 6 praktik enerji qənaət tövsiyəsi ver.

Yalnız valid JSON array qaytar, əlavə mətn yazma:
[
  {
    "id": "unikal_id",
    "title": "Qısa başlıq",
    "description": "Bir cümləlik praktik izah",
    "saving": "~$X/ay",
    "priority": "Yüksək | Orta | Aşağı",
    "category": "Kateqoriya"
  }
]
"""

    raw = call_gemini(
        prompt=prompt,
        system_instruction="Yalnız JSON qaytar. Heç bir izah, başlıq və ya markdown istifadə etmə."
    ).strip()

    try:
        start = raw.find("[")
        end = raw.rfind("]") + 1
        recommendations = json.loads(raw[start:end])
    except Exception:
        recommendations = fallback_recommendations()

    return {"recommendations": recommendations}


@router.post("/ask")
def ask_ai(body: QuestionRequest):
    answer = call_gemini(
        prompt=body.question.strip(),
        system_instruction="Sən enerji qənaət ekspertisən. Yalnız Azərbaycanca cavab ver. Qısa və praktik ol, maksimum 2-3 cümlə."
    )
    return {"answer": answer}
