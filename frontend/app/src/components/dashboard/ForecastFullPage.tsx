import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Sun, CloudSun, Cloud, CloudRain, Wind, Droplets, TrendingUp, Battery } from 'lucide-react';

const haftelikProqnoz = [
  { gun: 'Baz.e', gunesh: 28.5, istifade: 22.3, temp: 24, hava: 'sunny' },
  { gun: 'Car.a', gunesh: 31.2, istifade: 24.1, temp: 26, hava: 'sunny' },
  { gun: 'Car',   gunesh: 18.4, istifade: 23.5, temp: 21, hava: 'cloudy' },
  { gun: 'Cum.a', gunesh: 12.1, istifade: 25.0, temp: 19, hava: 'rainy' },
  { gun: 'Cum',   gunesh: 22.8, istifade: 22.8, temp: 22, hava: 'partly' },
  { gun: 'Sen',   gunesh: 35.2, istifade: 26.3, temp: 27, hava: 'sunny' },
  { gun: 'Baz',   gunesh: 32.0, istifade: 24.5, temp: 25, hava: 'sunny' },
];

const gunlukSaatlar = [
  { saat: '06:00', gunesh: 0.5,  istifade: 1.2 },
  { saat: '07:00', gunesh: 1.8,  istifade: 2.1 },
  { saat: '08:00', gunesh: 3.2,  istifade: 2.8 },
  { saat: '09:00', gunesh: 4.5,  istifade: 3.0 },
  { saat: '10:00', gunesh: 5.8,  istifade: 3.2 },
  { saat: '11:00', gunesh: 6.2,  istifade: 3.4 },
  { saat: '12:00', gunesh: 5.9,  istifade: 3.1 },
  { saat: '13:00', gunesh: 5.4,  istifade: 2.9 },
  { saat: '14:00', gunesh: 5.0,  istifade: 3.0 },
  { saat: '15:00', gunesh: 4.1,  istifade: 3.3 },
  { saat: '16:00', gunesh: 3.0,  istifade: 3.6 },
  { saat: '17:00', gunesh: 1.8,  istifade: 3.8 },
  { saat: '18:00', gunesh: 0.5,  istifade: 4.2 },
  { saat: '19:00', gunesh: 0.0,  istifade: 3.9 },
  { saat: '20:00', gunesh: 0.0,  istifade: 3.2 },
];

const aylikQenat = [
  { ay: 'Yan', qenat: 42 },
  { ay: 'Fev', qenat: 38 },
  { ay: 'Mar', qenat: 61 },
  { ay: 'Apr', qenat: 72 },
  { ay: 'May', qenat: 84 },
  { ay: 'İyn', qenat: 98 },
  { ay: 'İyl', qenat: 105 },
  { ay: 'Avq', qenat: 101 },
  { ay: 'Sep', qenat: 79 },
  { ay: 'Okt', qenat: 63 },
  { ay: 'Noy', qenat: 44 },
  { ay: 'Dek', qenat: 35 },
];

function HavaIcon({ hava, size = 20 }: { hava: string; size?: number }) {
  const style = { width: size, height: size };
  if (hava === 'sunny')  return <Sun style={{ ...style, color: '#e9d8a6' }} />;
  if (hava === 'partly') return <CloudSun style={{ ...style, color: '#e9d8a6' }} />;
  if (hava === 'cloudy') return <Cloud style={{ ...style, color: '#94d2bd' }} />;
  if (hava === 'rainy')  return <CloudRain style={{ ...style, color: '#94d2bd' }} />;
  return <Sun style={{ ...style, color: '#e9d8a6' }} />;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div style={{
      padding: 12,
      background: 'rgba(0,42,53,0.95)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 8,
    }}>
      <p style={{ fontSize: 11, marginBottom: 8, color: 'rgba(255,255,255,0.55)' }}>{label}</p>
      {payload.map((e: any, i: number) => (
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
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Yuxarı stat kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Sun style={{ width: 16, height: 16, color: '#e9d8a6' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Sabah günəş</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#e9d8a6', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            31.2 <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>kWh</span>
          </div>
          <span style={{ fontSize: 11, color: '#2a9d8f' }}>Pik: 11:00 - 14:00</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp style={{ width: 16, height: 16, color: '#2a9d8f' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Həftəlik proqnoz</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#2a9d8f', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            180.2 <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>kWh</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>7 günlük cəm</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Battery style={{ width: 16, height: 16, color: '#94d2bd' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Proqnoz qənaəti</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#94d2bd', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            $24.6 <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/ həftə</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Şəbəkəyə nisbətən</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Wind style={{ width: 16, height: 16, color: '#0a9396' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Sabah hava</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            26°C
          </div>
          <span style={{ fontSize: 11, color: '#e9d8a6' }}>Günəşli · Küləksiz</span>
        </div>
      </div>

      {/* 7 günlük hava proqnozu kartları */}
      <div className="liquid-glass" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>
          7 Günlük Proqnoz
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
          {haftelikProqnoz.map((g, i) => (
            <div key={i} style={{
              padding: 12,
              background: i === 1 ? 'rgba(42,157,143,0.12)' : 'rgba(255,255,255,0.04)',
              borderRadius: 10,
              border: `1px solid ${i === 1 ? 'rgba(42,157,143,0.25)' : 'rgba(255,255,255,0.06)'}`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 11, color: i === 1 ? '#2a9d8f' : 'rgba(255,255,255,0.5)' }}>{g.gun}</span>
              <HavaIcon hava={g.hava} size={22} />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{g.temp}°</span>
              <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center' }}>
                  <Sun style={{ width: 10, height: 10, color: '#e9d8a6' }} />
                  <span style={{ fontSize: 10, color: '#e9d8a6', fontFamily: 'JetBrains Mono' }}>{g.gunesh}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                  <Droplets style={{ width: 10, height: 10, color: '#94d2bd' }} />
                  <span style={{ fontSize: 10, color: '#94d2bd', fontFamily: 'JetBrains Mono' }}>{g.istifade}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Günlük saatlıq proqnoz + Aylıq qənaət */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>
            Sabah Saatlıq Proqnoz
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={gunlukSaatlar} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
              <XAxis dataKey="saat" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} interval={2} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="gunesh" name="Günəş (kW)" stroke="#e9d8a6" strokeWidth={1.5} fill="url(#fpGunesh)" dot={false} activeDot={{ r: 4, fill: '#e9d8a6', stroke: 'transparent' }} />
              <Area type="monotone" dataKey="istifade" name="İstifadə (kW)" stroke="#e63946" strokeWidth={1.5} fill="url(#fpIstifade)" dot={false} activeDot={{ r: 4, fill: '#e63946', stroke: 'transparent' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>
            Aylıq Qənaət Proqnozu
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={aylikQenat} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="ay" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v: any) => [`$${v}`, 'Qənaət']}
                contentStyle={{ background: 'rgba(0,42,53,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 12, color: '#fff' }}
              />
              <Bar dataKey="qenat" fill="#2a9d8f" opacity={0.8} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}