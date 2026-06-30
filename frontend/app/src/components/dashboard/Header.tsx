import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  activeNav?: string;
  onMenuClick?: () => void;
}

const pageTitles: Record<string, string> = {
  dashboard: 'idarePaneli',
  analytics: 'analitika',
  grid: 'sebeke',
  devices: 'cihazlar',
  forecast: 'proqnoz',
  settings: 'parametrler',
};

export default function Header({
  userEmail,
  userName,
  activeNav = 'dashboard',
  onMenuClick,
}: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString(
    i18n.language === 'az' ? 'az-AZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US',
    { hour: '2-digit', minute: '2-digit', hour12: false }
  );

  const formattedDate = time.toLocaleDateString(
    i18n.language === 'az' ? 'az-AZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  const hour = time.getHours();
  let greetingKey = 'axsaminiz';
  if (hour < 12) greetingKey = 'sabahinizyeir';
  else if (hour < 18) greetingKey = 'gunortan';

  const displayName = userName || userEmail?.split('@')[0] || 'İstifadəçi';
  const firstName = displayName.split(' ')[0];

  return (
    <header
      className="flex items-center justify-between gap-2 px-3 lg:px-6"
      style={{
        height: 56,
        background: 'var(--app-bg-soft)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Sol: hamburger (yalnız mobil) + səhifə başlığı */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)' }}
          aria-label="Menyunu aç"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-[16px] sm:text-[18px] lg:text-[20px] font-medium text-white truncate">
          {t(pageTitles[activeNav] || 'idarePaneli')}
        </h2>
      </div>

      {/* Orta: vaxt (yalnız md+) */}
      <div className="hidden md:flex items-center gap-2 flex-shrink-0">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
        <span className="font-mono-data text-[13px]" style={{ color: 'var(--accent)' }}>
          {formattedTime} — {formattedDate}
        </span>
      </div>

      {/* Sağ: salam (mobil-də qısaldılmış) */}
      <p
        className="text-[12px] sm:text-[13px] font-normal flex-shrink-0 truncate max-w-[120px] sm:max-w-none"
        style={{ color: 'rgba(255,255,255,0.65)' }}
      >
        {t(greetingKey)},{' '}
        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{firstName}</span>
      </p>
    </header>
  );
}