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
    <header
      className="flex items-center justify-between px-6"
      style={{
        height: 56,
        background: 'rgba(0, 26, 35, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <h2 className="text-[20px] font-medium text-white">
        {t(pageTitles[activeNav] || 'idarePaneli')}
      </h2>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2a9d8f' }} />
        <span className="font-mono-data text-[13px]" style={{ color: '#94d2bd' }}>
          {formattedTime} — {formattedDate}
        </span>
      </div>

      <p className="text-[13px] font-normal" style={{ color: 'rgba(255,255,255,0.65)' }}>
        {t(greetingKey)}, <span style={{ color: '#94d2bd', fontWeight: 500 }}>{firstName}</span>
      </p>
    </header>
  );
}