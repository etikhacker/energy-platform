# 🌱 EcoAI Energy Platform

> AI əsaslı enerji qənaət və karbon izi monitorinq sistemi

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

---

## 📌 Layihə Haqqında

**EcoAI Energy Platform** — evdəki enerji istehlakını real-vaxtda izləyən, AI tövsiyələri ilə optimallaşdıran və karbon izini hesablayan platformdur.

### Problem
- Ev cihazlarının enerji istehlakı izlənilmir
- Karbon izi hesablanmır
- İstifadəçilər qənaət üçün nə edəcəklərini bilmirlər

### Həll
- **Dashboard** ilə cari istehlak və trend
- **AI tövsiyə motoru** ilə aylıq $39 qənaət potensialı
- **Karbon kalkulyatoru** ilə CO₂ izlənməsi
- **Cihaz idarəetməsi** ilə uzaqdan açıb/bağlama

### Nəticə
- ✅ **24%** enerji qənaəti əldə edilir
- 📉 Trend: **−8.2%** (azalma davam edir)
- 💰 Aylıq **$87** qənaət
- ♻️ AI proqnozu ilə CO₂: **184 kg → 104 kg**

---

## 🗂️ Layihə Strukturu

```
ENERGY-PLATFORM/
├── backend/
│   ├── routes/
│   │   ├── energy.py               # Enerji endpoint-ləri
│   │   ├── ai.py                   # AI tövsiyə endpoint-ləri
│   │   └── carbon.py               # Karbon hesablama endpoint-ləri
│   ├── main.py                     # FastAPI əsas fayl
│   ├── database.py                 # Supabase verilənlər bazası
│   ├── schema.sql                  # DB sxemi
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── EnergyChart.tsx
│       │   ├── DashboardCards.tsx
│       │   ├── AIRecommendations.tsx
│       │   ├── ControlPanel.tsx
│       │   └── Sidebar.tsx
│       ├── App.tsx
│       └── main.tsx
├── DEMO_SCENARIO.md
└── README.md
```

---

## ⚙️ Quraşdırma

### Tələblər
- Python 3.10+
- Node.js 18+

### Backend
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 İstifadə

| Servis | URL |
|--------|-----|
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Frontend | http://localhost:5173 |

---

## 📡 API Endpoint-lər

### Enerji — `routes/energy.py`

| Metod | Endpoint | Təsvir |
|-------|----------|--------|
| GET | `/api/energy/dashboard` | Cari istehlak, qənaət faizi, trend |
| GET | `/api/energy/monthly` | Aylıq istehlak + AI proqnozu |
| GET | `/api/energy/devices` | Bütün cihazların açıq/bağlı statusu |
| POST | `/api/energy/devices` | Cihazı uzaqdan aç/bağla |

**Dashboard nümunəsi:**
```json
{
  "current_kwh": 450,
  "saving_percent": 24,
  "monthly_saving_usd": 87,
  "trend": -8.2
}
```

**Cihaz idarəetməsi:**
```
POST /api/energy/devices?device_key=airCon&is_on=true
```
Mövcud cihazlar: `livingLight`, `bedroomLight`, `heating`, `airCon`, `tv`, `waterHeater`, `coffee`, `bedroomAc`

---

### AI Tövsiyə — `routes/ai.py`

| Metod | Endpoint | Təsvir |
|-------|----------|--------|
| GET | `/api/ai/recommendations` | 3 prioritet tövsiyə |
| POST | `/api/ai/ask` | AI-dan sual sor |

**Tövsiyə nümunəsi:**
```json
{
  "recommendations": [
    {
      "id": "ac",
      "title": "Kondisioner Rejimini Optimallaşdırın",
      "description": "26°C əvəzinə 28°C ayarlayın — hər dərəcə 6% qənaət.",
      "saving": "~$18/ay",
      "priority": "Yüksək",
      "category": "İstilik/Soyutma"
    }
  ]
}
```

| Tövsiyə | Qənaət | Prioritet |
|---------|--------|-----------|
| Kondisioneri 28°C-yə apar | ~$18/ay | 🔴 Yüksək |
| Gecə cihazları söndür | ~$12/ay | 🔴 Yüksək |
| Günəş saatlarında yük artır | ~$9/ay | 🟡 Orta |

---

### Karbon İzi — `routes/carbon.py`

| Metod | Endpoint | Təsvir |
|-------|----------|--------|
| GET | `/api/carbon/calculate?kwh=450` | kWh-dən CO₂ hesabla |
| GET | `/api/carbon/monthly-summary` | Aylıq karbon xülasəsi (DB tələb edir) |

**Karbon hesablama nümunəsi:**
```
GET /api/carbon/calculate?kwh=450
```
```json
{
  "kwh": 450,
  "co2_kg": 184.5,
  "co2_tonnes": 0.185,
  "trees_needed": 8.5,
  "equivalent": "8.5 ağac əkməklə kompensasiya edilə bilər"
}
```

---

## 🔬 Karbon Hesablama Metodologiyası

```
CO₂ (kg) = kWh × 0.41
```

| Parametr | Dəyər | Məlumat |
|----------|-------|---------|
| CO₂ əmsalı | **0.41 kg/kWh** | Azərbaycan enerji şəbəkəsi |
| Ağac udma | **21.7 kg CO₂/il** | 1 ağac, 1 il |

**Ssenarilər:**

| Ssenarisi | kWh | CO₂ (kg) | Ağac |
|-----------|-----|----------|------|
| Pik ay | 520 | 213.2 | 9.8 |
| Cari | 450 | 184.5 | 8.5 |
| AI proqnozu | 255 | 104.6 | 4.8 |

---

## 🤖 AI Haqqında

`/api/ai/recommendations` endpoint-i 3 prioritet tövsiyə qaytarır:

- **Kondisioner** — temperatur optimallaşdırması (İstilik/Soyutma)
- **Gecə rejimi** — gözləmə cihazlarının söndürülməsi
- **Günəş cədvəli** — 10:00–15:00 arası ağır cihazların istifadəsi

`/api/ai/ask` endpoint-i gələcəkdə LLM ilə inteqrasiya ediləcək.

---

## 👥 3-cü Üzv — Məsuliyyət Sahəsi

**Data & Prezentasiya** hissəsi:

- [x] Mock sensor datasının hazırlanması (JSON formatda)
- [x] Karbon izi hesablama formullarının araşdırılması
- [x] Prezentasiya slaydlarının hazırlanması (15 slayd)
- [x] Demo ssenarisinin yazılması
- [x] README və layihə təsviri

---

## 📄 Lisenziya

MIT License © 2025 EcoAI Team — Bakı, Azərbaycan
