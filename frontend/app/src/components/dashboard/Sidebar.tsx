import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  BarChart3,
  UtilityPole,
  Cpu,
  CloudSun,
  Settings,
  Zap,
  LogOut,
} from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onNavigate?: (item: string) => void;
  onLogout?: () => void;
  userEmail?: string;
  userName?: string;
}

const navItems = [
  { id: 'dashboard', labelKey: 'idarePaneli', icon: LayoutDashboard },
  { id: 'analytics', labelKey: 'analitika',    icon: BarChart3 },
  { id: 'grid',      labelKey: 'sebeke',       icon: UtilityPole },
  { id: 'devices',   labelKey: 'cihazlar',     icon: Cpu },
  { id: 'forecast',  labelKey: 'proqnoz',      icon: CloudSun },
  { id: 'settings',  labelKey: 'parametrler',  icon: Settings },
];

export default function Sidebar({ activeItem, onNavigate, onLogout, userEmail, userName }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const displayName = userName || userEmail?.split('@')[0] || 'İstifadəçi';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col border-r border-white/5 bg-[#030d0a]/80 backdrop-blur-2xl z-20"
      style={{ width: 260 }}
    >
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e699]/20 to-[#64ffda]/5 border border-[#64ffda]/30 flex items-center justify-center shadow-[0_0_20px_rgba(100,255,218,0.2)]">
            <Zap className="w-5 h-5 text-[#64ffda]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              EcoAI
            </h1>
            <p className="text-[9px] font-mono mt-0.5 text-[#64ffda]/70 tracking-[0.15em] uppercase">
              {i18n.language === 'az' ? 'SİSTEMİ' : i18n.language === 'en' ? 'SYSTEM' : 'СИСТЕМА'}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

      {/* Nav */}
      <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-gradient-to-r from-[#00e699]/15 to-[#64ffda]/5 text-white shadow-[inset_0_0_20px_rgba(0,230,153,0.1)] border border-[#00e699]/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-[#64ffda] drop-shadow-[0_0_8px_rgba(100,255,218,0.8)]' : 'opacity-70'}`} />
              <span className="font-medium text-sm">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-6 mt-auto">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00e699]/20 to-[#64ffda]/10 border border-[#00e699]/30 flex items-center justify-center text-sm font-bold text-[#64ffda] shadow-[0_0_15px_rgba(0,230,153,0.15)] flex-shrink-0">
            {initials}
          </div>

          {/* Name & Email */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{displayName}</p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">{userEmail || 'Admin'}</p>
          </div>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={() => {
                localStorage.removeItem('ecoai-auth');
                window.location.href = '/login';
              }}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/10 hover:text-red-400 text-gray-400 transition-colors flex-shrink-0"
              title={i18n.language === 'az' ? 'Çıxış' : i18n.language === 'en' ? 'Log Out' : 'Выход'}
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
