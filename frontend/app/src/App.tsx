import { useState } from 'react';
import LivingCanvas from './components/LivingCanvas';
import Sidebar from './components/dashboard/Sidebar';
import Header from './components/dashboard/Header';
import DashboardCards from './components/dashboard/kimi_DashboardCards';
import EnergyChart from './components/dashboard/EnergyChart';
import AIAssistant from './components/dashboard/kimi_AIAssistant';
import DeviceControl from './components/dashboard/kimi_DeviceControl';
import ForecastPanel from './components/dashboard/ForecastPanel';

export default function App() {
  const [activeNav] = useState('dashboard');

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#001219' }}>
      {/* Living Canvas background */}
      <LivingCanvas />

      {/* Subtle content area backdrop */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 5,
          background: 'radial-gradient(ellipse at 30% 20%, rgba(0,18,25,0.4) 0%, rgba(0,18,25,0.2) 50%, transparent 100%)',
        }}
      />

      {/* UI Layer */}
      <div className="relative flex h-full" style={{ zIndex: 10 }}>
        {/* Sidebar */}
        <Sidebar activeItem={activeNav} />

        {/* Content area */}
        <main
          className="flex-1 flex flex-col h-full"
          style={{ marginLeft: 240 }}
        >
          {/* Header */}
          <Header />

          {/* Dashboard content */}
          <div
            className="flex-1 overflow-y-auto"
            style={{
              padding: 24,
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}
          >
            {/* KPI Row */}
            <DashboardCards />

            {/* Second Row - Chart + AI */}
            <div
              className="grid gap-6 mt-6"
              style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
            >
              <EnergyChart />
              <AIAssistant />
            </div>

            {/* Third Row - Devices + Forecast */}
            <div
              className="grid gap-6 mt-6"
              style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}
            >
              <DeviceControl />
              <ForecastPanel />
            </div>

            {/* Bottom padding */}
            <div style={{ height: 24 }} />
          </div>
        </main>
      </div>
    </div>
  );
}
