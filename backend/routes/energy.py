from fastapi import APIRouter

router = APIRouter()

@router.get("/monthly")
def get_monthly_data():
    return {
        "actual": [520, 498, 515, 540, 450, 418, 385, 360],
        "forecast": [360, 330, 302, 278, 255]
    }

@router.get("/dashboard")
def get_dashboard_stats():
    return {
        "current_kwh": 450,
        "saving_percent": 24,
        "monthly_saving_usd": 87,
        "trend": -8.2
    }

@router.post("/devices")
def update_device(device_key: str, is_on: bool):
    return {"success": True, "device": device_key, "is_on": is_on}

@router.get("/devices")
def get_devices():
    return {
        "livingLight": True,
        "bedroomLight": False,
        "heating": True,
        "airCon": False,
        "tv": True,
        "waterHeater": False,
        "coffee": False,
        "bedroomAc": False
    }