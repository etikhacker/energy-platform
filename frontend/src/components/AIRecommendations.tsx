import { useState } from 'react';
import { Wind, Moon, Sun, Thermometer, Plug, BarChart, CheckCircle, Sparkles } from 'lucide-react';

interface Recommendation {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  saving: string;
  priority: 'Yüksək' | 'Orta' | 'Aşağı';
  category: string;
}

const recommendations: Recommendation[] = [
  {
    id: 'ac',
    icon: Wind,
    title: 'Kondisioner Rejimini Optimallaşdırın',
    description: '26°C əvəzinə 28°C ayarlayın — hər dərəcə 6% qənaət deməkdir.',
    saving: '~$18/ay',
    priority: 'Yüksək',
    category: 'İstilik/Soyutma',
  },
  {
    id: 'night',
    icon: Moon,
    title: 'Gecə Cihazları Söndürün',
    description: 'Gözləmə rejimindəki cihazlar enerji istehlakının 10%-ni tutur.',
    saving: '~$12/ay',
    priority: 'Yüksək',
    category: 'İdman Rejimi',
  },
  {
    id: 'solar',
    icon: Sun,
    title: 'Günəş Saatlarında Yükü Artırın',
    description: '10:00–15:00 saatları arasında ağır cihazları istifadə edin.',
    saving: '~$9/ay',
    priority: 'Orta',
    category: 'Cədvəl',
  },
  {
    id: 'heat',
    icon: Thermometer,
    title: 'İstilik Cədvəlini Optimallaşdırın',
    description: 'Evdə olmadığınız saatlarda istiliyi avtomatik azaldın.',
    saving: '~$15/ay',
    priority: 'Yüksək',
    category: 'İstilik',
  },
  {
    id: 'standby',
    icon: Plug,
    title: 'Yüksək Güclü Cihazları İdarə Edin',
    description: 'Fırın, paltaryuyan — planlaşdırılmış istifadə ilə qənaət edin.',
    saving: '~$7/ay',
    priority: 'Orta',
    category: 'Cihaz',
  },
  {
    id: 'analytics',
    icon: BarChart,
    title: 'Pik Saatlardan Qaçın',
    description: 'Bölgənizdə 17:00–21:00 enerji tarifi 30% daha baha olur.',
    saving: '~$11/ay',
    priority: 'Orta',
    category: 'Tarif',
  },
];

const priorityStyles: Record<string, string> = {
  'Yüksək': 'bg-red-500/15 text-red-400 border-red-500/25',
  'Orta': 'bg-amber-500/15 text-amber-400 border-amber-500/25',
  'Aşağı': 'bg-slate-500/15 text-slate-400 border-slate-500/25',
};

export default function AIRecommendations() {
  const [implemented, setImplemented] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setImplemented((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const totalSaved = implemented.size * 12;

  return (
    <div
      className="fade-in-up bg-[#0d1e33] border border-white/8 rounded-2xl p-5"
      style={{ animationDelay: '400ms', opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-semibold text-white">AI Tövsiyələri</h2>
          </div>
          <p className="text-xs text-slate-500">Süni intellekt tərəfindən hazırlanmış qənaət planı</p>
        </div>
        {implemented.size > 0 && (
          <div className="text-right">
            <p className="text-xs text-emerald-400 font-semibold">+${totalSaved}/ay</p>
            <p className="text-[10px] text-slate-500">{implemented.size} tətbiq edildi</p>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
        {recommendations.map((rec, idx) => {
          const Icon = rec.icon;
          const done = implemented.has(rec.id);

          return (
            <button
              key={rec.id}
              onClick={() => toggle(rec.id)}
              className={`recommendation-card w-full text-left p-4 rounded-xl border transition-all ${
                done
                  ? 'bg-emerald-500/8 border-emerald-500/25 opacity-70'
                  : 'bg-white/3 border-white/8 hover:bg-white/5'
              }`}
              style={{
                animationDelay: `${idx * 60}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    done ? 'bg-emerald-500/20' : 'bg-white/6'
                  }`}
                >
                  {done ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Icon className="w-4 h-4 text-slate-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p
                      className={`text-sm font-medium leading-snug ${
                        done ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {rec.title}
                    </p>
                    <span
                      className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border ${priorityStyles[rec.priority]}`}
                    >
                      {rec.priority}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed mb-2 ${done ? 'text-slate-600' : 'text-slate-400'}`}>
                    {rec.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-600 bg-white/4 px-2 py-0.5 rounded-md">
                      {rec.category}
                    </span>
                    <span className={`text-xs font-semibold ${done ? 'text-emerald-500' : 'text-emerald-400'}`}>
                      {done ? '✓ ' : ''}{rec.saving}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {6 - implemented.size} tövsiyə gözləyir
        </p>
        <button
          onClick={() => setImplemented(new Set())}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
}
