import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
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
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  { id: 'dashboard', labelKey: 'idarePaneli', icon: LayoutDashboard },
  { id: 'analytics', labelKey: 'analitika',    icon: BarChart3 },
  { id: 'grid',      labelKey: 'sebeke',       icon: UtilityPole },
  { id: 'devices',   labelKey: 'cihazlar',     icon: Cpu },
  { id: 'forecast',  labelKey: 'proqnoz',      icon: CloudSun },
  { id: 'settings',  labelKey: 'parametrler',  icon: Settings },
];

export default function Sidebar({ activeItem, onNavigate, onLogout, userEmail, userName, isOpen = false, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const displayName = userName || userEmail?.split('@')[0] || 'İstifadəçi';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const handleNavigate = (id: string) => {
    onNavigate?.(id);
    // Mobile-də klikdən sonra drawer bağlansın
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile backdrop (only visible on mobile when drawer is open) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-200 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      <aside
        className={`
          fixed left-0 top-0 h-full w-[240px] flex-col border-r border-white/5 bg-[#030d0a]/95 backdrop-blur-2xl z-40
          transform transition-transform duration-200 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:flex lg:z-20
        `}
        style={{ width: 240 }}
      >
        {/* Logo + close button (mobile) */}
        <div className="px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/30 flex items-center justify-center shadow-[0_0_20px_rgba(100,255,218,0.2)]">
              <Zap className="w-4 h-4 text-[color:var(--accent-strong)]" />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-white tracking-tight">
                EcoAI
              </h1>
              <p className="text-[9px] font-mono mt-0.5 text-[#64ffda]/70 tracking-[0.15em] uppercase">
                {i18n.language === 'az' ? 'SİSTEMİ' : i18n.language === 'en' ? 'SYSTEM' : 'СИСТЕМА'}
              </p>
            </div>
          </div>

          {/* Close button — only mobile */}
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/70"
            aria-label="Bağla"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3" />

        {/* Nav */}
        <nav className="flex-1 px-3 flex flex-col gap-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#00e699]/15 to-[#64ffda]/5 text-white shadow-[inset_0_0_20px_rgba(0,230,153,0.1)] border border-[#00e699]/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[color:var(--accent-strong)] drop-shadow-[0_0_8px_rgba(100,255,218,0.8)]' : 'opacity-70'}`} />
                <span className="font-medium text-sm">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-5 mt-auto">
          <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-xl bg-[color:var(--accent-soft)] border border-[color:var(--accent)]/30 flex items-center justify-center text-sm font-bold text-[color:var(--accent-strong)] shadow-[0_0_15px_rgba(0,230,153,0.15)] flex-shrink-0">
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
    </>
  );
}
