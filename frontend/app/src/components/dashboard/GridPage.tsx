import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from 'recharts';
import { Activity, Wifi, Zap, TrendingUp, AlertTriangle } from 'lucide-react';

const gridFlowData = [
  { time: '12:00', verilir: 2.1, alinir: 0.0 },
  { time: '12:30', verilir: 3.4, alinir: 0.0 },
  { time: '13:00', verilir: 4.2, alinir: 0.0 },
  { time: '13:30', verilir: 3.8, alinir: 0.0 },
  { time: '14:00', verilir: 2.9, alinir: 0.0 },
  { time: '14:30', verilir: 1.5, alinir: 0.0 },
  { time: '15:00', verilir: 0.8, alinir: 0.2 },
  { time: '15:30', verilir: 0.0, alinir: 1.1 },
  { time: '16:00', verilir: 0.0, alinir: 2.3 },
  { time: '16:30', verilir: 0.0, alinir: 3.0 },
  { time: '17:00', verilir: 0.0, alinir: 3.8 },
  { time: '17:30', verilir: 0.0, alinir: 4.2 },
];

const fazaData = [
  { faza: 'L1', gərginlik: 229, cərəyan: 14.2, güc: 3.25 },
  { faza: 'L2', gərginlik: 231, cərəyan: 12.8, güc: 2.96 },
  { faza: 'L3', gərginlik: 228, cərəyan: 15.1, güc: 3.44 },
];

const qualityData = [
  { saat: '00', keyfiyyət: 98 },
  { saat: '03', keyfiyyət: 97 },
  { saat: '06', keyfiyyət: 99 },
  { saat: '09', keyfiyyət: 95 },
  { saat: '12', keyfiyyət: 92 },
  { saat: '15', keyfiyyət: 94 },
  { saat: '18', keyfiyyət: 91 },
  { saat: '21', keyfiyyət: 96 },
];

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

export default function GridPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Status kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Wifi style={{ width: 16, height: 16, color: '#2a9d8f' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Şəbəkə Statusu</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2a9d8f', boxShadow: '0 0 8px #2a9d8f' }} />
            <span style={{ fontSize: 20, fontWeight: 600, color: '#fff' }}>Bağlı</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Son yenilənmə: 17:32</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Zap style={{ width: 16, height: 16, color: '#e9d8a6' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Gərginlik</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#e9d8a6', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            229.4 <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>V</span>
          </div>
          <span style={{ fontSize: 11, color: '#2a9d8f' }}>Normal hədd</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Activity style={{ width: 16, height: 16, color: '#94d2bd' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Tezlik</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#94d2bd', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            49.98 <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Hz</span>
          </div>
          <span style={{ fontSize: 11, color: '#2a9d8f' }}>Sabit</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <TrendingUp style={{ width: 16, height: 16, color: '#2a9d8f' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Şəbəkəyə verilən</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#2a9d8f', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            18.7 <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>kWh</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Bu gün</span>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <AlertTriangle style={{ width: 16, height: 16, color: '#e63946' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Şəbəkədən alınan</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: '#e63946', fontFamily: 'JetBrains Mono', marginBottom: 4 }}>
            4.2 <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>kWh</span>
          </div>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Bu gün</span>
        </div>
      </div>

      {/* Axın qrafiği + Keyfiyyət */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>Şəbəkə Enerji Axını</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={gridFlowData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="verilirGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2a9d8f" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#2a9d8f" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="alinirGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e63946" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="time" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="verilir" name="Verilən (kW)" stroke="#2a9d8f" strokeWidth={1.5} fill="url(#verilirGrad)" dot={false} activeDot={{ r: 4, fill: '#2a9d8f', stroke: 'transparent' }} />
              <Area type="monotone" dataKey="alinir" name="Alınan (kW)" stroke="#e63946" strokeWidth={1.5} fill="url(#alinirGrad)" dot={false} activeDot={{ r: 4, fill: '#e63946', stroke: 'transparent' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>Şəbəkə Keyfiyyəti</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ position: 'relative', width: 100, height: 100 }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#2a9d8f" strokeWidth="8"
                  strokeDasharray={`${94 * 2.51} ${100 * 2.51}`}
                  strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 22, fontWeight: 700, color: '#fff', fontFamily: 'JetBrains Mono' }}>94%</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>keyfiyyət</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={qualityData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="saat" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis domain={[85, 100]} hide />
              <Bar dataKey="keyfiyyət" fill="#2a9d8f" opacity={0.7} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Faza balansı */}
      <div className="liquid-glass" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>Faza Balansı</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {fazaData.map((f, i) => {
            const colors = ['#e9d8a6', '#94d2bd', '#2a9d8f'];
            return (
              <div key={i} style={{
                padding: 16,
                background: 'rgba(255,255,255,0.04)',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: colors[i], fontFamily: 'JetBrains Mono' }}>{f.faza}</span>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i], boxShadow: `0 0 6px ${colors[i]}` }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Gərginlik</span>
                    <span style={{ fontSize: 12, color: '#fff', fontFamily: 'JetBrains Mono' }}>{f.gərginlik} V</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Cərəyan</span>
                    <span style={{ fontSize: 12, color: '#fff', fontFamily: 'JetBrains Mono' }}>{f.cərəyan} A</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Güc</span>
                    <span style={{ fontSize: 12, color: colors[i], fontFamily: 'JetBrains Mono' }}>{f.güc} kW</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, marginTop: 4 }}>
                    <div style={{ height: '100%', width: `${(f.cərəyan / 20) * 100}%`, background: colors[i], borderRadius: 2, opacity: 0.8 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}