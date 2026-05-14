from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import energy, ai, carbon
from data_loader import (
    get_metadata,
    get_monthly_summary,
    get_daily_readings,
    get_sensor_timeseries,
    get_carbon_summary,
    get_ai_recommendations,
    get_warning_days,
)

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


# --- Data Loader endpoint-ləri ---

@app.get("/api/metadata", tags=["data"])
def metadata():
    """Bina metadata məlumatları"""
    return get_metadata()


@app.get("/api/summary", tags=["data"])
def monthly_summary():
    """Aylıq enerji xülasəsi"""
    return get_monthly_summary()


@app.get("/api/readings", tags=["data"])
def all_readings():
    """Bütün günlük oxunuşlar"""
    return get_daily_readings()


@app.get("/api/readings/warnings", tags=["data"])
def warning_days():
    """Xəbərdarlıq olan günlər (CO2, temp, rütubət)"""
    return get_warning_days()


@app.get("/api/sensors/{sensor_id}", tags=["data"])
def sensor_timeseries(sensor_id: str):
    """
    Müəyyən sensorun aylıq zaman seriyası.
    Nümunə: /api/sensors/ELEC-001
    """
    data = get_sensor_timeseries(sensor_id)
    if not data:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=f"Sensor tapılmadı: {sensor_id}")
    return data


@app.get("/api/carbon/summary", tags=["data"])
def carbon_summary():
    """Hər gün üçün karbon emissiyası və qənaət"""
    return get_carbon_summary()


@app.get("/api/ai/recommendations", tags=["data"])
def ai_recommendations():
    """Bütün AI tövsiyələri"""
    return get_ai_recommendations()
