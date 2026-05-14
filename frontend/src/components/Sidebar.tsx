import { LayoutDashboard, BarChart2, Cpu, Settings, Leaf, Bell, LogOut } from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analitika', icon: BarChart2 },
  { id: 'devices', label: 'Cihazlar', icon: Cpu },
  { id: 'settings', label: 'Parametrlər', icon: Settings },
];

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0a1a2e] border-r border-white/5">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
            <Leaf className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">EcoAI</p>
            <p className="text-[10px] text-emerald-400/80 tracking-widest uppercase">Energy Platform</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map(({ id, label, icon: Icon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                className={`nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : ''}`} />
                {label}
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-6 border-t border-white/5 space-y-1">
          <button className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/5">
            <Bell className="w-4 h-4" />
            Bildirişlər
            <span className="ml-auto text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full">3</span>
          </button>
          <button className="nav-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/5">
            <LogOut className="w-4 h-4" />
            Çıxış
          </button>
          <div className="flex items-center gap-3 px-4 py-3 mt-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
              AH
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">Anar Həsənov</p>
              <p className="text-[10px] text-slate-500 truncate">Admin</p>
            </div>
            <div className="pulse-dot w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a1a2e] border-t border-white/10 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ id, icon: Icon }) => {
            const active = activeNav === id;
            return (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl ${
                  active ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{id.charAt(0).toUpperCase() + id.slice(1)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
