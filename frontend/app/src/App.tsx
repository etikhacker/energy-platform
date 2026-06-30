import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Toaster } from 'sonner';
import { Mail, Lock, User, Zap, ArrowRight, Sun, BrainCircuit, Activity, BatteryCharging } from 'lucide-react';
import LivingCanvas from './components/LivingCanvas';
import EnergyGlobe from './components/EnergyGlobe';
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
    <div className="relative min-h-screen w-full bg-[#030d0a] flex items-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top_right,rgba(100,255,218,0.1)_0%,transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.1)_0%,transparent_50%)] pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-screen py-12">
        
        {/* LEFT SIDE (Graphics) */}
        <div className="hidden lg:flex flex-col relative h-[80vh] min-h-[600px] justify-between z-20">
          <style>{`
            @keyframes strokeDash {
              to { stroke-dashoffset: -24; }
            }
            .animate-dash {
              animation: strokeDash 2s linear infinite;
            }
          `}</style>

          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00e699]/20 to-[#64ffda]/5 border border-[#64ffda]/30 flex items-center justify-center shadow-[0_0_30px_rgba(100,255,218,0.2)]">
              <Zap className="w-6 h-6 text-[#64ffda]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">EcoAI Platforması</h1>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase mt-1">Enerji İdarəetmə Sistemi</p>
            </div>
          </div>
          
          {/* Abstract Nodes Illustration */}
          <div className="relative flex-1 my-10 w-full flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,230,153,0.1)_0%,transparent_60%)]"></div>
            
            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00e699" stopOpacity="0" />
                  <stop offset="50%" stopColor="#00e699" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00e699" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#64ffda" stopOpacity="0" />
                  <stop offset="50%" stopColor="#64ffda" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#64ffda" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#00e699" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#00e699" stopOpacity="0" />
                </linearGradient>
              </defs>
              <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="url(#lineGrad)" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
              <line x1="75%" y1="20%" x2="50%" y2="50%" stroke="url(#lineGrad2)" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
              <line x1="30%" y1="75%" x2="50%" y2="50%" stroke="url(#lineGrad3)" strokeWidth="2" strokeDasharray="6 6" className="animate-dash" />
            </svg>

            {/* Central Core */}
            <div className="relative z-10 w-28 h-28 rounded-full border border-[#00e699]/40 bg-black/60 flex items-center justify-center shadow-[0_0_50px_rgba(0,230,153,0.3)] backdrop-blur-xl">
              <BrainCircuit className="w-12 h-12 text-[#00e699] animate-pulse" />
              <div className="absolute inset-[-20px] rounded-full border border-dashed border-[#00e699]/30 animate-spin-slow"></div>
              <div className="absolute inset-[-40px] rounded-full border border-[#00e699]/10" style={{ animation: 'spin 15s linear infinite reverse' }}></div>
            </div>

            {/* Solar Node (Top Right) */}
            <div className="absolute top-[10%] right-[15%] flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl border border-yellow-500/30 bg-black/50 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.2)] backdrop-blur-xl">
                <Sun className="w-6 h-6 text-yellow-400" />
              </div>
              <div className="mt-2 text-[10px] text-yellow-400/80 tracking-widest font-bold bg-black/50 px-2 py-1 rounded">SOLAR</div>
            </div>

            {/* Grid Node (Top Left) */}
            <div className="absolute top-[15%] left-[15%] flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl border border-blue-500/30 bg-black/50 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.2)] backdrop-blur-xl">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div className="mt-2 text-[10px] text-blue-400/80 tracking-widest font-bold bg-black/50 px-2 py-1 rounded">ŞƏBƏKƏ</div>
            </div>

            {/* Battery Node (Bottom Left) */}
            <div className="absolute bottom-[15%] left-[20%] flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl border border-emerald-500/30 bg-black/50 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-xl">
                <BatteryCharging className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="mt-2 text-[10px] text-emerald-400/80 tracking-widest font-bold bg-black/50 px-2 py-1 rounded">BATAREYA</div>
            </div>
          </div>

          <div className="z-20 max-w-md">
            <p className="text-sm text-gray-400 leading-relaxed border-l-2 border-[#64ffda]/50 pl-4 py-1">
              Ağıllı şəbəkəyə qoşulun, enerji istehlakınızı optimallaşdırın və karbon izini minimuma endirin. Süni intellekt əsaslı gələcək.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE (Login Form) */}
        <div className="flex justify-center lg:justify-end items-center h-full z-20">
          <div className="w-full max-w-[400px] relative mt-10 lg:mt-0">
            
            {/* The WELCOME badge (like the image) */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00e699] to-[#64ffda] text-[#030d0a] px-8 py-2 text-[10px] font-extrabold tracking-[0.2em] z-20 shadow-[0_5px_15px_rgba(100,255,218,0.3)]" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)' }}>
              {isRegister ? 'QEYDİYYAT' : 'XOŞ GƏLMİSİNİZ'}
            </div>
            
            <div className="rounded-[24px] border border-white/10 bg-[#071310]/80 p-8 pt-10 shadow-2xl backdrop-blur-xl">
              <h2 className="text-lg font-medium text-white/90 mb-8 text-center tracking-wide">
                {isRegister ? 'Yeni hesab yaradın' : 'Sistemə daxil olun'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inputs */}
                {isRegister && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-[#64ffda]/70" />
                    </div>
                    <input
                      type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ad Soyad" required
                      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#64ffda]/50 focus:bg-[#64ffda]/5 transition-all"
                    />
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-[#64ffda]/70" />
                  </div>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-poçt (ID)" required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#64ffda]/50 focus:bg-[#64ffda]/5 transition-all"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-[#64ffda]/70" />
                  </div>
                  <input
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Şifrə" required minLength={6}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#64ffda]/50 focus:bg-[#64ffda]/5 transition-all"
                  />
                </div>

                {error && (
                  <div className={`px-4 py-3 rounded-xl text-xs font-medium border ${error.includes('göndərildi') ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    {error}
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#00e699] to-[#64ffda] hover:opacity-90 text-[#030d0a] font-bold transition-all disabled:opacity-50 mt-4 shadow-[0_0_20px_rgba(0,230,153,0.3)] hover:shadow-[0_0_30px_rgba(0,230,153,0.5)]"
                >
                  {loading ? 'Gözləyin...' : (isRegister ? 'Qeydiyyat' : 'Daxil Ol')}
                </button>
              </form>

              <div className="mt-8 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => { setIsRegister(!isRegister); setError(''); setFullName(''); }}
                  className="text-gray-400 hover:text-[#64ffda] transition-colors"
                >
                  {isRegister ? 'Hesabınız var? Daxil olun' : 'Qeydiyyatdan keçin'}
                </button>
                <a href="/" className="text-gray-500 hover:text-white transition-colors">Ana səhifə</a>
              </div>
            </div>
          </div>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="relative w-screen min-h-screen lg:h-screen lg:overflow-hidden" style={{ background: 'var(--app-bg)' }}>
      <LivingCanvas />
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 5, background: 'radial-gradient(ellipse at 30% 20%, rgba(0,18,25,0.4) 0%, rgba(0,18,25,0.2) 50%, transparent 100%)' }} />

      <div className="relative flex flex-col lg:flex-row lg:h-full" style={{ zIndex: 10 }}>
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
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 flex flex-col lg:h-full lg:ml-[240px] min-w-0">
          <Header
            userEmail={session.user?.email}
            userName={displayName}
            activeNav={activeNav}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <div
            className="flex-1 overflow-y-auto"
            style={{
              padding: '0 var(--content-padding) var(--content-padding)',
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(255,255,255,0.1) transparent',
            }}
          >
            {activeNav === 'dashboard' && (
              <section className="space-y-4 pt-1.5">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: 'rgba(148,210,189,0.7)' }}>
                      Dashboard overview
                    </p>
                    <h2 className="text-2xl font-bold text-white mt-2">Enerji nəzarət paneli</h2>
                  </div>
                  <div className="hidden lg:flex items-center gap-2 text-[11px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">Real-time</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">AI assist</span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5">Grid status</span>
                  </div>
                </div>

                <DashboardCards />

                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                  <div className="col-span-12 xl:col-span-7">
                    <EnergyChart />
                  </div>
                  <div className="col-span-12 xl:col-span-5">
                    <AIAssistant />
                  </div>
                </div>

                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(12, minmax(0, 1fr))' }}>
                  <div className="col-span-12 xl:col-span-7">
                    <ForecastPanel />
                  </div>
                  <div className="col-span-12 xl:col-span-5">
                    <DeviceControl />
                  </div>
                </div>
              </section>
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
