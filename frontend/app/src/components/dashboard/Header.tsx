import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  userEmail?: string;
  userName?: string;
  activeNav?: string;
}

const pageTitles: Record<string, string> = {
  dashboard: 'idarePaneli',
  analytics: 'analitika',
  grid: 'sebeke',
  devices: 'cihazlar',
  forecast: 'proqnoz',
  settings: 'parametrler',
};

export default function Header({ userEmail, userName, activeNav = 'dashboard' }: HeaderProps) {
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
    <header className="flex items-center justify-between px-6 py-4 mx-6 mt-6 mb-8 rounded-2xl bg-[#030d0a]/60 border border-white/5 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-10 sticky top-6">
      <h2 className="text-xl font-bold text-white tracking-wide">
        {t(pageTitles[activeNav] || 'idarePaneli')}
      </h2>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-2 h-2 rounded-full animate-pulse bg-[#00e699] shadow-[0_0_10px_rgba(0,230,153,0.8)]" />
          <span className="font-mono text-xs text-[#00e699] tracking-widest font-medium">
            {formattedTime} <span className="opacity-50 mx-1">/</span> {formattedDate}
          </span>
        </div>

        <div className="h-8 w-px bg-white/10 hidden md:block"></div>

        <p className="text-sm font-medium text-gray-400">
          {t(greetingKey)}, <span className="text-[#64ffda]">{firstName}</span>
        </p>
      </div>
    </header>
  );
}
