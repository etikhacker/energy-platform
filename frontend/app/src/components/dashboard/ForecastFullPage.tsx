import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Sun, CloudSun, Cloud, CloudRain, Wind, Droplets, TrendingUp, Battery, MapPin } from 'lucide-react';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

interface DayForecast {
  gun: string;
  gunesh: number;
  istifade: number;
  temp: number;
  hava: string;
  humidity: number;
}

interface HourForecast {
  saat: string;
  gunesh: number;
  istifade: number;
}

const aylikQenat = [
  { ay: 'Yan', qenat: 42 }, { ay: 'Fev', qenat: 38 }, { ay: 'Mar', qenat: 61 },
  { ay: 'Apr', qenat: 72 }, { ay: 'May', qenat: 84 }, { ay: 'İyn', qenat: 98 },
  { ay: 'İyl', qenat: 105 }, { ay: 'Avq', qenat: 101 }, { ay: 'Sep', qenat: 79 },
  { ay: 'Okt', qenat: 63 }, { ay: 'Noy', qenat: 44 }, { ay: 'Dek', qenat: 35 },
];

const gunAdlari = ['Baz', 'Baz.e', 'Car.a', 'Car', 'Cum.a', 'Cum', 'Şən'];

function getHavaType(weatherId: number): string {
  if (weatherId >= 200 && weatherId < 600) return 'rainy';
  if (weatherId >= 600 && weatherId < 800) return 'cloudy';
  if (weatherId === 800) return 'sunny';
  if (weatherId <= 802) return 'partly';
  return 'cloudy';
}

function getSunPower(temp: number, hava: string): number {
  const base = hava === 'sunny' ? 6 : hava === 'partly' ? 4 : hava === 'cloudy' ? 2 : 1;
  return parseFloat((base + (temp - 20) * 0.1).toFixed(1));
}

function HavaIcon({ hava, size = 20 }: { hava: string; size?: number }) {
  const style = { width: size, height: size };
  if (hava === 'sunny')  return <Sun style={{ ...style, color: '#e9d8a6' }} />;
  if (hava === 'partly') return <CloudSun style={{ ...style, color: '#e9d8a6' }} />;
  if (hava === 'cloudy') return <Cloud style={{ ...style, color: '#94d2bd' }} />;
  if (hava === 'rainy')  return <CloudRain style={{ ...style, color: '#94d2bd' }} />;
  return <Sun style={{ ...style, color: '#e9d8a6' }} />;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { color: string; name: string; value: number }[]; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div style={{ padding: 12, background: 'rgba(0,42,53,0.95)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8 }}>
      <p style={{ fontSize: 11, marginBottom: 8, color: 'rgba(255,255,255,0.55)' }}>{label}</p>
      {payload.map((e, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{e.name}:</span>
          <span style={{ fontSize: 12, color: '#fff', fontFamily: 'JetBrains Mono' }}>{e.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ForecastFullPage() {
  const [haftelik, setHaftelik] = useState<DayForecast[]>([]);
  const [saatlik, setSaatlik] = useState<HourForecast[]>([]);
  const [currentWeather, setCurrentWeather] = useState({ temp: 26, desc: 'Günəşli', wind: 12, humidity: 60, hava: 'sunny' });
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(true);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    const fetchWithCoords = async (lat: number, lon: number) => {
      // Cari hava
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const current = await currentRes.json();
      const havaType = getHavaType(current.weather[0].id);

      setCityName(current.name);
      setCurrentWeather({
        temp: Math.round(current.main.temp),
        desc: havaType === 'sunny' ? 'Günəşli' : havaType === 'partly' ? 'Az Bulud' : havaType === 'cloudy' ? 'Bulud' : 'Yağışlı',
        wind: Math.round(current.wind.speed),
        humidity: current.main.humidity,
        hava: havaType,
      });

      // 5 günlük proqnoz
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const forecast = await forecastRes.json();

      // Saatlıq
      const hourly: HourForecast[] = forecast.list.slice(0, 15).map((item: { dt: number; main: { temp: number }; weather: { id: number }[] }) => {
        const d = new Date(item.dt * 1000);
        const h = d.getHours().toString().padStart(2, '0');
        const hT = getHavaType(item.weather[0].id);
        return {
          saat: `${h}:00`,
          gunesh: getSunPower(item.main.temp, hT),
          istifade: parseFloat((2.5 + Math.random() * 1.5).toFixed(1)),
        };
      });
      setSaatlik(hourly);

      // Günlük
      const gunlukMap: { [key: string]: { temps: number[]; ids: number[]; humidity: number[] } } = {};
      forecast.list.forEach((item: { dt: number; main: { temp: number; humidity: number }; weather: { id: number }[] }) => {
        const key = new Date(item.dt * 1000).toDateString();
        if (!gunlukMap[key]) gunlukMap[key] = { temps: [], ids: [], humidity: [] };
        gunlukMap[key].temps.push(item.main.temp);
        gunlukMap[key].ids.push(item.weather[0].id);
        gunlukMap[key].humidity.push(item.main.humidity);
      });

      const days: DayForecast[] = Object.entries(gunlukMap).slice(0, 7).map(([dateStr, data], i) => {
        const d = new Date(dateStr);
        const avgTemp = Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length);
        const mainId = data.ids[Math.floor(data.ids.length / 2)];
        const hT = getHavaType(mainId);
        return {
          gun: i === 0 ? 'Bu gün' : i === 1 ? 'Sabah' : gunAdlari[d.getDay()],
          temp: avgTemp,
          hava: hT,
          gunesh: getSunPower(avgTemp, hT),
          istifade: parseFloat((20 + Math.random() * 8).toFixed(1)),
          humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
        };
      });
      setHaftelik(days);
    };

    const fetchWeather = async () => {
      try {
        // GPS ilə yer al
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
        );
        const { latitude: lat, longitude: lon } = pos.coords;
        await fetchWithCoords(lat, lon);
      } catch (geoErr) {
        // GPS rədd edilsə — Bakı koordinatları fallback
        setLocationError('GPS icazəsi verilmədi — Bakı üçün göstərilir');
        try {
          await fetchWithCoords(40.4093, 49.8671); // Bakı
        } catch {
          // API xətası — statik data
          setHaftelik([
            { gun: 'Bu gün', gunesh: 28.5, istifade: 22.3, temp: 24, hava: 'sunny', humidity: 55 },
            { gun: 'Sabah',  gunesh: 31.2, istifade: 24.1, temp: 26, hava: 'sunny', humidity: 50 },
            { gun: 'Car',    gunesh: 18.4, istifade: 23.5, temp: 21, hava: 'cloudy', humidity: 70 },
            { gun: 'Cum.a',  gunesh: 12.1, istifade: 25.0, temp: 19, hava: 'rainy', humidity: 85 },
            { gun: 'Cum',    gunesh: 22.8, istifade: 22.8, temp: 22, hava: 'partly', humidity: 65 },
            { gun: 'Şən',    gunesh: 35.2, istifade: 26.3, temp: 27, hava: 'sunny', humidity: 45 },
            { gun: 'Baz',    gunesh: 32.0, istifade: 24.5, temp: 25, hava: 'sunny', humidity: 48 },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const tomorrow = haftelik[1] || { gunesh: 31.2, temp: 26, hava: 'sunny' };
  const haftelikCem = haftelik.reduce((a, b) => a + b.gunesh, 0).toFixed(1);

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: 300 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="w-6 h-6 rounded-full border-2 animate-spin mx-auto mb-3" style={{ borderColor: '#2a9d8f', borderTopColor: 'transparent' }} />
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Hava məlumatları yüklənir...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Yer bildirişi */}
      {(cityName || locationError) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin style={{ width: 14, height: 14, color: locationError ? '#e9d8a6' : '#2a9d8f' }} />
          <span style={{ fontSize: 13, color: locationError ? 'rgba(233,216,166,0.7)' : 'rgba(255,255,255,0.5)' }}>
            {locationError || cityName}
          </span>
        </div>
      )}

      {/* Stat kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sun style={{ width: 16, height: 16, color: '#e9d8a6' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Sabah günəş</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#e9d8a6', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            {tomorrow.gunesh} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>kWh</span>
          </div>
          <span style={{ fontSize: 11, color: '#2a9d8f' }}>Pik: 11:00 - 14:00</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp style={{ width: 16, height: 16, color: '#2a9d8f' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Həftəlik proqnoz</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#2a9d8f', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            {haftelikCem} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>kWh</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>7 günlük cəm</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Battery style={{ width: 16, height: 16, color: '#94d2bd' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Proqnoz qənaəti</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#94d2bd', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            ${(parseFloat(haftelikCem) * 0.14).toFixed(1)} <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/ həftə</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Şəbəkəyə nisbətən</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Wind style={{ width: 16, height: 16, color: '#0a9396' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Cari hava</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            {currentWeather.temp}°C
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#e9d8a6' }}>{currentWeather.desc}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>· {currentWeather.wind} m/s</span>
          </div>
        </div>
      </div>

      {/* 7 günlük kartlar */}
      <div className="liquid-glass" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>7 Günlük Proqnoz</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {haftelik.map((g, i) => (
            <div key={i} style={{
              padding: 12,
              background: i === 0 ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)',
              borderRadius: 10,
              border: `1px solid ${i === 0 ? 'rgba(42,157,143,0.25)' : 'rgba(255,255,255,0.06)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 11, color: i === 0 ? '#2a9d8f' : 'rgba(255,255,255,0.5)' }}>{g.gun}</span>
              <HavaIcon hava={g.hava} size={22} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{g.temp}°</span>
              <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <Sun style={{ width: 10, height: 10, color: '#e9d8a6' }} />
                  <span style={{ fontSize: 10, color: '#e9d8a6', fontFamily: 'JetBrains Mono' }}>{g.gunesh}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                  <Droplets style={{ width: 10, height: 10, color: '#94d2bd' }} />
                  <span style={{ fontSize: 10, color: '#94d2bd', fontFamily: 'JetBrains Mono' }}>{g.humidity}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Qrafiklər */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>Sabah Saatlıq Proqnoz</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={saatlik} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="fpGunesh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e9d8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e9d8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fpIstifade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="saat" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} interval={2} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="gunesh" name="Günəş (kW)" stroke="#e9d8a6" strokeWidth={1.5} fill="url(#fpGunesh)" dot={false} />
              <Area type="monotone" dataKey="istifade" name="İstifadə (kW)" stroke="#e63946" strokeWidth={1.5} fill="url(#fpIstifade)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>Aylıq Qənaət Proqnozu</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={aylikQenat} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="ay" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`$${v}`, 'Qənaət']} contentStyle={{ background: 'rgba(0,42,53,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 12, color: '#fff' }} />
              <Bar dataKey="qenat" fill="#2a9d8f" opacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}