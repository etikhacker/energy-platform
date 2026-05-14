import { useState } from 'react';
import { TrendingDown, Info } from 'lucide-react';

const months = ['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyn', 'İyl', 'Avq', 'Sen', 'Okt', 'Noy', 'Dek'];

const actualData = [520, 498, 515, 540, 450, 418, 385, 360];
const forecastData = [360, 330, 302, 278, 255];

const W = 900;
const H = 300;
const PAD = { left: 62, right: 30, top: 28, bottom: 48 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const MIN_V = 180;
const MAX_V = 580;

function xPos(i: number) {
  return PAD.left + (i / (months.length - 1)) * PLOT_W;
}

function yPos(v: number) {
  return PAD.top + PLOT_H - ((v - MIN_V) / (MAX_V - MIN_V)) * PLOT_H;
}

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length < 2) return '';
  return points.reduce((d, pt, i, arr) => {
    if (i === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    const prev = arr[i - 1];
    const cpX = ((prev.x + pt.x) / 2).toFixed(1);
    return `${d} C ${cpX} ${prev.y.toFixed(1)}, ${cpX} ${pt.y.toFixed(1)}, ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');
}

const actualPoints = actualData.map((v, i) => ({ x: xPos(i), y: yPos(v) }));
const forecastStartIdx = actualData.length - 1;
const forecastPoints = forecastData.map((v, i) => ({
  x: xPos(forecastStartIdx + i),
  y: yPos(v),
}));

const actualPath = smoothPath(actualPoints);
const forecastPath = smoothPath(forecastPoints);

const baseY = yPos(MIN_V);
const actualAreaPath =
  actualPath +
  ` L ${actualPoints[actualPoints.length - 1].x.toFixed(1)} ${baseY.toFixed(1)} L ${actualPoints[0].x.toFixed(1)} ${baseY.toFixed(1)} Z`;

const yTicks = [200, 300, 400, 500, 580];

export default function EnergyChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [view, setView] = useState<'monthly' | 'weekly'>('monthly');

  return (
    <div
      className="fade-in-up mt-6 bg-[#0d1e33] border border-white/8 rounded-2xl p-5"
      style={{ animationDelay: '320ms', opacity: 0 }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-base font-semibold text-white">Enerji İstehlakı</h2>
          <p className="text-xs text-slate-500 mt-0.5">Aylıq istifadə və AI proqnozu</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-6 h-0.5 bg-emerald-400 rounded-full inline-block" />
              Faktiki
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-6 h-0.5 bg-cyan-400 rounded-full inline-block opacity-70 border-dashed" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #22d3ee 0, #22d3ee 4px, transparent 4px, transparent 8px)' }} />
              AI Proqnoz
            </span>
          </div>
          <div className="flex rounded-lg bg-white/5 p-0.5">
            {(['monthly', 'weekly'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === v ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {v === 'monthly' ? 'Aylıq' : 'Həftəlik'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Savings Badge */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-xl bg-emerald-500/8 border border-emerald-500/15 w-fit">
        <TrendingDown className="w-4 h-4 text-emerald-400" />
        <span className="text-xs text-emerald-400 font-medium">AI proqnozu: dekabra qədər </span>
        <span className="text-xs font-bold text-emerald-300">51% azalma</span>
        <Info className="w-3.5 h-3.5 text-emerald-500/60" />
      </div>

      {/* Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ minWidth: '480px' }}
        >
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.01" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {yTicks.map((v) => {
            const y = yPos(v);
            return (
              <g key={v}>
                <line
                  x1={PAD.left} y1={y} x2={W - PAD.right} y2={y}
                  stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                />
                <text
                  x={PAD.left - 8} y={y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fill="#475569"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* Vertical month guides */}
          {months.map((_, i) => (
            <line
              key={i}
              x1={xPos(i)} y1={PAD.top} x2={xPos(i)} y2={PAD.top + PLOT_H}
              stroke="rgba(255,255,255,0.03)" strokeWidth="1"
            />
          ))}

          {/* Forecast area */}
          <path
            d={smoothPath(forecastPoints) + ` L ${forecastPoints[forecastPoints.length - 1].x.toFixed(1)} ${baseY.toFixed(1)} L ${forecastPoints[0].x.toFixed(1)} ${baseY.toFixed(1)} Z`}
            fill="url(#forecastGrad)"
          />

          {/* Actual area */}
          <path d={actualAreaPath} fill="url(#actualGrad)" />

          {/* Forecast line */}
          <path
            d={forecastPath}
            fill="none"
            stroke="#22d3ee"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
            opacity="0.8"
            className="draw-line"
          />

          {/* Actual line */}
          <path
            d={actualPath}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
            className="draw-line"
          />

          {/* Actual data points */}
          {actualPoints.map((pt, i) => (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle cx={pt.x} cy={pt.y} r="10" fill="transparent" />
              <circle
                cx={pt.x} cy={pt.y} r={hoveredIdx === i ? 5 : 3.5}
                fill={hoveredIdx === i ? '#34d399' : '#10b981'}
                stroke="#0d1e33" strokeWidth="2"
                style={{ transition: 'r 0.15s ease' }}
              />
              {hoveredIdx === i && (
                <g>
                  <rect
                    x={pt.x - 28} y={pt.y - 34} width="56" height="22"
                    rx="6" fill="#0f2a1e" stroke="#10b981" strokeWidth="1" opacity="0.95"
                  />
                  <text x={pt.x} y={pt.y - 19} textAnchor="middle" fontSize="11" fill="#34d399" fontWeight="600">
                    {actualData[i]} kWh
                  </text>
                </g>
              )}
            </g>
          ))}

          {/* Forecast data points */}
          {forecastPoints.slice(1).map((pt, i) => (
            <circle
              key={i}
              cx={pt.x} cy={pt.y} r="3"
              fill="#22d3ee" stroke="#0d1e33" strokeWidth="2" opacity="0.7"
            />
          ))}

          {/* X axis labels */}
          {months.map((m, i) => (
            <text
              key={i}
              x={xPos(i)} y={H - 10}
              textAnchor="middle"
              fontSize="10"
              fill={i >= forecastStartIdx ? '#22d3ee' : '#475569'}
              fontWeight={i >= forecastStartIdx ? '500' : '400'}
            >
              {m}
            </text>
          ))}

          {/* "AI Forecast" label */}
          <text
            x={xPos(forecastStartIdx) + 12} y={PAD.top + 14}
            fontSize="9"
            fill="#22d3ee"
            opacity="0.7"
          >
            ← AI Proqnozu
          </text>
          <line
            x1={xPos(forecastStartIdx)} y1={PAD.top}
            x2={xPos(forecastStartIdx)} y2={PAD.top + PLOT_H}
            stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 3" opacity="0.3"
          />
        </svg>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/5">
        {[
          { label: 'Ortalama İstehlak', value: '460 kWh', color: 'text-emerald-400' },
          { label: 'Ən Yüksək Ay', value: '540 kWh (Apr)', color: 'text-cyan-400' },
          { label: 'Proqnoz Azalma', value: '−30%', color: 'text-emerald-400' },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <p className={`text-sm font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
