from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import energy, ai, carbon

app = FastAPI(title="EcoAI Energy Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(energy.router, prefix="/api/energy", tags=["energy"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(carbon.router, prefix="/api/carbon", tags=["carbon"])

@app.get("/")
def root():
    return {"status": "EcoAI Backend işləyir"}
