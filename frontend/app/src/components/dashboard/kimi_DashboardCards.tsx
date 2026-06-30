import { Zap, TrendingUp, TrendingDown, Minus, Leaf, DollarSign } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const API = 'https://energy-platform-api.onrender.com';

interface Stats {
  current_kwh: number;
  saving_percent: number;
  monthly_saving_usd: number;
  trend: number;
}

function TrendIndicator({ direction, value }: { direction: string; value: string }) {
  if (direction === 'charging') {
    return (
      <div className="flex items-center gap-1.5">
        <div className="relative w-2 h-2">
          <div className="absolute inset-0 rounded-full animate-ping" style={{ background: '#2a9d8f', opacity: 0.5 }} />
          <div className="absolute inset-0 rounded-full" style={{ background: '#2a9d8f' }} />
        </div>
        <span className="text-[11px]" style={{ color: '#2a9d8f' }}>{value}</span>
      </div>
    );
  }
  if (direction === 'up') {
    return (
      <div className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3" style={{ color: '#2a9d8f' }} />
        <span className="text-[11px]" style={{ color: '#2a9d8f' }}>{value}</span>
      </div>
    );
  }
  if (direction === 'down') {
    return (
      <div className="flex items-center gap-1">
        <TrendingDown className="w-3 h-3" style={{ color: '#e63946' }} />
        <span className="text-[11px]" style={{ color: '#e63946' }}>{value}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1">
      <Minus className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.35)' }} />
      <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.35)' }}>{value}</span>
    </div>
  );
}

export default function DashboardCards() {
  const { t, i18n } = useTranslation();
  const cardsRef = useRef<HTMLDivElement[]>([]);
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

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (card) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100 + 200);
      }
    });
  }, [stats]);

  const kpiData = [
    {
      label: t('cariIstehlak'),
      value: `${stats.current_kwh} kWh`,
      color: '#2a9d8f',
      icon: Zap,
      iconColor: '#e9d8a6',
      trend: `${Math.abs(stats.trend)}%`,
      trendDirection: stats.trend < 0 ? 'down' : 'up',
    },
    {
      label: t('energiQenaeti'),
      value: `${stats.saving_percent}%`,
      color: '#0a9396',
      icon: TrendingDown,
      iconColor: '#0a9396',
      trend: i18n.language === 'az' ? 'Aktiv' : i18n.language === 'en' ? 'Active' : 'Активно',
      trendDirection: 'charging',
    },
    {
      label: t('karbonAzalmasi'),
      value: `${(stats.current_kwh * 0.41 / 1000).toFixed(1)}t`,
      color: '#e9d8a6',
      icon: Leaf,
      iconColor: '#e9d8a6',
      trend: 'CO₂',
      trendDirection: 'up',
    },
    {
      label: t('ayliQenaet'),
      value: `${i18n.language === 'az' ? '₼' : '$'}${stats.monthly_saving_usd}`,
      color: '#94d2bd',
      icon: DollarSign,
      iconColor: 'rgba(255,255,255,0.5)',
      trend: i18n.language === 'az' ? 'Bu ay' : i18n.language === 'en' ? 'This month' : 'В этом месяце',
      trendDirection: 'stable',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
      {kpiData.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            ref={(el) => { if (el) cardsRef.current[index] = el; }}
            className="liquid-glass"
            style={{ padding: 14, minHeight: 96 }}
          >
            <div className="flex items-start justify-between h-full">
              <div className="flex flex-col justify-between h-full">
                <span className="label-muted">{kpi.label}</span>
                <span className="font-mono-data text-[20px] sm:text-[24px] lg:text-[28px] leading-none" style={{ color: kpi.color }}>
                  {kpi.value}
                </span>
              </div>
              <div className="flex flex-col items-end justify-between h-full">
                <Icon className="w-5 h-5" style={{ color: kpi.iconColor }} />
                <TrendIndicator direction={kpi.trendDirection} value={kpi.trend} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}