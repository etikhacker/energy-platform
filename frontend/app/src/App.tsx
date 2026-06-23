import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from 'sonner';
import { Mail, Lock, User, Zap, ArrowRight } from 'lucide-react';
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
import DevicesPage from './components/dashboard/DevicesPage';
import ForecastFullPage from './components/dashboard/ForecastFullPage';
import SettingsPage from './components/dashboard/SettingsPage';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';

type Session = { user: { email?: string; id?: string } } | null;

const applyAppearanceSettings = () => {
  const theme = localStorage.getItem('theme') || 'okean';
  const animations = localStorage.getItem('animations') ?? 'on';
  const density = localStorage.getItem('density') || 'comfortable';

  document.documentElement.dataset.theme = theme;
  document.documentElement.dataset.animations = animations;
  document.documentElement.dataset.density = density;
};

const inputStyle = {
  background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 8,
  color: 'rgba(255,255,255,0.9)',
};

function LoginPage({ onLogin }: { onLogin: (session: Session) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isRegister && !fullName.trim()) {
      setError('Ad Soyad daxil edin');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (isRegister) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName.trim() } }
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName.trim(),
          });
        }
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
    <div className="relative min-h-screen w-full bg-[#030d0a] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <LivingCanvas />
      </div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(100,255,218,0.15)_0%,transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.15)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-[400px] px-6">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00e699]/20 to-[#64ffda]/5 border border-[#64ffda]/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(100,255,218,0.2)]">
            <Zap className="w-7 h-7 text-[#64ffda]" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">EcoAI</h1>
          <p className="text-sm text-gray-400 mt-2 text-center font-medium">Enerji gələcəyinizə giriş edin</p>
        </div>

        {/* Card */}
        <div className="rounded-[32px] border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-xl font-bold text-white mb-6">
            {isRegister ? 'Yeni Hesab Yarat' : 'Sistemə Daxil Ol'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Ad Soyad</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <input
                    type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ömər Babayev" required
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#64ffda]/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">E-poçt Ünvanı</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ecoai.az" required
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#64ffda]/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 ml-1 uppercase tracking-wider">Şifrə</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#64ffda]/50 focus:bg-white/10 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className={`px-4 py-3 rounded-xl text-xs font-medium border ${error.includes('göndərildi') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full group relative flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#00e699] hover:bg-[#00cc88] text-[#030d0a] font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2 overflow-hidden shadow-[0_0_20px_rgba(0,230,153,0.2)] hover:shadow-[0_0_30px_rgba(0,230,153,0.4)]"
            >
              <span className="relative z-10">{loading ? 'Gözləyin...' : (isRegister ? 'Qeydiyyatdan Keç' : 'Daxil Ol')}</span>
              {!loading && <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => { setIsRegister(!isRegister); setError(''); setFullName(''); }}
              className="text-xs text-gray-400 hover:text-[#64ffda] transition-colors"
            >
              {isRegister ? 'Artıq hesabınız var? ' : 'Hesabınız yoxdur? '}
              <span className="font-semibold underline decoration-white/20 underline-offset-4">{isRegister ? 'Daxil olun' : 'Qeydiyyatdan keçin'}</span>
            </button>
          </div>
        </div>
        
        {/* Back to Home Link */}
        <div className="mt-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-white transition-colors">
            <ArrowRight className="w-3 h-3 rotate-180" /> Ana səhifəyə qayıt
          </a>
        </div>
      </div>
    </div>
  );
}

function DashboardApp() {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [session, setSession] = useState<Session>(null);
  const [loading, setLoading] = useState(true);
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Timeout — 3 saniyə ərzində cavab gəlməsə loading bitir
    const timeout = setTimeout(() => setLoading(false), 3000);

    supabase.auth.getSession().then(async ({ data }) => {
      clearTimeout(timeout);
      setSession(data.session);
      if (data.session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles').select('full_name')
          .eq('id', data.session.user.id).single();
        if (profile?.full_name) setFullName(profile.full_name);
      }
      setLoading(false);
    }).catch(() => {
      clearTimeout(timeout);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user?.id) {
        const { data: profile } = await supabase
          .from('profiles').select('full_name')
          .eq('id', session.user.id).single();
        if (profile?.full_name) setFullName(profile.full_name);
      }
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center" style={{ background: 'var(--app-bg)' }}>
        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!session) {
    return <LoginPage onLogin={setSession} />;
  }

  const displayName = fullName || session.user?.email?.split('@')[0] || 'İstifadəçi';

  return (
    <div className="relative w-screen h-screen overflow-hidden" style={{ background: 'var(--app-bg)' }}>
      <LivingCanvas />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5, background: 'radial-gradient(ellipse at 30% 20%, rgba(0,18,25,0.4) 0%, rgba(0,18,25,0.2) 50%, transparent 100%)' }} />

      <div className="relative flex h-full" style={{ zIndex: 10 }}>
        <Sidebar
          activeItem={activeNav}
          onNavigate={setActiveNav}
          onLogout={() => {
            supabase.auth.signOut().then(() => {
              setSession(null);
            });
          }}
          userEmail={session.user?.email}
          userName={displayName}
        />

        <main className="flex-1 flex flex-col h-full" style={{ marginLeft: 240 }}>
          <Header userEmail={session.user?.email} userName={displayName} activeNav={activeNav} />
          <div className="flex-1 overflow-y-auto" style={{ padding: 'var(--content-padding)', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
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
            {activeNav === 'grid'      && <GridPage />}
            {activeNav === 'devices'   && <DevicesPage />}
            {activeNav === 'forecast'  && <ForecastFullPage />}
            {activeNav === 'settings'  && <SettingsPage />}
            <div style={{ height: 24 }} />
          </div>
        </main>
      </div>

      {/* Telegram Üzən Düymə */}
      
      <a href="https://t.me/EduTrackAssistantBot"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: 28,
          right: 28,
          zIndex: 999,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'rgba(42,157,143,0.85)',
          border: '1px solid rgba(42,157,143,0.5)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(42,157,143,0.35)',
          cursor: 'pointer',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 13.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
        </svg>
      </a>

    </div>
  );
}

export default function App() {
  useEffect(() => {
    applyAppearanceSettings();
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<DashboardApp />} />
      <Route path="/dashboard" element={<DashboardApp />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
    </>
  );
}
