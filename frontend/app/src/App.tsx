import { useState } from 'react';
import LivingCanvas from './components/LivingCanvas';
import Sidebar from './components/dashboard/Sidebar';
import Header from './components/dashboard/Header';
import DashboardCards from './components/dashboard/kimi_DashboardCards';
import EnergyChart from './components/dashboard/EnergyChart';
import AIAssistant from './components/dashboard/kimi_AIAssistant';
import DeviceControl from './components/dashboard/kimi_DeviceControl';
import ForecastPanel from './components/dashboard/ForecastPanel';
import AnalyticsPage from './components/dashboard/AnalyticsPage';
import GridPage from './components/dashboard/GridPage';

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#001219' }}>
      <LivingCanvas />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(0,18,25,0.4) 0%, rgba(0,18,25,0.2) 50%, transparent 100%)',
        }}
      />

      <div className="relative flex h-full" style={{ zIndex: 10 }}>
        <Sidebar activeItem={activeNav} onNavigate={setActiveNav} />

        <main className="flex-1 flex flex-col h-full" style={{ marginLeft: 240 }}>
          <Header />

          <div
            className="flex-1 overflow-y-auto"
            style={{
              padding: 24,
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}
          >
            {activeNav === 'dashboard' && (
              <>
                <DashboardCards />
                <div className="grid gap-6 mt-6" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                  <EnergyChart />
                  <AIAssistant />
                </div>
                <div className="grid gap-6 mt-6" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
                  <DeviceControl />
                  <ForecastPanel />
                </div>
              </>
            )}

            {activeNav === 'analytics' && <AnalyticsPage />}

            {activeNav === 'grid' && <GridPage />}

            {activeNav === 'devices' && (
              <div className="flex items-center justify-center h-full">
                <p className="text-white text-xl">Cihazlar — tezliklə</p>
              </div>
            )}

            {activeNav === 'forecast' && (
              <div className="flex items-center justify-center h-full">
                <p className="text-white text-xl">Proqnoz — tezliklə</p>
              </div>
            )}

            {activeNav === 'settings' && (
              <div className="flex items-center justify-center h-full">
                <p className="text-white text-xl">Parametrlər — tezliklə</p>
              </div>
            )}

            <div style={{ height: 24 }} />
          </div>
        </main>
      </div>
    </div>
  );
}