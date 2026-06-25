import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data24h = [
  { time: '12:00', solar: 4.2, consumption: 3.1, battery: 0.8 },
  { time: '12:30', solar: 4.8, consumption: 2.9, battery: 1.2 },
  { time: '13:00', solar: 5.1, consumption: 3.4, battery: 1.0 },
  { time: '13:30', solar: 5.5, consumption: 3.2, battery: 1.5 },
  { time: '14:00', solar: 5.7, consumption: 3.5, battery: 1.8 },
  { time: '14:30', solar: 5.4, consumption: 3.0, battery: 1.6 },
  { time: '15:00', solar: 5.0, consumption: 2.8, battery: 1.4 },
  { time: '15:30', solar: 4.5, consumption: 3.3, battery: 0.9 },
  { time: '16:00', solar: 3.8, consumption: 3.6, battery: 0.4 },
  { time: '16:30', solar: 3.2, consumption: 3.5, battery: -0.2 },
  { time: '17:00', solar: 2.5, consumption: 3.8, battery: -1.0 },
  { time: '17:30', solar: 1.8, consumption: 4.0, battery: -1.8 },
];

const data1h = data24h.slice(-4);
const data6h = data24h.slice(-8);

const data7d = [
  { time: 'Baz.e', solar: 28.5, consumption: 22.3, battery: 4.2 },
  { time: 'Car.a', solar: 31.2, consumption: 24.1, battery: 5.8 },
  { time: 'Car', solar: 26.8, consumption: 23.5, battery: 2.1 },
  { time: 'Cum.a', solar: 33.4, consumption: 25.0, battery: 6.5 },
  { time: 'Cum', solar: 29.1, consumption: 22.8, battery: 4.0 },
  { time: 'Sen', solar: 35.2, consumption: 26.3, battery: 7.1 },
  { time: 'Baz', solar: 32.0, consumption: 24.5, battery: 5.5 },
];

type TimeRange = '1S' | '6S' | '24S' | '7G';

const timeRangeData: Record<TimeRange, typeof data24h> = {
  '1S': data1h,
  '6S': data6h,
  '24S': data24h,
  '7G': data7d,
};

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div
      style={{
        padding: 12,
        background: 'rgba(0, 42, 53, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8,
      }}
    >
      <p style={{ fontSize: 11, marginBottom: 8, color: 'rgba(255,255,255,0.65)' }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '2px 0' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{entry.name}:</span>
          <span style={{ fontSize: 12, color: '#ffffff', fontFamily: 'JetBrains Mono' }}>
            {entry.value} kW
          </span>
        </div>
      ))}
    </div>
  );
}

export default function EnergyChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24S');
  const currentData = timeRangeData[timeRange];

  return (
    <div className="liquid-glass col-span-7" style={{ padding: 14, height: 328 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <h3 style={{ fontSize: 15, fontWeight: 500, color: '#ffffff', margin: 0 }}>
          Canlı Enerji Axını
        </h3>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['1S', '6S', '24S', '7G'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '4px 12px',
                fontSize: 11,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: 6,
                border: 'none',
                cursor: 'pointer',
                background: timeRange === range ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: timeRange === range ? '#ffffff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 278 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="solarFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e9d8a6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#e9d8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="consumptionFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#e63946" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="batteryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0a9396" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#0a9396" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              domain={[-5, 5]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="solar"
              name="Günəş Enerjisi"
              stroke="#e9d8a6"
              strokeWidth={1.5}
              fill="url(#solarFill)"
              dot={false}
              activeDot={{ r: 4, fill: '#e9d8a6', stroke: 'transparent' }}
            />
            <Area
              type="monotone"
              dataKey="consumption"
              name="İstifadə"
              stroke="#e63946"
              strokeWidth={1.5}
              fill="url(#consumptionFill)"
              dot={false}
              activeDot={{ r: 4, fill: '#e63946', stroke: 'transparent' }}
            />
            <Area
              type="monotone"
              dataKey="battery"
              name="Batareya Axını"
              stroke="#0a9396"
              strokeWidth={1.5}
              fill="url(#batteryFill)"
              dot={false}
              activeDot={{ r: 4, fill: '#0a9396', stroke: 'transparent' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
