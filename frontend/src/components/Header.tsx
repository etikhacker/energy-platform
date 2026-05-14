import { Search, Bell, RefreshCw } from 'lucide-react';

export default function Header() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('az-AZ', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fade-in flex flex-wrap items-center justify-between gap-4 mb-2">
      <div>
        <h1 className="text-xl font-bold text-white">
          Xoş gəlmisiniz, <span className="text-emerald-400">Anar</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5 capitalize">{dateStr}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Axtar..."
            className="bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/40 w-44 transition-all"
          />
        </div>

        {/* Refresh */}
        <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
          <RefreshCw className="w-4 h-4 text-slate-400" />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* Live badge */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="pulse-dot w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
          <span className="text-xs text-emerald-400 font-medium">Canlı</span>
        </div>
      </div>
    </div>
  );
}
