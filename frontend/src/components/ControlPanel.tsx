import { Lightbulb, Flame, Wind, Tv, Droplets, Coffee, Home, BedDouble } from 'lucide-react';

interface DeviceConfig {
  key: string;
  label: string;
  room: string;
  icon: React.ElementType;
  watts: number;
  iconActive: string;
  iconInactive: string;
}

const devices: DeviceConfig[] = [
  { key: 'livingLight', label: 'Qonaq Otağı İşığı', room: 'Qonaq Otağı', icon: Lightbulb, watts: 40, iconActive: 'text-amber-400', iconInactive: 'text-slate-500' },
  { key: 'bedroomLight', label: 'Yataq Otağı İşığı', room: 'Yataq Otağı', icon: Lightbulb, watts: 25, iconActive: 'text-amber-400', iconInactive: 'text-slate-500' },
  { key: 'heating', label: 'Qızdırıcı', room: 'Ümumi', icon: Flame, watts: 1200, iconActive: 'text-orange-400', iconInactive: 'text-slate-500' },
  { key: 'airCon', label: 'Kondisioner', room: 'Qonaq Otağı', icon: Wind, watts: 900, iconActive: 'text-cyan-400', iconInactive: 'text-slate-500' },
  { key: 'tv', label: 'Smart TV', room: 'Qonaq Otağı', icon: Tv, watts: 120, iconActive: 'text-blue-400', iconInactive: 'text-slate-500' },
  { key: 'waterHeater', label: 'Su Qızdırıcısı', room: 'Hamam', icon: Droplets, watts: 2000, iconActive: 'text-sky-400', iconInactive: 'text-slate-500' },
  { key: 'coffee', label: 'Qəhvə Maşını', room: 'Mətbəx', icon: Coffee, watts: 800, iconActive: 'text-amber-500', iconInactive: 'text-slate-500' },
  { key: 'bedroomAc', label: 'Yataq Otağı Kondisioner', room: 'Yataq Otağı', icon: Wind, watts: 750, iconActive: 'text-cyan-400', iconInactive: 'text-slate-500' },
];

const roomIcons: Record<string, React.ElementType> = {
  'Qonaq Otağı': Home,
  'Yataq Otağı': BedDouble,
  'Ümumi': Home,
  'Hamam': Droplets,
  'Mətbəx': Coffee,
};

interface ControlPanelProps {
  devices: Record<string, boolean>;
  toggleDevice: (key: string) => void;
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full toggle-switch flex-shrink-0 ${
        on ? 'bg-emerald-500' : 'bg-slate-600/60'
      }`}
      aria-label="toggle"
    >
      <span
        className={`toggle-knob absolute top-1 w-4 h-4 rounded-full bg-white shadow-md ${
          on ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

export default function ControlPanel({ devices: deviceStates, toggleDevice }: ControlPanelProps) {
  const activeCount = Object.values(deviceStates).filter(Boolean).length;
  const totalWatts = devices
    .filter((d) => deviceStates[d.key])
    .reduce((sum, d) => sum + d.watts, 0);

  return (
    <div
      className="fade-in-up bg-[#0d1e33] border border-white/8 rounded-2xl p-5"
      style={{ animationDelay: '480ms', opacity: 0 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white mb-0.5">İdarəetmə Paneli</h2>
          <p className="text-xs text-slate-500">Ağıllı ev cihazlarınız</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-emerald-400">{totalWatts} W</p>
          <p className="text-[10px] text-slate-500">{activeCount} cihaz aktiv</p>
        </div>
      </div>

      {/* Live consumption bar */}
      <div className="mb-4 p-3 rounded-xl bg-white/3 border border-white/6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Anlıq Güc İstehlakı</span>
          <span className="text-xs font-semibold text-white">{totalWatts} / 3000 W</span>
        </div>
        <div className="h-2 bg-white/6 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              totalWatts > 2500 ? 'bg-red-400' : totalWatts > 1500 ? 'bg-amber-400' : 'bg-emerald-400'
            }`}
            style={{ width: `${Math.min((totalWatts / 3000) * 100, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-600">0W</span>
          <span className="text-[10px] text-slate-600">3000W</span>
        </div>
      </div>

      {/* Device list */}
      <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
        {devices.map((device, idx) => {
          const Icon = device.icon;
          const RoomIcon = roomIcons[device.room] || Home;
          const on = !!deviceStates[device.key];

          return (
            <div
              key={device.key}
              className={`device-card flex items-center gap-3 p-3 rounded-xl border ${
                on
                  ? 'bg-white/4 border-white/10'
                  : 'bg-white/1 border-white/4 opacity-60'
              }`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Device icon */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  on ? 'bg-white/8' : 'bg-white/3'
                }`}
              >
                <Icon className={`w-4 h-4 ${on ? device.iconActive : device.iconInactive}`} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${on ? 'text-slate-100' : 'text-slate-500'}`}>
                  {device.label}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <RoomIcon className="w-3 h-3 text-slate-600" />
                  <span className="text-[10px] text-slate-600">{device.room}</span>
                  {on && (
                    <>
                      <span className="text-slate-700">·</span>
                      <span className="text-[10px] text-emerald-600 font-medium">{device.watts}W</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status + Toggle */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                    on ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-500'
                  }`}
                >
                  {on ? 'Açıq' : 'Qapalı'}
                </span>
                <Toggle on={on} onToggle={() => toggleDevice(device.key)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-white/5">
        <button
          onClick={() => devices.forEach((d) => { if (!deviceStates[d.key]) toggleDevice(d.key); })}
          className="flex-1 py-2 text-xs font-medium text-slate-300 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          Hamısını Aç
        </button>
        <button
          onClick={() => devices.forEach((d) => { if (deviceStates[d.key]) toggleDevice(d.key); })}
          className="flex-1 py-2 text-xs font-medium text-slate-300 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          Hamısını Söndür
        </button>
      </div>
    </div>
  );
}
