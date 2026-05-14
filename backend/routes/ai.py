from fastapi import APIRouter
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key=os.getenv("NVIDIA_API_KEY"),
)

class AskRequest(BaseModel):
    question: str

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
def ask_ai(body: AskRequest):
    try:
        completion = client.chat.completions.create(
            model="nvidia/nemotron-3-nano-omni-30b-a3b-reasoning",
            messages=[
                {
                    "role": "system",
                    "content": "Sən EcoAI enerji platformasının AI assistentisən. İstifadəçilərə enerji qənaəti, cihaz idarəetməsi və karbon azaldılması haqqında Azərbaycan dilində kömək edirsən."
                },
                {
                    "role": "user",
                    "content": body.question
                }
            ],
            temperature=0.7,
            max_tokens=1024,
        )
        return {"answer": completion.choices[0].message.content}
    except Exception as e:
        return {"answer": f"Xəta baş verdi: {str(e)}"}