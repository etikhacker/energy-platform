import { useState, useEffect, useRef } from "react";
import {
  Zap, ArrowRight, Play, ChevronDown,
  Brain, Activity, Leaf, TrendingDown, Globe,
  PlugZap, ScanLine, TrendingUp,
  Send, Mail, CheckCircle,
  Twitter, Linkedin, Github, Menu, X,
  Battery, Sun, BarChart3
} from "lucide-react";

/* ─── NAVBAR ─── */
function Navbar({ scrollY }: { scrollY: number }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isScrolled = scrollY > 50;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass-dark shadow-lg shadow-black/30" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a9396] to-[#2a9d8f] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(10,147,150,0.6)] transition-shadow duration-300">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Eco<span className="text-[#0a9396]">AI</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {[["#features","Xüsusiyyətlər"],["#stats","Statistika"],["#how-it-works","Necə İşləyir"],["#contact","Əlaqə"]].map(([href, label]) => (
            <a key={href} href={href} className="nav-link">{label}</a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a href="/dashboard" className="btn-outline px-5 py-2.5 rounded-xl text-sm font-semibold">
            Daxil Ol
          </a>
          <a href="#contact" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold">
            Başla
          </a>
        </div>

        <button className="md:hidden text-white/80 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-[#0a9396]/15 px-6 py-5 flex flex-col gap-4">
          {[["#features","Xüsusiyyətlər"],["#stats","Statistika"],["#how-it-works","Necə İşləyir"],["#contact","Əlaqə"]].map(([href, label]) => (
            <a key={href} href={href} className="nav-link text-base" onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <div className="flex flex-col gap-3 pt-2 border-t border-[#0a9396]/15">
            <a href="/dashboard" className="btn-outline px-5 py-2.5 rounded-xl text-sm font-semibold text-center">Daxil Ol</a>
            <a href="#contact" className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold text-center">Başla</a>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ─── */
function HeroSection() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient grid-bg">
      <div className="orb w-[600px] h-[600px] bg-[#0a9396] top-[-200px] left-[-100px] animate-orb-pulse" style={{ opacity: 0.08 }} />
      <div className="orb w-[500px] h-[500px] bg-[#2a9d8f] bottom-[-150px] right-[-100px] animate-orb-pulse" style={{ opacity: 0.07, animationDelay: "2s" }} />
      <div className="orb w-[300px] h-[300px] bg-[#94d2bd] top-[40%] left-[60%] animate-orb-pulse" style={{ opacity: 0.05, animationDelay: "1s" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-32 pb-20">
        <div className={`inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-8 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <span className="w-2 h-2 rounded-full bg-[#0a9396] animate-pulse" />
          <span className="text-[#94d2bd] text-sm font-medium">AI-Powered Energy Intelligence Platform</span>
        </div>

        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="text-white">Enerji İstehlakınızı</span>
          <br />
          <span className="shimmer-text">AI ilə Optimallaşdırın</span>
        </h1>

        <p className={`text-lg md:text-xl text-[#94d2bd]/80 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          Süni intellekt texnologiyası ilə enerji xərclərini azaldın, karbon izini minimuma endir
          və real vaxt məlumatları ilə ağıllı qərarlar qəbul et.
        </p>

        <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <a href="#contact" className="btn-primary flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold w-full sm:w-auto justify-center">
            Başla <ArrowRight className="w-4 h-4" />
          </a>
          <button
            className="btn-outline flex items-center gap-3 px-8 py-4 rounded-2xl text-base font-semibold w-full sm:w-auto justify-center"
            onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
          >
            <span className="w-9 h-9 rounded-full glass flex items-center justify-center">
              <Play className="w-4 h-4 text-[#0a9396] ml-0.5" fill="#0a9396" />
            </span>
            Demo İzlə
          </button>
        </div>

        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            { value: "450", unit: "kWh", label: "Aylıq qənaət" },
            { value: "84", unit: "%", label: "Batareya effektivliyi" },
            { value: "1.2", unit: "t", label: "CO₂ azaldıldı" },
            { value: "₼84", unit: "", label: "Aylıq qənaət" },
          ].map((s, i) => (
            <div key={i} className="glass rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold number-glow">{s.value}<span className="text-[#2a9d8f] text-lg">{s.unit}</span></div>
              <div className="text-[#94d2bd]/60 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-[#0a9396]/60" />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0a9396]/30 to-transparent" />
    </section>
  );
}

/* ─── FEATURES ─── */
const features = [
  {
    icon: Sun,
    title: "Solar Monitorinq",
    titleEn: "Solar Monitoring",
    description: "Günəş panellərinizin real vaxt gücünü, gündəlik/aylıq istehsalını və performans trendlərini izləyin. AI optimal panel bucağını hesablayır.",
    gradient: "from-[#0a9396] to-[#2a9d8f]",
    glow: "rgba(10,147,150,0.3)",
    delay: "delay-100",
  },
  {
    icon: Battery,
    title: "Batareya İdarəsi",
    titleEn: "Battery Management",
    description: "Batareyanızın şarj/boşalma tsiklini AI ilə idarə edin. Peak shaving, off-grid rejim və optimal saxlama strategiyaları avtomatik tətbiq olunur.",
    gradient: "from-[#2a9d8f] to-[#52b69a]",
    glow: "rgba(42,157,143,0.3)",
    delay: "delay-200",
  },
  {
    icon: Brain,
    title: "AI Optimizer",
    titleEn: "AI Optimizer",
    description: "Qabaqcıl ML alqoritmlərini istifadə edərək hava məlumatları, qiymət tarifi və istehlak nümunəsi əsasında enerji planı hazırlayır.",
    gradient: "from-[#52b69a] to-[#76c893]",
    glow: "rgba(82,182,154,0.3)",
    delay: "delay-300",
  },
];

function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" ref={sectionRef} className="py-28 section-gradient relative overflow-hidden">
      <div className="orb w-[400px] h-[400px] bg-[#0a9396] top-[10%] right-[-150px]" style={{ opacity: 0.05, filter: "blur(100px)" }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#0a9396]" />
            <span className="text-[#94d2bd] text-sm font-medium">Xüsusiyyətlər</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Gücünüzü <span className="shimmer-text">AI ilə kəşf edin</span>
          </h2>
          <p className="text-[#94d2bd]/70 text-lg max-w-2xl mx-auto">
            EcoAI platforması enerji idarəçiliyini sadə, ağıllı və sərfəli edir
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {features.map((f, i) => (
            <div key={i} className={`glass-card rounded-3xl p-8 group transition-all duration-700 ${f.delay} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`} style={{ boxShadow: `0 0 30px ${f.glow}` }}>
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-xs text-[#0a9396] font-semibold uppercase tracking-widest">{f.titleEn}</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3">{f.title}</h3>
                <p className="text-[#94d2bd]/70 leading-relaxed text-sm">{f.description}</p>
              </div>
              <div className="pt-4 border-t border-[#0a9396]/10">
                <a href="/dashboard" className="flex items-center gap-2 text-[#0a9396] text-sm font-medium hover:text-[#2a9d8f] transition-colors group-hover:gap-3 duration-300">
                  Dashboarda keç <span className="text-lg">→</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className={`flex flex-wrap justify-center gap-4 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            { icon: Zap, label: "Ağıllı Şəbəkə İnteqrasiyası" },
            { icon: TrendingDown, label: "Xərc Proqnozu" },
            { icon: Globe, label: "Real-vaxt Monitorinq" },
            { icon: BarChart3, label: "Detallı Analitika" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-2 glass px-5 py-3 rounded-full">
              <f.icon className="w-4 h-4 text-[#0a9396]" />
              <span className="text-[#94d2bd] text-sm font-medium">{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ─── */
function AnimatedStat({ value, unit, label, sublabel, delay, visible }: any) {
  const [displayVal, setDisplayVal] = useState("0");
  const hasAnimated = useRef(false);
  useEffect(() => {
    if (!visible || hasAnimated.current) return;
    hasAnimated.current = true;
    const numericPart = parseFloat(value.replace(/[^0-9.]/g, ""));
    const isDecimal = value.includes(".");
    const prefix = value.startsWith("₼") ? "₼" : "";
    const duration = 2000; const steps = 60;
    const increment = numericPart / steps;
    let current = 0; let step = 0;
    const timer = setInterval(() => {
      step++; current = Math.min(current + increment, numericPart);
      setDisplayVal(isDecimal ? `${prefix}${current.toFixed(1)}` : `${prefix}${Math.round(current)}`);
      if (step >= steps) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, value]);

  return (
    <div className={`text-center group transition-all duration-700 ${delay} ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}>
      <div className="relative inline-block">
        <div className="text-5xl md:text-6xl font-black number-glow mb-1">
          {displayVal}<span className="text-[#2a9d8f] text-4xl">{unit}</span>
        </div>
        <div className="absolute -inset-4 rounded-full bg-[#0a9396]/5 scale-0 group-hover:scale-100 transition-transform duration-500" />
      </div>
      <div className="text-white font-semibold text-lg mt-2">{label}</div>
      <div className="text-[#94d2bd]/50 text-sm mt-1">{sublabel}</div>
    </div>
  );
}

const stats = [
  { value: "450", unit: " kWh", label: "Aylıq qənaət", sublabel: "Ortalama ev üçün", delay: "delay-100" },
  { value: "84", unit: "%", label: "Batareya effektivliyi", sublabel: "Peak saatlarda", delay: "delay-200" },
  { value: "1.2", unit: "t", label: "CO₂ azaldıldı", sublabel: "İllik emissiya qənaəti", delay: "delay-300" },
  { value: "₼84", unit: "", label: "Aylıq qənaət", sublabel: "Ortalama xərc azalması", delay: "delay-400" },
];

function StatsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="py-24 stats-gradient relative overflow-hidden">
      <div className="orb w-[600px] h-[200px] bg-[#0a9396] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ opacity: 0.04, filter: "blur(80px)" }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#0a9396]" />
            <span className="text-[#94d2bd] text-sm font-medium">Nəticələr</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real <span className="shimmer-text">nəticələr, real qənaət</span>
          </h2>
          <p className="text-[#94d2bd]/70 text-lg max-w-xl mx-auto">
            İstifadəçilərimizin ortalama göstəriciləri əsasında hesablanmış rəqəmlər
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((s, i) => <AnimatedStat key={i} {...s} visible={visible} />)}
        </div>

        <div className={`mt-16 glass-card rounded-3xl p-8 transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="text-center md:text-left">
              <div className="text-[#0a9396] font-semibold text-sm uppercase tracking-widest mb-1">Aylıq Trendlər</div>
              <h3 className="text-white text-xl font-bold">Daim yüksələn effektivlik</h3>
            </div>
            <div className="col-span-2">
              <div className="flex items-end gap-2 h-20">
                {[40,55,45,65,58,75,70,85,78,90,88,95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                    <div className="w-full rounded-t-md transition-all duration-1000"
                      style={{ height: visible ? `${h}%` : "0%", background: `linear-gradient(180deg, #0a9396 0%, #2a9d8f 100%)`, transitionDelay: `${i * 60}ms`, opacity: 0.4 + (h / 100) * 0.6 }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[#94d2bd]/40 text-xs mt-2">
                {["Yan","Fev","Mar","Apr","May","İyn","İyl","Avq","Sen","Okt","Noy","Dek"].map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */
const steps = [
  { icon: PlugZap, step: "01", title: "Qoşulun", description: "Mövcud enerji sayğaclarınıza və ağıllı ev sistemlərinizə asanlıqla qoşulun. 5 dəqiqəlik quraşdırma ilə başlayın.", color: "#0a9396", highlights: ["Plug & Play quraşdırma", "100+ cihaz dəstəyi", "Şifrəli bağlantı"] },
  { icon: ScanLine, step: "02", title: "AI Analiz Edir", description: "Süni intellekt mühərrikimiz enerji istehlak nümunənizi öyrənir, anomaliyaları aşkar edir və şəxsi optimallaşdırma planı hazırlayır.", color: "#2a9d8f", highlights: ["Dərin öyrənmə alqoritmlərı", "Real-vaxt analizi", "Fərdi tövsiyələr"] },
  { icon: TrendingUp, step: "03", title: "Qənaət Edin", description: "AI tövsiyələrini tətbiq edin, real-vaxt dashboardu izləyin və hər ay daha az enerji xərcləyin. Nəticələr birinci aydan görünür.", color: "#52b69a", highlights: ["Avtomatik optimallaşdırma", "Aylıq hesabatlar", "ROI izləmə"] },
];

function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-28 bg-[#001219] relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-[#0a9396] bottom-[-200px] left-[-100px]" style={{ opacity: 0.05, filter: "blur(100px)" }} />
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-5">
            <span className="w-2 h-2 rounded-full bg-[#0a9396]" />
            <span className="text-[#94d2bd] text-sm font-medium">Proses</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Necə <span className="shimmer-text">işləyir?</span>
          </h2>
          <p className="text-[#94d2bd]/70 text-lg max-w-xl mx-auto">
            Sadə 3 addımla enerji istehlakınızı AI ilə idarə etməyə başlayın
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className={`relative transition-all duration-700 ${i === 0 ? "delay-100" : i === 1 ? "delay-300" : "delay-500"} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
              <div className="glass-card rounded-3xl p-8 h-full">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${step.color}22, ${step.color}44)`, border: `1px solid ${step.color}33`, boxShadow: `0 0 30px ${step.color}22` }}>
                      <step.icon className="w-8 h-8" style={{ color: step.color }} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: step.color }}>
                      {i + 1}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: step.color }}>Addım {step.step}</span>
                    <h3 className="text-xl font-bold text-white mt-1">{step.title}</h3>
                  </div>
                </div>
                <p className="text-[#94d2bd]/70 text-sm leading-relaxed mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.highlights.map((h, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-[#94d2bd]/80">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: step.color }} />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute top-14 -right-4 z-10 w-8 h-8 items-center justify-center">
                  <div className="w-8 h-8 rounded-full glass flex items-center justify-center text-[#0a9396]" style={{ border: "1px solid rgba(10,147,150,0.3)" }}>→</div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={`mt-16 text-center transition-all duration-700 delay-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <a href="/dashboard" className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-2xl text-base font-semibold">
            Dashboard-a keç — Pulsuz Sınaq
          </a>
          <p className="text-[#94d2bd]/40 text-sm mt-3">Kredit kartı tələb edilmir</p>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubmitted(true); setEmail(""); }
  };

  return (
    <section id="contact" ref={sectionRef} className="py-28 section-gradient relative overflow-hidden">
      <div className="orb w-[500px] h-[500px] bg-[#0a9396] top-[-100px] right-[-100px]" style={{ opacity: 0.08, filter: "blur(100px)" }} />
      <div className="orb w-[400px] h-[400px] bg-[#2a9d8f] bottom-[-100px] left-[-100px]" style={{ opacity: 0.06, filter: "blur(100px)" }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className={`glass-card rounded-3xl p-12 text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`} style={{ background: "rgba(10,147,150,0.06)", border: "1px solid rgba(10,147,150,0.2)" }}>
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <span className="w-2 h-2 rounded-full bg-[#0a9396] animate-pulse" />
            <span className="text-[#94d2bd] text-sm font-medium">30 günlük pulsuz sınaq</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Enerjinizi ağıllı idarə etməyə{" "}
            <span className="shimmer-text">hazırsınız?</span>
          </h2>
          <p className="text-[#94d2bd]/70 text-lg max-w-2xl mx-auto mb-10">
            30 günlük pulsuz sınaq ilə EcoAI-nin güclü imkanlarını kəşf edin.
            Kredit kartı tələb edilmir, istənilən vaxt ləğv edə bilərsiniz.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="w-12 h-12 text-[#0a9396]" />
              <p className="text-white font-semibold text-lg">Qeydiyyatınız qəbul edildi!</p>
              <p className="text-[#94d2bd]/60 text-sm">Yaxında sizinlə əlaqə saxlayacağıq.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0a9396]/60" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="email@şirkət.az"
                  className="w-full pl-10 pr-4 py-4 rounded-xl text-white placeholder-[#94d2bd]/40 text-sm outline-none focus:border-[#0a9396] transition-colors"
                  style={{ background: "rgba(0,18,25,0.6)", border: "1px solid rgba(10,147,150,0.25)" }}
                  required
                />
              </div>
              <button type="submit" className="btn-primary flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold whitespace-nowrap">
                <Send className="w-4 h-4" /> Pulsuz Başla
              </button>
            </form>
          )}

          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {["Kredit kartı yoxdur", "Hər zaman ləğv", "Texniki dəstək 7/24"].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-[#94d2bd]/50 text-sm">
                <CheckCircle className="w-3.5 h-3.5 text-[#0a9396]" /> {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
const footerLinks: Record<string, string[]> = {
  Məhsul: ["Dashboard", "Analitika", "AI Optimizer", "Grid İdarəsi"],
  Şirkət: ["Haqqımızda", "Komanda", "Karyera", "Press"],
  Resurslar: ["Sənədlər", "API", "Bloq", "Dəstək"],
  Hüquqi: ["Məxfilik", "İstifadə Şərtləri", "Cookies", "GDPR"],
};

function Footer() {
  return (
    <footer className="bg-[#000d14] border-t border-[#0a9396]/10 relative overflow-hidden">
      <div className="orb w-[400px] h-[200px] bg-[#0a9396] top-0 left-1/2 -translate-x-1/2" style={{ opacity: 0.03, filter: "blur(80px)" }} />
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#0a9396] to-[#2a9d8f] flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Eco<span className="text-[#0a9396]">AI</span>
              </span>
            </a>
            <p className="text-[#94d2bd]/50 text-sm leading-relaxed mb-5 max-w-xs">
              AI-powered enerji optimallaşdırma platforması. Daha az enerji, daha çox qənaət, daha yaşıl gələcək.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Linkedin, Github, Mail].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-[#94d2bd]/50 hover:text-[#0a9396] transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-[#94d2bd]/50 text-sm hover:text-[#0a9396] transition-colors duration-200">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#0a9396]/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#94d2bd]/30 text-sm">© 2026 EcoAI. Bütün hüquqlar qorunur.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0a9396] animate-pulse" />
            <span className="text-[#94d2bd]/40 text-sm">Bütün sistemlər işləyir</span>
          </div>
          <p className="text-[#94d2bd]/30 text-sm">Azərbaycan, Bakı 🌱</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── MAIN CSS (injected) ─── */
const css = `
  .glass { background: rgba(10,147,150,0.06); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(10,147,150,0.15); }
  .glass-dark { background: rgba(0,18,25,0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(10,147,150,0.2); }
  .glass-card { background: rgba(10,147,150,0.04); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(10,147,150,0.12); transition: all 0.3s ease; }
  .glass-card:hover { background: rgba(10,147,150,0.1); border-color: rgba(10,147,150,0.35); transform: translateY(-4px); box-shadow: 0 20px 60px rgba(10,147,150,0.2); }
  .shimmer-text { background: linear-gradient(90deg,#0a9396,#2a9d8f,#94d2bd,#2a9d8f,#0a9396); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: shimmer 4s linear infinite; }
  .btn-primary { background: linear-gradient(135deg,#0a9396,#2a9d8f); color: white; border: 1px solid rgba(10,147,150,0.4); transition: all 0.3s ease; position: relative; overflow: hidden; }
  .btn-primary:hover { background: linear-gradient(135deg,#2a9d8f,#0a9396); box-shadow: 0 8px 30px rgba(10,147,150,0.4); transform: translateY(-2px); }
  .btn-outline { background: transparent; color: #94d2bd; border: 1px solid rgba(10,147,150,0.4); transition: all 0.3s ease; }
  .btn-outline:hover { background: rgba(10,147,150,0.1); border-color: #0a9396; color: white; transform: translateY(-2px); }
  .nav-link { color: rgba(148,210,189,0.7); transition: color 0.2s ease; font-size: 0.9rem; font-weight: 500; }
  .nav-link:hover { color: #0a9396; }
  .number-glow { color: #0a9396; text-shadow: 0 0 20px rgba(10,147,150,0.5); }
  .orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
  .hero-gradient { background: radial-gradient(ellipse at 20% 20%, rgba(10,147,150,0.15) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(42,157,143,0.12) 0%, transparent 50%), linear-gradient(180deg,#001219 0%,#001e2b 100%); }
  .section-gradient { background: linear-gradient(180deg,#001219 0%,#001c28 50%,#001219 100%); }
  .stats-gradient { background: linear-gradient(135deg,rgba(10,147,150,0.08) 0%,rgba(42,157,143,0.05) 100%); border-top: 1px solid rgba(10,147,150,0.15); border-bottom: 1px solid rgba(10,147,150,0.15); }
  .grid-bg { background-image: linear-gradient(rgba(10,147,150,0.04) 1px, transparent 1px), linear-gradient(90deg,rgba(10,147,150,0.04) 1px,transparent 1px); background-size: 60px 60px; }
  @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes orb-pulse { 0%,100% { transform: scale(1); opacity:0.4; } 50% { transform: scale(1.15); opacity:0.7; } }
  .animate-orb-pulse { animation: orb-pulse 4s ease-in-out infinite; }
  .delay-100 { transition-delay: 100ms; } .delay-200 { transition-delay: 200ms; } .delay-300 { transition-delay: 300ms; }
  .delay-400 { transition-delay: 400ms; } .delay-500 { transition-delay: 500ms; } .delay-700 { transition-delay: 700ms; }
`;

/* ─── LANDING PAGE ─── */
export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="min-h-screen bg-[#001219] text-white overflow-x-hidden">
        <Navbar scrollY={scrollY} />
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <HowItWorksSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}