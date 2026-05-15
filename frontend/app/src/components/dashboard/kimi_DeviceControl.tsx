import { useState, useEffect } from 'react';
import { Cpu, Wind, Lightbulb, Refrigerator, Tv, Zap } from 'lucide-react';

const API = 'https://energy-platform-api.onrender.com';

interface Device {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconColor: string;
  status: boolean;
  power: number;
  type: string;
}

const deviceConfig = [
  { id: 'heating',      name: 'İstilik Sistemi', icon: Cpu,          iconColor: '#0a9396', power: 45, type: 'İstilik' },
  { id: 'livingLight',  name: 'İşıqlandırma',    icon: Lightbulb,    iconColor: '#e9d8a6', power: 12, type: 'İşıq' },
  { id: 'waterHeater',  name: 'Su Qızdırıcı',    icon: Refrigerator, iconColor: '#94d2bd', power: 18, type: 'Utility' },
  { id: 'tv',           name: 'TV',               icon: Tv,           iconColor: '#e9d8a6', power: 8,  type: 'Media' },
  { id: 'airCon',       name: 'Kondisioner',      icon: Wind,         iconColor: '#2a9d8f', power: 35, type: 'İqlim' },
  { id: 'coffee',       name: 'Qəhvə Maşını',     icon: Zap,          iconColor: '#94d2bd', power: 5,  type: 'Cihaz' },
];

export default function DeviceControl() {
  const [devices, setDevices] = useState<Device[]>(
    deviceConfig.map(d => ({ ...d, status: false }))
  );
  const [hvacTemp, setHvacTemp] = useState(24);

  useEffect(() => {
    fetch(`${API}/api/energy/devices`)
      .then((r) => r.json())
      .then((data) => {
        setDevices(deviceConfig.map(d => ({
          ...d,
          status: data[d.id] ?? false,
        })));
      })
      .catch(console.error);
  }, []);

  const activeCount = devices.filter((d) => d.status).length;

  const toggleDevice = (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    const newStatus = !device.status;

    setDevices((prev) =>
      prev.map((d) => d.id === id ? { ...d, status: newStatus } : d)
    );

    fetch(`${API}/api/energy/devices?device_key=${id}&is_on=${newStatus}`, {
      method: 'POST',
    }).catch(console.error);
  };

  return (
    <div className="liquid-glass col-span-5 flex flex-col" style={{ padding: 16, height: 320 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-medium text-white">Ağıllı Cihazlar</h3>
        <span
          className="text-[11px] font-medium px-2.5 py-0.5"
          style={{ background: 'rgba(42,157,143,0.15)', color: '#2a9d8f', borderRadius: 10 }}
        >
          {activeCount} Aktiv
        </span>
      </div>

      {/* Device List */}
      <div
        className="flex-1 overflow-y-auto pr-1"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
      >
        {devices.map((device) => {
          const Icon = device.icon;
          const isOn = device.status;
          return (
            <div
              key={device.id}
              className="flex items-center justify-between py-3 px-2 transition-colors cursor-pointer"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', borderRadius: 8 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className="w-5 h-5"
                  style={{ color: isOn ? device.iconColor : 'rgba(255,255,255,0.25)' }}
                />
                <div>
                  <p className="text-[13px] font-medium text-white">{device.name}</p>
                  <p className="text-[11px]" style={{ color: isOn ? '#2a9d8f' : 'rgba(255,255,255,0.35)' }}>
                    {isOn ? `Açıq · ${device.power}W` : 'Bağlı · 0W'}
                  </p>
                </div>
              </div>

              {/* Toggle Button - düzgün onClick ilə */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDevice(device.id);
                }}
                style={{
                  position: 'relative',
                  width: 36,
                  height: 20,
                  borderRadius: 10,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.25s ease',
                  background: isOn ? '#2a9d8f' : 'rgba(255,255,255,0.15)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 2,
                    left: isOn ? 18 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: '#fff',
                    transition: 'left 0.25s ease',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* Temperature Slider */}
      <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="label-muted">İstilik temperaturu</span>
          <span className="font-mono-data text-[13px]" style={{ color: '#0a9396' }}>{hvacTemp}°C</span>
        </div>
        <div className="relative w-full" style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              width: `${((hvacTemp - 16) / (30 - 16)) * 100}%`,
              borderRadius: 2,
              background: '#0a9396',
            }}
          />
          <input
            type="range"
            min={16}
            max={30}
            step={0.5}
            value={hvacTemp}
            onChange={(e) => setHvacTemp(parseFloat(e.target.value))}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            style={{ zIndex: 2 }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `calc(${((hvacTemp - 16) / (30 - 16)) * 100}% - 8px)`,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#002a35',
              border: '2px solid #0a9396',
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>16°C</span>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>30°C</span>
        </div>
      </div>
    </div>
  );
}