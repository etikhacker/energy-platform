import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
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

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type Session = { user: { email?: string } } | null;

function LoginPage({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setError('Emailinizi yoxlayın — təsdiq linki göndərildi.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.session);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center" style={{ background: '#001219' }}>
      <LivingCanvas />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5, background: 'radial-gradient(ellipse at 30% 20%, rgba(0,18,25,0.4) 0%, rgba(0,18,25,0.2) 50%, transparent 100%)' }} />

      <div className="relative" style={{ zIndex: 10, width: 360 }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(42, 157, 143, 0.2)', border: '1px solid rgba(42, 157, 143, 0.3)' }}>
              <span style={{ color: '#2a9d8f', fontSize: 18 }}>⚡</span>
            </div>
            <span className="text-white text-xl font-semibold">EcoAI</span>
          </div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Enerji İdarəetmə Platforması</p>
        </div>

        {/* Card */}
        <div className="liquid-glass" style={{ padding: 28 }}>
          <h2 className="text-white text-lg font-medium mb-6">
            {isRegister ? 'Qeydiyyat' : 'Daxil ol'}
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                color: 'rgba(255,255,255,0.9)',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-xs mb-1.5" style={{ color: 'rgba(255,255,255,0.5)' }}>Şifrə</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                color: 'rgba(255,255,255,0.9)',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-3 py-2 text-xs" style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', borderRadius: 6, color: '#e63946' }}>
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 text-sm font-medium transition-all"
            style={{
              background: loading ? 'rgba(42,157,143,0.3)' : 'rgba(42,157,143,0.8)',
              border: '1px solid rgba(42,157,143,0.4)',
              borderRadius: 8,
              color: '#ffffff',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Gözləyin...' : isRegister ? 'Qeydiyyat' : 'Daxil ol'}
          </button>

          {/* Switch */}
          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-xs"
              style={{ color: 'rgba(255,255,255,0.4)' }}
            >
              {isRegister ? 'Artıq hesabınız var? Daxil olun' : 'Hesabınız yoxdur? Qeydiyyat'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center" style={{ background: '#001219' }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#2a9d8f', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: '#001219' }}>
      <LivingCanvas />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5, background: 'radial-gradient(ellipse at 30% 20%, rgba(0,18,25,0.4) 0%, rgba(0,18,25,0.2) 50%, transparent 100%)' }} />

      <div className="relative flex h-full" style={{ zIndex: 10 }}>
        <Sidebar activeItem={activeNav} onNavigate={setActiveNav} onLogout={() => supabase.auth.signOut()} />

        <main className="flex-1 flex flex-col h-full" style={{ marginLeft: 240 }}>
          <Header userEmail={session.user?.email} />

          <div className="flex-1 overflow-y-auto" style={{ padding: 24, scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
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