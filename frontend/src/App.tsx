import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardCards from './components/DashboardCards';
import EnergyChart from './components/EnergyChart';
import AIRecommendations from './components/AIRecommendations';
import ControlPanel from './components/ControlPanel';

const API = 'http://127.0.0.1:8000';
type DeviceState = Record<string, boolean>;

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [devices, setDevices] = useState<DeviceState>({});

  useEffect(() => {
    fetch(`${API}/api/energy/devices`)
      .then(r => r.json())
      .then(data => setDevices(data))
      .catch(() => setDevices({
        livingLight: true, bedroomLight: false,
        heating: true, airCon: false, tv: true,
        waterHeater: false, coffee: false, bedroomAc: false,
      }));
  }, []);

  const toggleDevice = (key: string) => {
    const newVal = !devices[key];
    setDevices(prev => ({ ...prev, [key]: newVal }));
    fetch(`${API}/api/energy/devices?device_key=${key}&is_on=${newVal}`, {
      method: 'POST'
    }).catch(console.error);
  };

  return (
    <div className="flex h-screen bg-[#070f1a] text-white overflow-hidden">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <div className="px-4 sm:px-6 py-6 max-w-screen-2xl mx-auto">
          <Header />

          {activeNav === 'dashboard' && (
            <>
              <DashboardCards />
              <EnergyChart />
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-0">
                <AIRecommendations />
                <ControlPanel devices={devices} toggleDevice={toggleDevice} />
              </div>
            </>
          )}

          {activeNav === 'analytics' && (
            <div className="flex items-center justify-center h-96 text-slate-400 text-lg">
              Analitika səhifəsi tezliklə...
            </div>
          )}

          {activeNav === 'devices' && (
            <div className="flex items-center justify-center h-96 text-slate-400 text-lg">
              Cihazlar səhifəsi tezliklə...
            </div>
          )}

          {activeNav === 'settings' && (
            <div className="flex items-center justify-center h-96 text-slate-400 text-lg">
              Parametrlər səhifəsi tezliklə...
            </div>
          )}

          <div className="h-6" />
        </div>
      </main>
    </div>
  );
}