"""
carbon_calculator.py
AI Əsaslı Enerji Qənaət Platforması — Karbon İzi Hesablama Modulu

Mənbələr:
  - Elektrik istehlakı (şəbəkə)
  - HVAC / Kondisioner
  - Günəş paneli (qənaət / kompensasiya)

Əmsallar (emission factors):
  - Azərbaycan şəbəkəsi: 0.5 kg CO2 / kWh  (IEA 2023)
  - HVAC: 0.5 kg CO2 / kWh (eyni şəbəkə əmsalı)
  - Günəş paneli: 0.05 kg CO2 / kWh (istehsal + quraşdırma amortizasiyası)
"""

from dataclasses import dataclass
from typing import Optional
from data_loader import get_daily_readings, get_monthly_summary


# ──────────────────────────────────────────────
# Sabitlər
# ──────────────────────────────────────────────

GRID_EMISSION_FACTOR = 0.5        # kg CO2 / kWh — Azərbaycan şəbəkəsi
HVAC_EMISSION_FACTOR = 0.5        # kg CO2 / kWh — HVAC şəbəkədən qidalanır
SOLAR_LIFECYCLE_FACTOR = 0.05     # kg CO2 / kWh — panel istehsal amortizasiyası
SOLAR_GRID_OFFSET_FACTOR = 0.5    # kg CO2 / kWh — hər qənaət edilən kWh üçün
TREE_ABSORPTION_KG_PER_YEAR = 21  # 1 ağac / il CO2 udması (kg)


# ──────────────────────────────────────────────
# Nəticə strukturu
# ──────────────────────────────────────────────

@dataclass
class CarbonResult:
    electricity_kg: float       # Elektrik istehlakından karbon
    hvac_kg: float              # HVAC-dan karbon
    solar_lifecycle_kg: float   # Günəş panelinin öz karbon izi
    solar_offset_kg: float      # Günəş panelinin şəbəkəyə qənaəti
    net_carbon_kg: float        # Xalis karbon (emissiya - qənaət)
    equivalent_trees: float     # Kompensasiya üçün lazım olan ağac sayı

    def to_dict(self) -> dict:
        return {
            "electricity_kg":     round(self.electricity_kg, 2),
            "hvac_kg":            round(self.hvac_kg, 2),
            "solar_lifecycle_kg": round(self.solar_lifecycle_kg, 2),
            "solar_offset_kg":    round(self.solar_offset_kg, 2),
            "net_carbon_kg":      round(self.net_carbon_kg, 2),
            "equivalent_trees":   round(self.equivalent_trees, 1),
        }


# ──────────────────────────────────────────────
# Əsas hesablama funksiyaları
# ──────────────────────────────────────────────

def calc_electricity_carbon(kwh: float) -> float:
    """Elektrik istehlakından karbon emissiyası."""
    return kwh * GRID_EMISSION_FACTOR


def calc_hvac_carbon(kwh: float) -> float:
    """HVAC istehlakından karbon emissiyası."""
    return kwh * HVAC_EMISSION_FACTOR


def calc_solar_lifecycle_carbon(kwh: float) -> float:
    """Günəş panelinin öz karbon izi (amortizasiya)."""
    return kwh * SOLAR_LIFECYCLE_FACTOR


def calc_solar_offset(kwh: float) -> float:
    """Günəş panelinin şəbəkəyə qarşı kompensasiyası."""
    return kwh * SOLAR_GRID_OFFSET_FACTOR


def calc_net_carbon(
    electricity_kwh: float,
    hvac_kwh: float,
    solar_kwh: float,
) -> CarbonResult:
    """
    Tam karbon balansını hesablayır.

    Parametrlər:
        electricity_kwh: Ümumi elektrik istehlakı
        hvac_kwh:        HVAC istehlakı (electricity_kwh daxilindədir,
                         lakin ayrıca izlənir)
        solar_kwh:       Günəş panelinin istehsal etdiyi enerji

    Qeyd: HVAC electricity_kwh-in bir hissəsidir,
          ona görə ikiqat sayılmaması üçün net elektrik = electricity - hvac
    """
    net_elec_kwh = max(electricity_kwh - hvac_kwh, 0)

    elec_carbon   = calc_electricity_carbon(net_elec_kwh)
    hvac_carbon   = calc_hvac_carbon(hvac_kwh)
    solar_lc      = calc_solar_lifecycle_carbon(solar_kwh)
    solar_offset  = calc_solar_offset(solar_kwh)

    gross_carbon  = elec_carbon + hvac_carbon + solar_lc
    net_carbon    = gross_carbon - solar_offset
    trees_needed  = max(net_carbon, 0) / TREE_ABSORPTION_KG_PER_YEAR

    return CarbonResult(
        electricity_kg=elec_carbon,
        hvac_kg=hvac_carbon,
        solar_lifecycle_kg=solar_lc,
        solar_offset_kg=solar_offset,
        net_carbon_kg=net_carbon,
        equivalent_trees=trees_needed,
    )


# ──────────────────────────────────────────────
# Data loader ilə inteqrasiya
# ──────────────────────────────────────────────

def calculate_daily_carbon(date: str) -> Optional[dict]:
    """
    Müəyyən tarix üçün karbon hesabı.
    date formatı: 'YYYY-MM-DD'
    """
    readings = get_daily_readings()
    for r in readings:
        if r["date"] == date:
            elec  = r["readings"]["ELEC-001"]["value"]
            hvac  = r["readings"]["HVAC-001"]["value"]
            solar = r["readings"]["SOLAR-001"]["value"]
            result = calc_net_carbon(elec, hvac, solar)
            return {
                "date": date,
                "inputs": {
                    "electricity_kwh": elec,
                    "hvac_kwh": hvac,
                    "solar_kwh": solar,
                },
                "carbon": result.to_dict(),
            }
    return None


def calculate_all_days_carbon() -> list:
    """Bütün 30 günün karbon hesabı."""
    readings = get_daily_readings()
    results = []
    for r in readings:
        elec  = r["readings"]["ELEC-001"]["value"]
        hvac  = r["readings"]["HVAC-001"]["value"]
        solar = r["readings"]["SOLAR-001"]["value"]
        result = calc_net_carbon(elec, hvac, solar)
        results.append({
            "date": r["date"],
            "is_working_day": r["is_working_day"],
            "occupancy_rate": r["occupancy_rate"],
            "inputs": {
                "electricity_kwh": elec,
                "hvac_kwh": hvac,
                "solar_kwh": solar,
            },
            "carbon": result.to_dict(),
        })
    return results


def calculate_monthly_carbon() -> dict:
    """Aylıq ümumi karbon balansı."""
    all_days = calculate_all_days_carbon()

    total_elec_carbon  = sum(d["carbon"]["electricity_kg"]     for d in all_days)
    total_hvac_carbon  = sum(d["carbon"]["hvac_kg"]            for d in all_days)
    total_solar_lc     = sum(d["carbon"]["solar_lifecycle_kg"] for d in all_days)
    total_solar_offset = sum(d["carbon"]["solar_offset_kg"]    for d in all_days)
    total_net          = sum(d["carbon"]["net_carbon_kg"]       for d in all_days)
    total_trees        = max(total_net, 0) / TREE_ABSORPTION_KG_PER_YEAR

    best_day  = min(all_days, key=lambda d: d["carbon"]["net_carbon_kg"])
    worst_day = max(all_days, key=lambda d: d["carbon"]["net_carbon_kg"])

    return {
        "period": "2025-04-01 / 2025-04-30",
        "totals": {
            "electricity_carbon_kg":  round(total_elec_carbon, 2),
            "hvac_carbon_kg":         round(total_hvac_carbon, 2),
            "solar_lifecycle_kg":     round(total_solar_lc, 2),
            "solar_offset_kg":        round(total_solar_offset, 2),
            "net_carbon_kg":          round(total_net, 2),
            "equivalent_trees_year":  round(total_trees, 1),
        },
        "best_day":  {"date": best_day["date"],  "net_carbon_kg": best_day["carbon"]["net_carbon_kg"]},
        "worst_day": {"date": worst_day["date"], "net_carbon_kg": worst_day["carbon"]["net_carbon_kg"]},
        "emission_factors_used": {
            "grid_kg_per_kwh":          GRID_EMISSION_FACTOR,
            "hvac_kg_per_kwh":          HVAC_EMISSION_FACTOR,
            "solar_lifecycle_kg_per_kwh": SOLAR_LIFECYCLE_FACTOR,
            "solar_offset_kg_per_kwh":  SOLAR_GRID_OFFSET_FACTOR,
        },
    }


# ──────────────────────────────────────────────
# Test
# ──────────────────────────────────────────────

if __name__ == "__main__":
    import json

    print("=== 2025-04-08 (xəbərdarlıq günü) ===")
    print(json.dumps(calculate_daily_carbon("2025-04-08"), ensure_ascii=False, indent=2))

    print("\n=== Aylıq Karbon Balansı ===")
    print(json.dumps(calculate_monthly_carbon(), ensure_ascii=False, indent=2))

    print("\n=== İlk 5 günün karbon cədvəli ===")
    for day in calculate_all_days_carbon()[:5]:
        print(f"{day['date']} | Net: {day['carbon']['net_carbon_kg']} kg CO2 "
              f"| Günəş qənaəti: {day['carbon']['solar_offset_kg']} kg")
