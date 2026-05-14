from fastapi import APIRouter

router = APIRouter()

@router.get("/recommendations")
def get_recommendations():
    return {
        "recommendations": [
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
                "category": "İdman Rejimi"
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
    }

@router.post("/ask")
def ask_ai(question: str):
    return {"answer": "AI modulu aktivləşdirilməyib."}