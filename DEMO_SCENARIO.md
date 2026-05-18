# 🌱 EcoAI Energy Platform — Demo Ssenarisi

> **Məqsəd:** Mövcud API endpoint-lərini addım-addım nümayiş etdirmək  
> **Müddət:** ~10 dəqiqə  
> **Tələb:** Python 3.10+, Node.js 18+

---

## ⚙️ Addım 0 — Hazırlıq

```bash
cd backend
pip install fastapi uvicorn

cd ../frontend
npm install
```

---

## 🚀 Addım 1 — Backend-i işə sal

```bash
cd backend
uvicorn main:app --reload
```

**Gözlənilən nəticə:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Yoxlama:**
```
GET http://localhost:8000/
```
```json
{ "status": "EcoAI Backend işləyir" }
```

> 🔗 Swagger UI: **http://localhost:8000/docs**

---

## ⚡ Addım 2 — Enerji Datasını Göstər (`/api/energy`)

### 2a. Dashboard statistikası
```
GET http://localhost:8000/api/energy/dashboard
```
```json
{
  "current_kwh": 450,
  "saving_percent": 24,
  "monthly_saving_usd": 87,
  "trend": -8.2
}
```
> 📌 Cari istehlak **450 kWh**, **24%** qənaət, aylıq **$87** qənaət

---

### 2b. Aylıq enerji qrafiki
```
GET http://localhost:8000/api/energy/monthly
```
```json
{
  "actual":   [520, 498, 515, 540, 450, 418, 385, 360],
  "forecast": [360, 330, 302, 278, 255]
}
```
> 📈 **Actual** — keçmiş aylıq istehlak (kWh)  
> 📉 **Forecast** — AI proqnozu (istehlak azalır!)

---

### 2c. Cihaz statuslarını yoxla
```
GET http://localhost:8000/api/energy/devices
```
```json
{
  "livingLight": true,
  "bedroomLight": false,
  "heating": true,
  "airCon": false,
  "tv": true,
  "waterHeater": false,
  "coffee": false,
  "bedroomAc": false
}
```
> 🏠 Hansı cihazların **açıq/bağlı** olduğunu canlı göstər

---

### 2d. Cihazı uzaqdan idarə et
```
POST http://localhost:8000/api/energy/devices?device_key=airCon&is_on=true
```
```json
{ "success": true, "device": "airCon", "is_on": true }
```
> ❄️ **Demo effekti:** Kondisioneri API ilə birbaşa aç, sonra bağla

---

## 🤖 Addım 3 — AI Tövsiyə Sistemini Nümayiş et (`/api/ai`)

### 3a. AI tövsiyələrini əldə et
```
GET http://localhost:8000/api/ai/recommendations
```
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
    },
    {
      "id": "night",
      "title": "Gecə Cihazları Söndürün",
      "description": "Gözləmə rejimindəki cihazlar istehlakın 10%-ni tutur.",
      "saving": "~$12/ay",
      "priority": "Yüksək",
      "category": "İdman Rejimi"
    },
    {
      "id": "solar",
      "title": "Günəş Saatlarında Yükü Artırın",
      "description": "10:00–15:00 saatları arasında ağır cihazları istifadə et.",
      "saving": "~$9/ay",
      "priority": "Orta",
      "category": "Cədvəl"
    }
  ]
}
```

**3 tövsiyəni izah et:**

| # | Tövsiyə | Qənaət | Prioritet |
|---|---------|--------|-----------|
| 1 | Kondisioneri 28°C-yə apar | ~$18/ay | 🔴 Yüksək |
| 2 | Gecə cihazları söndür | ~$12/ay | 🔴 Yüksək |
| 3 | Günəş saatlarında yük artır | ~$9/ay | 🟡 Orta |

> 💡 Üçünü birlikdə tətbiq etsən: **~$39/ay** qənaət

---

### 3b. AI-dan sual sor
```
POST http://localhost:8000/api/ai/ask?question=Enerji qənaətini necə artıra bilərəm?
```
```json
{ "answer": "AI modulu aktivləşdirilməyib." }
```
> 🔧 Bu endpoint gələcək mərhələdə LLM ilə inteqrasiya ediləcək

---

## ♻️ Addım 4 — Karbon İzi Hesablamasını Nümayiş et (`/api/carbon`)

### 4a. Tək dəyərlə karbon hesabla
```
GET http://localhost:8000/api/carbon/calculate?kwh=450
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

**Canlı müqayisə — 3 ssenarini sına:**

```
GET /api/carbon/calculate?kwh=520   ← Pik ay (köhnə)
GET /api/carbon/calculate?kwh=450   ← Cari istehlak
GET /api/carbon/calculate?kwh=255   ← AI proqnozu (gələcək)
```

| Ssenarisi | kWh | CO₂ (kg) | Lazım olan ağac |
|-----------|-----|----------|-----------------|
| Pik ay    | 520 | 213.2    | 9.8 ağac        |
| İndi      | 450 | 184.5    | 8.5 ağac        |
| Proqnoz   | 255 | 104.6    | 4.8 ağac        |

> 📌 Əmsal: **0.41 kg CO₂/kWh** — Azərbaycan enerji şəbəkəsi

---

### 4b. Aylıq karbon xülasəsi
```
GET http://localhost:8000/api/carbon/monthly-summary
```
> ⚠️ Bu endpoint **Supabase** verilənlər bazası tələb edir.  
> DB qoşulmayıbsa, `/calculate` endpoint-i ilə manual nümayiş et.

---

## 🖥️ Addım 5 — Frontend Dashboard-u Aç

```bash
cd frontend
npm run dev
```

**Brauzerdə aç:** http://localhost:5173

Dashboard-da göstər:
- **EnergyChart** → `GET /api/energy/monthly` məlumatları qrafikdə
- **DashboardCards** → `GET /api/energy/dashboard` kartlarda
- **AIRecommendations** → `GET /api/ai/recommendations` paneldə
- **ControlPanel** → `POST /api/energy/devices` ilə cihaz aç/bağla

---

## 📊 Addım 6 — Nəticələri Xülasələ

| Göstərici | Dəyər |
|-----------|-------|
| Cari istehlak | 450 kWh |
| Qənaət faizi | **24%** |
| Aylıq qənaət | **$87** |
| Trend | **−8.2%** (azalır ✅) |
| Cari CO₂ | 184.5 kg |
| AI proqnozu (son ay) | 255 kWh |
| Proqnoz CO₂ | 104.6 kg |
| AI tövsiyələri ilə potensial qənaət | **~$39/ay** |

---

## 🔗 Faydalı Linklər

| Resurs | URL |
|--------|-----|
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| Backend | http://localhost:8000 |
| Frontend | http://localhost:5173 |

---

## 📁 Route Xəritəsi

| Fayl | Endpoint-lər |
|------|-------------|
| `routes/energy.py` | `GET /monthly`, `GET /dashboard`, `GET /devices`, `POST /devices` |
| `routes/ai.py` | `GET /recommendations`, `POST /ask` |
| `routes/carbon.py` | `GET /calculate`, `GET /monthly-summary` |

---

*EcoAI Energy Platform · 3-cü Üzv · Data & Prezentasiya · Bakı 2025*
