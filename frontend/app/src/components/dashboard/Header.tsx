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

export default function Header({ userEmail, userName, activeNav = 'dashboard', onMenuClick }: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString(i18n.language === 'az' ? 'az-AZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });

  const formattedDate = time.toLocaleDateString(i18n.language === 'az' ? 'az-AZ' : i18n.language === 'ru' ? 'ru-RU' : 'en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  const hour = time.getHours();
  let greetingKey = 'axsaminiz';
  if (hour < 12) greetingKey = 'sabahinizyeir';
  else if (hour < 18) greetingKey = 'gunortan';

  const displayName = userName || userEmail?.split('@')[0] || 'İstifadəçi';
  const firstName = displayName.split(' ')[0];

  return (
    <header className="flex items-center justify-between gap-2 px-3 sm:px-5 py-3 sm:py-3.5 mx-3 sm:mx-5 mt-3 sm:mt-5 mb-3 sm:mb-5 rounded-2xl bg-[#030d0a]/60 border border-white/5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-10 sticky top-3 sm:top-5">
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger — only mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 text-white/80 flex-shrink-0"
          aria-label="Menyunu aç"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">
          {t(pageTitles[activeNav] || 'idarePaneli')}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
          <div className="w-2 h-2 rounded-full animate-pulse bg-[color:var(--accent)] shadow-[0_0_10px_rgba(0,230,153,0.8)]" />
          <span className="font-mono text-xs text-[color:var(--accent)] tracking-widest font-medium">
            {formattedTime} <span className="opacity-50 mx-1">/</span> {formattedDate}
          </span>
        </div>

        <div className="h-8 w-px bg-white/10 hidden md:block"></div>

        <p className="text-xs sm:text-sm font-medium text-gray-400 truncate max-w-[140px] sm:max-w-none">
          <span className="hidden sm:inline">{t(greetingKey)}, </span>
          <span className="text-[color:var(--accent-strong)]">{firstName}</span>
        </p>
      </div>
    </header>
  );
}
