import { useEffect, useState } from 'react';

export default function Header() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  const formattedDate = time.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const hour = time.getHours();
  let greeting = 'Good Evening';
  if (hour < 12) greeting = 'Good Morning';
  else if (hour < 18) greeting = 'Good Afternoon';

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
      {/* Page title */}
      <h2 className="text-[20px] font-medium text-white">Dashboard Overview</h2>

      {/* Live timestamp */}
      <div className="flex items-center gap-2">
        <div
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: '#2a9d8f' }}
        />
        <span
          className="font-mono-data text-[13px]"
          style={{ color: '#94d2bd' }}
        >
          {formattedTime} — {formattedDate}
        </span>
      </div>

      {/* Greeting */}
      <p
        className="text-[13px] font-normal"
        style={{ color: 'rgba(255,255,255,0.65)' }}
      >
        {greeting}, Alex
      </p>
    </header>
  );
}
