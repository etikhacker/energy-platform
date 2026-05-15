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
  { time: 'Mon', solar: 28.5, consumption: 22.3, battery: 4.2 },
  { time: 'Tue', solar: 31.2, consumption: 24.1, battery: 5.8 },
  { time: 'Wed', solar: 26.8, consumption: 23.5, battery: 2.1 },
  { time: 'Thu', solar: 33.4, consumption: 25.0, battery: 6.5 },
  { time: 'Fri', solar: 29.1, consumption: 22.8, battery: 4.0 },
  { time: 'Sat', solar: 35.2, consumption: 26.3, battery: 7.1 },
  { time: 'Sun', solar: 32.0, consumption: 24.5, battery: 5.5 },
];

type TimeRange = '1H' | '6H' | '24H' | '7D';

const timeRangeData: Record<TimeRange, typeof data24h> = {
  '1H': data1h,
  '6H': data6h,
  '24H': data24h,
  '7D': data7d,
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload) return null;
  return (
    <div
      className="p-3"
      style={{
        background: 'rgba(0, 42, 53, 0.9)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 8,
      }}
    >
      <p className="text-[11px] mb-2" style={{ color: 'rgba(255,255,255,0.65)' }}>
        {label}
      </p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-[12px]" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {entry.name}:
          </span>
          <span className="font-mono-data text-[12px] text-white">
            {entry.value} kW
          </span>
        </div>
      ))}
    </div>
  );
}

export default function EnergyChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');
  const currentData = timeRangeData[timeRange];

  return (
    <div className="liquid-glass col-span-7" style={{ padding: 16, height: 360 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[16px] font-medium text-white">Real-Time Energy Flow</h3>
        <div className="flex gap-1">
          {(['1H', '6H', '24H', '7D'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider transition-all duration-200"
              style={{
                borderRadius: 6,
                background: timeRange === range ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: timeRange === range ? '#ffffff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
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
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              domain={[-5, 5]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="solar"
              name="Solar Generation"
              stroke="#e9d8a6"
              strokeWidth={1.5}
              fill="url(#solarFill)"
              dot={false}
              activeDot={{ r: 4, fill: '#e9d8a6', stroke: 'transparent' }}
            />
            <Area
              type="monotone"
              dataKey="consumption"
              name="Consumption"
              stroke="#e63946"
              strokeWidth={1.5}
              fill="url(#consumptionFill)"
              dot={false}
              activeDot={{ r: 4, fill: '#e63946', stroke: 'transparent' }}
            />
            <Area
              type="monotone"
              dataKey="battery"
              name="Battery Flow"
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
