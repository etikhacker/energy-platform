import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  UtilityPole,
  Cpu,
  CloudSun,
  Settings,
  Zap,
  LogOut,
  X,
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

export default function Sidebar({
  activeItem,
  onNavigate,
  onLogout,
  userEmail,
  userName,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const { t, i18n } = useTranslation();
  const displayName = userName || userEmail?.split('@')[0] || 'İstifadəçi';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  // Mobil-də naviqasiya edəndə drawer-ı avtomatik bağla
  const handleNav = (id: string) => {
    onNavigate?.(id);
    onClose?.();
  };

  // Body scroll-u bağla drawer açıq olanda
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  // ESC düyməsi ilə bağlama
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const asideBase: React.CSSProperties = {
    width: 240,
    background: 'var(--app-bg-soft)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
  };

  return (
    <>
      {/* Backdrop — yalnız mobil */}
      <div
        onClick={onClose}
        className={`fixed inset-0 lg:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        style={{
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 25,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
        aria-hidden="true"
      />

      {/* Sidebar — desktop həmişə, mobil isOpen ilə */}
      <aside
        className="fixed left-0 top-0 h-full"
        style={{
          ...asideBase,
          zIndex: 30,
          // Desktop: həmişə görsən. Mobil: soldan sürüşür.
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Logo + bağla düyməsi (bağla yalnız mobil) */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6" style={{ color: 'var(--accent-strong)' }} />
            <div>
              <h1 className="text-[28px] font-semibold text-white leading-none tracking-tight">
                EcoAI
              </h1>
              <p className="text-[12px] font-mono-data mt-1" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em' }}>
                {i18n.language === 'az' ? 'ENERJİ' : i18n.language === 'en' ? 'ENERGY' : 'ЭНЕРГИЯ'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
            aria-label="Menyunu bağla"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mx-4" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

        {/* Nav */}
        <nav className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`sidebar-item gap-3 ${isActive ? 'active' : ''}`}
                style={{
                  borderLeft: isActive ? '2px solid var(--accent-strong)' : '2px solid transparent',
                  color: isActive ? '#ffffff' : undefined,
                }}
              >
                <Icon className="w-[18px] h-[18px]" style={{ color: isActive ? 'var(--accent-strong)' : 'rgba(255,255,255,0.35)' }} />
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
              style={{
                background: 'var(--accent-soft)',
                border: '1px solid var(--glass-border)',
                color: 'var(--accent)',
              }}
            >
              {initials}
            </div>

            {/* Ad və email */}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-white truncate">{displayName}</p>
              <p className="text-[11px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {userEmail || 'Admin'}
              </p>
            </div>

            {/* Logout */}
            {onLogout && (
              <button
                onClick={() => {
                  localStorage.removeItem('ecoai-auth');
                  window.location.href = '/login';
                }}
                className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors flex-shrink-0"
                style={{ color: 'rgba(255,255,255,0.35)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#e63946')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
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