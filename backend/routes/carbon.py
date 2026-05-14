from fastapi import APIRouter

router = APIRouter()

# Azərbaycan enerji şəbəkəsi üçün ortalama CO2 əmsalı
AZ_CO2_FACTOR = 0.41  # kq CO2 / kWh

@router.get("/calculate")
def calculate_carbon(kwh: float):
    co2_kg = round(kwh * AZ_CO2_FACTOR, 2)
    co2_tonnes = round(co2_kg / 1000, 3)
    trees_needed = round(co2_kg / 21.7, 1)  # 1 ağac/il = 21.7 kq CO2

    return {
        "kwh": kwh,
        "co2_kg": co2_kg,
        "co2_tonnes": co2_tonnes,
        "trees_needed": trees_needed,
        "equivalent": f"{trees_needed} ağac əkməklə kompensasiya edilə bilər"
    }

@router.get("/monthly-summary")
def monthly_carbon_summary():
    from database import supabase
    data = supabase.table("energy_readings").select("*").where("type", "eq", "actual").execute()

    summary = []
    for row in data.data:
        co2 = round(row["value"] * AZ_CO2_FACTOR, 1)
        summary.append({
            "month": row["month"],
            "kwh": row["value"],
            "co2_kg": co2
        })

    total_co2 = sum(r["co2_kg"] for r in summary)
    return {
        "monthly": summary,
        "total_co2_kg": round(total_co2, 1),
        "total_co2_tonnes": round(total_co2 / 1000, 2)
    }
