import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Zap, Sun, Battery, DollarSign } from 'lucide-react';

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
  const { t, i18n } = useTranslation();
  const [period, setPeriod] = useState<'Həftəlik' | 'Aylıq'>('Aylıq');

  const monthlyData = [
    { ay: t('months.0', { defaultValue: 'Yan' }), gunesh: 420, sebeke: 180 },
    { ay: t('months.1', { defaultValue: 'Fev' }), gunesh: 390, sebeke: 210 },
    { ay: t('months.2', { defaultValue: 'Mar' }), gunesh: 510, sebeke: 160 },
    { ay: t('months.3', { defaultValue: 'Apr' }), gunesh: 620, sebeke: 120 },
    { ay: t('months.4', { defaultValue: 'May' }), gunesh: 710, sebeke: 90  },
    { ay: t('months.5', { defaultValue: 'İyn' }), gunesh: 780, sebeke: 70  },
    { ay: t('months.6', { defaultValue: 'İyl' }), gunesh: 820, sebeke: 55  },
    { ay: t('months.7', { defaultValue: 'Avq' }), gunesh: 790, sebeke: 65  },
    { ay: t('months.8', { defaultValue: 'Sen' }), gunesh: 650, sebeke: 110 },
    { ay: t('months.9', { defaultValue: 'Okt' }), gunesh: 520, sebeke: 150 },
    { ay: t('months.10', { defaultValue: 'Noy' }), gunesh: 380, sebeke: 220 },
    { ay: t('months.11', { defaultValue: 'Dek' }), gunesh: 310, sebeke: 260 },
  ];

  const weeklyData = [
    { gun: i18n.language === 'az' ? 'B.e' : i18n.language === 'en' ? 'Mon' : 'Пн', gunesh: 28.5, sebeke: 22.3, batareya: 4.2 },
    { gun: i18n.language === 'az' ? 'Ç.a' : i18n.language === 'en' ? 'Tue' : 'Вт', gunesh: 31.2, sebeke: 24.1, batareya: 5.8 },
    { gun: i18n.language === 'az' ? 'Çər' : i18n.language === 'en' ? 'Wed' : 'Ср', gunesh: 26.8, sebeke: 23.5, batareya: 2.1 },
    { gun: i18n.language === 'az' ? 'C.a' : i18n.language === 'en' ? 'Thu' : 'Чт', gunesh: 33.4, sebeke: 25.0, batareya: 6.5 },
    { gun: i18n.language === 'az' ? 'Cüm' : i18n.language === 'en' ? 'Fri' : 'Пт', gunesh: 29.1, sebeke: 22.8, batareya: 4.0 },
    { gun: i18n.language === 'az' ? 'Şən' : i18n.language === 'en' ? 'Sat' : 'Сб', gunesh: 35.2, sebeke: 26.3, batareya: 7.1 },
    { gun: i18n.language === 'az' ? 'Baz' : i18n.language === 'en' ? 'Sun' : 'Вс', gunesh: 32.0, sebeke: 24.5, batareya: 5.5 },
  ];

  const energyLabels = {
    solar: i18n.language === 'az' ? 'Günəş' : i18n.language === 'en' ? 'Solar' : 'Солнце',
    grid: i18n.language === 'az' ? 'Şəbəkə' : i18n.language === 'en' ? 'Grid' : 'Сеть',
    battery: i18n.language === 'az' ? 'Batareya' : i18n.language === 'en' ? 'Battery' : 'Батарея',
  };

  const enerjiPay = [
    { name: energyLabels.solar,    value: 68, color: '#e9d8a6' },
    { name: energyLabels.grid,   value: 21, color: '#0a9396' },
    { name: energyLabels.battery, value: 11, color: '#94d2bd' },
  ];

  const statCards = [
    { icon: Sun,         label: i18n.language === 'az' ? 'Bu ay günəş' : i18n.language === 'en' ? 'Solar this month' : 'Солнечная в этом месяце', value: '710 kWh', change: '+12%', up: true,  color: '#e9d8a6' },
    { icon: Zap,         label: t('cariIstehlak'), value: '521 kWh', change: '-4%',  up: false, color: '#94d2bd' },
    { icon: Battery,     label: i18n.language === 'az' ? 'Batareya səmərəsi' : i18n.language === 'en' ? 'Battery efficiency' : 'Эфф. батареи', value: '89%',     change: '+3%',  up: true,  color: '#2a9d8f' },
    { icon: DollarSign,  label: t('ayliQenaet'),      value: `${i18n.language === 'az' ? '₼' : '$'}84.20`,  change: '+18%', up: true,  color: '#2a9d8f' },
  ];

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
                  {s.change} {i18n.language === 'az' ? 'ötən aya nisbət' : i18n.language === 'en' ? 'vs last month' : 'к прош. месяцу'}
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
            <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: 0 }}>
              {i18n.language === 'az' ? 'Enerji Müqayisəsi' : i18n.language === 'en' ? 'Energy Comparison' : 'Сравнение энергии'}
            </h3>
            <div style={{ display: 'flex', gap: 4 }}>
              {[
                { kod: 'Həftəlik', ad: i18n.language === 'az' ? 'Həftəlik' : i18n.language === 'en' ? 'Weekly' : 'Еженедельно' },
                { kod: 'Aylıq', ad: i18n.language === 'az' ? 'Aylıq' : i18n.language === 'en' ? 'Monthly' : 'Ежемесячно' }
              ].map((p) => (
                <button key={p.kod} onClick={() => setPeriod(p.kod as any)} style={{
                  padding: '4px 12px', fontSize: 11, borderRadius: 6, border: 'none', cursor: 'pointer',
                  background: (period === 'Aylıq' && p.kod === 'Aylıq') || (period === 'Həftəlik' && p.kod === 'Həftəlik') ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: (period === 'Aylıq' && p.kod === 'Aylıq') || (period === 'Həftəlik' && p.kod === 'Həftəlik') ? '#fff' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.2s',
                }}>{p.ad}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={currentData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey={xKey} tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.45)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="gunesh" name={energyLabels.solar} fill="#e9d8a6" opacity={0.85} radius={[3,3,0,0]} />
              <Bar dataKey="sebeke" name={energyLabels.grid} fill="#0a9396" opacity={0.85} radius={[3,3,0,0]} />
              {period === 'Həftəlik' && (
                <Bar dataKey="batareya" name={energyLabels.battery} fill="#94d2bd" opacity={0.7} radius={[3,3,0,0]} />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="liquid-glass" style={{ padding: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 8px 0' }}>
            {i18n.language === 'az' ? 'Enerji Mənbəyi' : i18n.language === 'en' ? 'Energy Source' : 'Источник энергии'}
          </h3>
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
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#fff', margin: '0 0 16px 0' }}>
          {i18n.language === 'az' ? 'İllik Günəş Enerjisi Trendi' : i18n.language === 'en' ? 'Annual Solar Energy Trend' : 'Годовой тренд солнечной энергии'}
        </h3>
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
            <Area type="monotone" dataKey="gunesh" name={`${energyLabels.solar} (kWh)`} stroke="#e9d8a6" strokeWidth={1.5} fill="url(#trendGunesh)" dot={false} activeDot={{ r: 4, fill: '#e9d8a6', stroke: 'transparent' }} />
            <Area type="monotone" dataKey="sebeke" name={`${energyLabels.grid} (kWh)`} stroke="#0a9396" strokeWidth={1.5} fill="url(#trendSebeke)" dot={false} activeDot={{ r: 4, fill: '#0a9396', stroke: 'transparent' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}