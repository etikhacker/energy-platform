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
  { id: 'dashboard', label: 'İdarə Paneli', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analitika',    icon: BarChart3 },
  { id: 'grid',      label: 'Şəbəkə',       icon: UtilityPole },
  { id: 'devices',   label: 'Cihazlar',     icon: Cpu },
  { id: 'forecast',  label: 'Proqnoz',      icon: CloudSun },
  { id: 'settings',  label: 'Parametrlər',  icon: Settings },
];

export default function Sidebar({ activeItem, onNavigate, onLogout, userEmail, userName }: SidebarProps) {
  const displayName = userName || userEmail?.split('@')[0] || 'İstifadəçi';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col"
      style={{
        width: 240,
        background: 'rgba(0, 26, 35, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 20,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6" style={{ color: '#0a9396' }} />
          <div>
            <h1 className="text-[28px] font-semibold text-white leading-none tracking-tight">
              EcoAI
            </h1>
            <p className="text-[12px] font-mono-data mt-1" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em' }}>
              ENERJİ
            </p>
          </div>
        </div>
      </div>

      <div className="mx-4" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`sidebar-item gap-3 ${isActive ? 'active' : ''}`}
              style={{
                borderLeft: isActive ? '2px solid #0a9396' : '2px solid transparent',
                color: isActive ? '#ffffff' : undefined,
              }}
            >
              <Icon className="w-[18px] h-[18px]" style={{ color: isActive ? '#0a9396' : 'rgba(255,255,255,0.35)' }} />
              <span>{item.label}</span>
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
              background: 'rgba(10, 147, 150, 0.2)',
              border: '1px solid rgba(10, 147, 150, 0.3)',
              color: '#94d2bd',
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
              onClick={onLogout}
              className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors flex-shrink-0"
              style={{ color: 'rgba(255,255,255,0.35)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#e63946')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              title="Çıxış"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}