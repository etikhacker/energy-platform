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
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#00e699]/10 border border-[#00e699]/20">
        <div className="relative w-1.5 h-1.5">
          <div className="absolute inset-0 rounded-full animate-ping bg-[#00e699] opacity-75" />
          <div className="absolute inset-0 rounded-full bg-[#00e699]" />
        </div>
        <span className="text-[10px] font-bold tracking-wider text-[#00e699] uppercase">{value}</span>
      </div>
    );
  }
  if (direction === 'up') {
    return (
      <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
        <TrendingUp className="w-3 h-3" />
        <span className="text-[10px] font-bold">{value}</span>
      </div>
    );
  }
  if (direction === 'down') {
    return (
      <div className="flex items-center gap-1 text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20">
        <TrendingDown className="w-3 h-3" />
        <span className="text-[10px] font-bold">{value}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-gray-500">
      <Minus className="w-3 h-3" />
      <span className="text-[10px]">{value}</span>
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
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, i * 100 + 100);
      }
    });
  }, [stats]);

  const kpiData = [
    {
      label: t('cariIstehlak'),
      value: `${stats.current_kwh}`,
      unit: 'kWh',
      icon: Zap,
      iconColor: 'text-[#64ffda]',
      iconBg: 'bg-[#64ffda]/10',
      iconBorder: 'border-[#64ffda]/30',
      trend: `${Math.abs(stats.trend)}%`,
      trendDirection: stats.trend < 0 ? 'down' : 'up',
    },
    {
      label: t('energiQenaeti'),
      value: `${stats.saving_percent}`,
      unit: '%',
      icon: Leaf,
      iconColor: 'text-[#00e699]',
      iconBg: 'bg-[#00e699]/10',
      iconBorder: 'border-[#00e699]/30',
      trend: i18n.language === 'az' ? 'AKTİV' : i18n.language === 'en' ? 'ACTIVE' : 'АКТИВНО',
      trendDirection: 'charging',
    },
    {
      label: t('ayliqQenaet'),
      value: `$${stats.monthly_saving_usd}`,
      unit: '',
      icon: DollarSign,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-400/10',
      iconBorder: 'border-yellow-400/30',
      trend: '12%',
      trendDirection: 'up',
    },
    {
      label: t('karbonAzalmasi'),
      value: `${(stats.current_kwh * 0.41 / 1000).toFixed(1)}t`,
      unit: '',
      icon: TrendingDown,
      iconColor: 'text-[#94d2bd]',
      iconBg: 'bg-[#94d2bd]/10',
      iconBorder: 'border-[#94d2bd]/30',
      trend: 'CO₂',
      trendDirection: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpiData.map((item, i) => {
        const Icon = item.icon;
        return (
          <div
            key={i}
            ref={(el) => { if (el) cardsRef.current[i] = el; }}
            className="relative group p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-[#64ffda]/30 hover:shadow-[0_8px_30px_rgba(100,255,218,0.12)] overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {item.label}
                </p>
                <div className="flex items-baseline gap-1">
                  <h3 className="text-[28px] font-extrabold text-white tracking-tight">
                    {item.value}
                  </h3>
                  {item.unit && (
                    <span className="text-sm font-medium text-gray-500">{item.unit}</span>
                  )}
                </div>
              </div>

              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${item.iconBg} ${item.iconBorder}`}>
                <Icon className={`w-6 h-6 ${item.iconColor} drop-shadow-md`} />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4 relative z-10">
              <TrendIndicator direction={item.trendDirection} value={item.trend} />
              <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00e699] to-[#64ffda] rounded-full w-2/3" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
