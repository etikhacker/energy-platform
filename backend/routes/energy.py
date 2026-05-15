from fastapi import APIRouter
from database import supabase

router = APIRouter()


@router.get("/monthly")
def get_monthly_data():
    data = supabase.table("energy_readings").select("*").order("month").execute()

    actual = []
    forecast = []

    for row in data.data:
        if row["type"] == "actual":
            actual.append(row["value"])
        elif row["type"] == "forecast":
            forecast.append(row["value"])

    return {
        "actual": actual,
        "forecast": forecast
    }


@router.get("/dashboard")
def get_dashboard_stats():
    data = supabase.table("energy_readings").select("*").eq("type", "actual").order("month", desc=True).limit(2).execute()

    if len(data.data) < 2:
        return {
            "current_kwh": 450,
            "saving_percent": 24,
            "monthly_saving_usd": 87,
            "trend": -8.2
        }

    current = data.data[0]["value"]
    previous = data.data[1]["value"]
    saving_percent = round(((previous - current) / previous) * 100, 1)
    trend = round(((current - previous) / previous) * 100, 1)

    return {
        "current_kwh": current,
        "saving_percent": saving_percent,
        "monthly_saving_usd": round(saving_percent * 3.6, 0),
        "trend": trend
    }


@router.post("/devices")
def update_device(device_key: str, is_on: bool):
    result = supabase.table("devices").update({
        "is_on": is_on,
        "updated_at": "now()"
    }).eq("key", device_key).execute()
    return {"success": True, "data": result.data}


@router.get("/devices")
def get_devices():
    result = supabase.table("devices").select("*").execute()
    devices = {row["key"]: row["is_on"] for row in result.data}
    return devices