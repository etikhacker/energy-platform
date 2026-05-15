import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { CloudSun, Sunrise } from 'lucide-react';

const forecastData = [
  { hour: '16:00', solar: 3.2, consumption: 3.5 },
  { hour: '17:00', solar: 2.5, consumption: 3.8 },
  { hour: '18:00', solar: 1.2, consumption: 4.2 },
  { hour: '19:00', solar: 0.1, consumption: 3.9 },
  { hour: '20:00', solar: 0.0, consumption: 3.6 },
  { hour: '21:00', solar: 0.0, consumption: 2.8 },
  { hour: '22:00', solar: 0.0, consumption: 2.2 },
  { hour: '23:00', solar: 0.0, consumption: 1.8 },
  { hour: '00:00', solar: 0.0, consumption: 1.5 },
  { hour: '06:00', solar: 0.5, consumption: 2.1 },
  { hour: '07:00', solar: 1.8, consumption: 2.5 },
  { hour: '08:00', solar: 3.2, consumption: 2.8 },
  { hour: '09:00', solar: 4.5, consumption: 3.0 },
  { hour: '10:00', solar: 5.8, consumption: 3.2 },
  { hour: '11:00', solar: 6.2, consumption: 3.4 },
  { hour: '12:00', solar: 5.9, consumption: 3.1 },
  { hour: '13:00', solar: 5.4, consumption: 2.9 },
  { hour: '14:00', solar: 5.0, consumption: 3.0 },
  { hour: '15:00', solar: 4.1, consumption: 3.3 },
  { hour: '16:00', solar: 3.0, consumption: 3.6 },
];

const savingsData = [0.65, 0.82, 0.45, 0.91, 0.73, 0.88, 0.56];

function SavingsBar({ height, color }: { height: number; color: string }) {
  return (
    <div
      className="flex-1 mx-[2px]"
      style={{ height: 60, display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        style={{
          width: '100%',
          height: `${height}%`,
          background: color,
          borderRadius: '2px 2px 0 0',
          transition: 'height 0.3s ease',
        }}
      />
    </div>
  );
}

export default function ForecastPanel() {
  return (
    <div className="liquid-glass col-span-7" style={{ padding: 16, height: 320 }}>
      {/* Başlıq */}
      <div className="flex items-center gap-2 mb-4">
        <CloudSun className="w-4 h-4" style={{ color: '#94d2bd' }} />
        <h3 className="text-[16px] font-medium text-white">24 Saatlıq Enerji Proqnozu</h3>
      </div>

      {/* Üç sütunlu layout */}
      <div className="flex gap-4" style={{ height: 240 }}>
        {/* Sol - Qrafik */}
        <div style={{ width: '40%' }}>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={forecastData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="forecastSolar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e9d8a6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#e9d8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastConsumption" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e63946" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#e63946" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis
                dataKey="hour"
                tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                axisLine={false}
                tickLine={false}
                interval={4}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="solar"
                stroke="#e9d8a6"
                strokeWidth={1}
                fill="url(#forecastSolar)"
                dot={false}
              />
              <Area
                type="monotone"
                dataKey="consumption"
                stroke="#e63946"
                strokeWidth={1}
                fill="url(#forecastConsumption)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#e9d8a6' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Günəş</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: '#e63946' }} />
              <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>İstifadə</span>
            </div>
          </div>
        </div>

        {/* Orta - Sabah xülasəsi */}
        <div
          className="flex flex-col justify-center"
          style={{ width: '30%', paddingLeft: 8 }}
        >
          <span className="label-muted mb-3">Sabah</span>
          <div className="flex items-center gap-2 mb-2">
            <Sunrise className="w-4 h-4" style={{ color: '#e9d8a6' }} />
            <span className="font-mono-data text-[22px]" style={{ color: '#e9d8a6' }}>
              28.5 kWh
            </span>
          </div>
          <p className="text-[11px] mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Günəş enerjisi proqnozu
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>Pik:</span>
            <span className="font-mono-data text-[13px]" style={{ color: '#94d2bd' }}>
              11:00 - 14:00
            </span>
          </div>
        </div>

        {/* Sağ - Qənaət */}
        <div
          className="flex flex-col justify-center"
          style={{ width: '30%', paddingLeft: 8 }}
        >
          <span className="label-muted mb-3">Proqnozlaşdırılan Qənaət</span>
          <span className="font-mono-data text-[32px]" style={{ color: '#2a9d8f' }}>
            $3.42
          </span>
          <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            şəbəkəyə nisbətən
          </p>
          <div className="flex items-end mt-4" style={{ height: 60 }}>
            {savingsData.map((val, i) => {
              const colors = ['#2a9d8f', '#2a9d8f', '#e9d8a6', '#2a9d8f', '#2a9d8f', '#e9d8a6', '#2a9d8f'];
              return (
                <SavingsBar key={i} height={val * 100} color={colors[i]} />
              );
            })}
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Baz</span>
            <span className="text-[9px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Baz</span>
          </div>
        </div>
      </div>
    </div>
  );
}