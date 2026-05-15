import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Zap, Sun, Battery, DollarSign } from 'lucide-react';

const monthlyData = [
  { ay: 'Yan', gunesh: 420, sebeke: 180 },
  { ay: 'Fev', gunesh: 390, sebeke: 210 },
  { ay: 'Mar', gunesh: 510, sebeke: 160 },
  { ay: 'Apr', gunesh: 620, sebeke: 120 },
  { ay: 'May', gunesh: 710, sebeke: 90  },
  { ay: 'İyn', gunesh: 780, sebeke: 70  },
  { ay: 'İyl', gunesh: 820, sebeke: 55  },
  { ay: 'Avq', gunesh: 790, sebeke: 65  },
  { ay: 'Sep', gunesh: 650, sebeke: 110 },
  { ay: 'Okt', gunesh: 520, sebeke: 150 },
  { ay: 'Noy', gunesh: 380, sebeke: 220 },
  { ay: 'Dek', gunesh: 310, sebeke: 260 },
];

const weeklyData = [
  { gun: 'Baz.e', gunesh: 28.5, sebeke: 22.3, batareya: 4.2 },
  { gun: 'Car.a', gunesh: 31.2, sebeke: 24.1, batareya: 5.8 },
  { gun: 'Car',   gunesh: 26.8, sebeke: 23.5, batareya: 2.1 },
  { gun: 'Cum.a', gunesh: 33.4, sebeke: 25.0, batareya: 6.5 },
  { gun: 'Cum',   gunesh: 29.1, sebeke: 22.8, batareya: 4.0 },
  { gun: 'Sen',   gunesh: 35.2, sebeke: 26.3, batareya: 7.1 },
  { gun: 'Baz',   gunesh: 32.0, sebeke: 24.5, batareya: 5.5 },
];

const enerjiPay = [
  { name: 'Günəş',    value: 68, color: '#e9d8a6' },
  { name: 'Şəbəkə',   value: 21, color: '#0a9396' },
  { name: 'Batareya', value: 11, color: '#94d2bd' },
];

const statCards = [
  { icon: Sun,         label: 'Bu ay günəş',      value: '710 kWh', change: '+12%', up: true,  color: '#e9d8a6' },
  { icon: Zap,         label: 'Ümumi istifadə',    value: '521 kWh', change: '-4%',  up: false, color: '#94d2bd' },
  { icon: Battery,     label: 'Batareya səmərəsi', value: '89%',     change: '+3%',  up: true,  color: '#2a9d8f' },
  { icon: DollarSign,  label: 'Aylıq qənaət',      value: '$84.20',  change: '+18%', up: true,  color: '#2a9d8f' },
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

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'Həftəlik' | 'Aylıq'>('Aylıq');
  const currentData = period === 'Aylıq' ? monthlyData : weeklyData;
  const xKey = period === 'Aylıq' ? 'ay' : 'gun';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Stat kartları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {statCards.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="liquid-glass" style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${s.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon style={{ width: 16, height: 16, color: s.color }} />
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 600, color: '#fff', fontFamily: 'JetBrains Mono', marginBottom: 6 }}>
                {s.value}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {s.up
                  ? <TrendingUp style={{ width: 12, height: 12, color: '#2a9d8f' }} />
                  : <TrendingDown style={{ width: 12, height: 12, color: '#e63946' }} />
                }
                <span style={{ fontSize: 11, color: s.up ? '#2a9d8f' : '#e63946' }}>
                  {s.change} ötən aya nisbət
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bar qrafik + Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        <div className="liquid-glass" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: 0 }}>Enerji Müqayisəsi</h3>
            <div style={{ display: 'flex', gap: 4 }}>
              {(['Həftəlik', 'Aylıq'] as const).map((p) => (
                <button key={p} onClick={() => setPeriod(p)} style={{
                  padding: '4px 12px', fontSize: 11, borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: period === p ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: period === p ? '#fff' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.2s',
                }}>{p}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={currentData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey={xKey} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gunesh" name="Günəş" fill="#e9d8a6" opacity={0.85} radius={[3,3,0,0]} />
              <Bar dataKey="sebeke" name="Şəbəkə" fill="#0a9396" opacity={0.85} radius={[3,3,0,0]} />
              {period === 'Həftəlik' && (
                <Bar dataKey="batareya" name="Batareya" fill="#94d2bd" opacity={0.7} radius={[3,3,0,0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 8px 0' }}>Enerji Mənbəyi</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={enerjiPay} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {enerjiPay.map((entry, i) => (
                  <Cell key={i} fill={entry.color} opacity={0.9} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: any) => [`${v}%`, '']}
                contentStyle={{ background: 'rgba(0,42,53,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, fontSize: 12, color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
            {enerjiPay.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.color }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>{e.name}</span>
                </div>
                <span style={{ fontSize: 12, color: '#fff', fontFamily: 'JetBrains Mono' }}>{e.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Area qrafik — trend */}
      <div className="liquid-glass" style={{ padding: 16 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>İllik Günəş Enerjisi Trendi</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="trendGunesh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e9d8a6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#e9d8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="trendSebeke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0a9396" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0a9396" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="ay" tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="gunesh" name="Günəş (kWh)" stroke="#e9d8a6" strokeWidth={1.5} fill="url(#trendGunesh)" dot={false} activeDot={{ r: 4, fill: '#e9d8a6', stroke: 'transparent' }} />
            <Area type="monotone" dataKey="sebeke" name="Şəbəkə (kWh)" stroke="#0a9396" strokeWidth={1.5} fill="url(#trendSebeke)" dot={false} activeDot={{ r: 4, fill: '#0a9396', stroke: 'transparent' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}