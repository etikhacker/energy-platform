from fastapi import APIRouter
import anthropic
import os
import json
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


@router.get("/recommendations")
def get_recommendations():
    prompt = """
Sen enerji qənaət ekspertisən. Azərbaycan üçün 6 praktik enerji qənaət tövsiyəsi ver.

Yalnız JSON array qaytar, heç bir əlavə mətn olmadan:
[
  {
    "id": "unikal_id",
    "title": "Qısa başlıq azərbaycanca",
    "description": "Bir cümləlik praktik izah azərbaycanca",
    "saving": "~$X/ay",
    "priority": "Yüksək",
    "category": "Kateqoriya"
  }
]

Priority yalnız: "Yüksək", "Orta", "Aşağı"
"""

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = message.content[0].text.strip()

    try:
        start = raw.find('[')
        end = raw.rfind(']') + 1
        recommendations = json.loads(raw[start:end])
    except Exception:
        recommendations = [
            {
                "id": "ac",
                "title": "Kondisioner Rejimini Optimallaşdırın",
                "description": "26°C əvəzinə 28°C ayarlayın — hər dərəcə 6% qənaət deməkdir.",
                "saving": "~$18/ay",
                "priority": "Yüksək",
                "category": "İstilik/Soyutma"
            },
            {
                "id": "night",
                "title": "Gecə Cihazları Söndürün",
                "description": "Gözləmə rejimindəki cihazlar enerji istehlakının 10%-ni tutur.",
                "saving": "~$12/ay",
                "priority": "Yüksək",
                "category": "Cihaz"
            },
            {
                "id": "solar",
                "title": "Günəş Saatlarında Yükü Artırın",
                "description": "10:00–15:00 saatları arasında ağır cihazları istifadə edin.",
                "saving": "~$9/ay",
                "priority": "Orta",
                "category": "Cədvəl"
            }
        ]

    return {"recommendations": recommendations}


@router.post("/ask")
def ask_ai(question: str):
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=500,
        messages=[{
            "role": "user",
            "content": f"Enerji qənaəti haqqında sual: {question}. Azərbaycanca qısa cavab ver."
        }]
    )
    return {"answer": message.content[0].text}