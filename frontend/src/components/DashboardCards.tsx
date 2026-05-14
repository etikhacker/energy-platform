import { useEffect, useState } from 'react';
import { Zap, TrendingDown, Leaf, DollarSign, ArrowDown, ArrowUp } from 'lucide-react';

const API = 'http://127.0.0.1:8000';

interface Stats {
  current_kwh: number;
  saving_percent: number;
  monthly_saving_usd: number;
  trend: number;
}

function AnimatedNumber({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const isDecimal = !Number.isInteger(target);

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = eased * target;
      setCurrent(isDecimal ? parseFloat(val.toFixed(1)) : Math.round(val));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return <>{current}</>;
}

export default function DashboardCards() {
  const [stats, setStats] = useState<Stats>({
    current_kwh: 450,
    saving_percent: 24,
    monthly_saving_usd: 87,
    trend: -8.2,
  });

  useEffect(() => {
    fetch(`${API}/api/energy/dashboard`)
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(console.error);
  }, []);

  const cards = [
    {
      id: 'consumption',
      label: 'Cari İstehlak',
      value: stats.current_kwh,
      unit: 'kWh',
      suffix: undefined,
      change: stats.trend,
      changeLabel: 'keçən aydan',
      icon: Zap,
      iconBg: 'bg-cyan-500/15',
      iconColor: 'text-cyan-400',
      accentColor: 'text-cyan-400',
      delay: '0ms',
      positive: false,
    },
    {
      id: 'savings',
      label: 'Enerji Qənaəti',
      value: stats.saving_percent,
      unit: '%',
      suffix: 'daha az',
      change: 6.1,
      changeLabel: 'keçən həftədən',
      icon: TrendingDown,
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      accentColor: 'text-emerald-400',
      delay: '80ms',
      positive: true,
    },
    {
      id: 'carbon',
      label: 'Karbon Azalması',
      value: 1.2,
      unit: 't',
      suffix: 'CO₂',
      change: 14.5,
      changeLabel: 'bu ay',
      icon: Leaf,
      iconBg: 'bg-emerald-500/15',
      iconColor: 'text-emerald-400',
      accentColor: 'text-emerald-400',
      delay: '160ms',
      positive: true,
    },
    {
      id: 'cost',
      label: 'Aylıq Qənaət',
      value: stats.monthly_saving_usd,
      unit: '$',
      suffix: undefined,
      change: 12.3,
      changeLabel: 'bu ay',
      icon: DollarSign,
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
      accentColor: 'text-amber-400',
      delay: '240ms',
      positive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const TrendIcon = card.change > 0 ? ArrowUp : ArrowDown;
        const trendColor = card.positive
          ? card.change > 0
            ? 'text-emerald-400'
            : 'text-red-400'
          : card.change < 0
          ? 'text-emerald-400'
          : 'text-red-400';

        return (
          <div
            key={card.id}
            className="fade-in-up card-glow bg-[#0d1e33] border border-white/8 rounded-2xl p-5 cursor-default"
            style={{ animationDelay: card.delay, opacity: 0 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${trendColor} bg-white/5 px-2 py-1 rounded-lg`}
              >
                <TrendIcon className="w-3 h-3" />
                {Math.abs(card.change)}%
              </span>
            </div>

            <div className="mb-1">
              <span className={`text-3xl font-bold tracking-tight ${card.accentColor}`}>
                {card.id === 'cost' && '$'}
                <AnimatedNumber target={card.value} />
                {card.id !== 'cost' && card.unit}
              </span>
              {card.suffix && (
                <span className="text-xs text-slate-400 ml-2">{card.suffix}</span>
              )}
            </div>

            <p className="text-sm font-medium text-slate-200 mb-0.5">{card.label}</p>
            <p className="text-xs text-slate-500">{card.changeLabel}</p>

            <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  card.id === 'cost'
                    ? 'bg-amber-400'
                    : card.id === 'consumption'
                    ? 'bg-cyan-400'
                    : 'bg-emerald-400'
                } transition-all duration-1000`}
                style={{ width: `${Math.min(card.value, 100)}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}