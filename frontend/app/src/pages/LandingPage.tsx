import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Zap,
  Sun,
  BatteryCharging,
  BrainCircuit,
  Plug,
  Sparkles,
  PiggyBank,
  Send,
  Mail,
  Linkedin,
  Github,
  Facebook,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Leaf,
  TrendingUp,
  Check,
  Cpu,
  Globe
} from "lucide-react";
import { toast } from "sonner";

// --- STRUCTURAL DATA & TYPES ---
interface NavItem {
  label: string;
  href: string;
}

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  tag: string;
  glow: string;
}

interface StepItem {
  n: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

interface FooterCol {
  title: string;
  links: string[];
}

const nav: NavItem[] = [
  { label: "Xüsusiyyətlər", href: "#features" },
  { label: "Statistika", href: "#stats" },
  { label: "Necə İşləyir", href: "#how" },
  { label: "Əlaqə", href: "#contact" },
];

const features: FeatureItem[] = [
  {
    icon: Sun,
    title: "Ağıllı Solar İnteqrasiya",
    desc: "Süni intellekt günəş panellərinizin istehsal gücünü hava proqnozu alqoritmləri ilə saniyəbəsaniyə analiz edir.",
    tag: "SOLAR AI",
    glow: "rgba(234, 179, 8, 0.15)"
  },
  {
    icon: BatteryCharging,
    title: "Dinamik Batareya Balansı",
    desc: "Enerji tariflərinin baha olduğu saatlarda sistem avtomatik olaraq batareyadan istifadəyə keçir.",
    tag: "SMART GRID",
    glow: "rgba(16, 185, 129, 0.15)"
  },
  {
    icon: BrainCircuit,
    title: "Neyron İstehlak Analizi",
    desc: "Evinizin gündəlik enerji vərdişləri neyron şəbəkələr tərəfindən öyrənilir və israfın qarşısı alınır.",
    tag: "NEURAL OPT",
    glow: "rgba(6, 182, 212, 0.15)"
  },
];

const steps: StepItem[] = [
  { n: "01", icon: Plug, title: "Saniyələr İçində Qoşulma", desc: "Mövcud invertor və ağıllı sayğacınıza heç bir əlavə fiziki müdaxilə olmadan, rəqəmsal olaraq inteqrasiya olunur." },
  { n: "02", icon: Sparkles, title: "Süni İntellekt Analizi", desc: "Sistem evinizin enerji profilini çıxarır, anomal yüklənmələri təyin edir və şəxsi strategiya hazırlayır." },
  { n: "03", icon: PiggyBank, title: "Avtomatlaşdırılmış Qənaət", desc: "EcoAI sizin yerinizə qərarlar qəbul edərək aylıq enerji xərclərini 40%-ə qədər aşağı salır." },
];

const footerCols: FooterCol[] = [
  { title: "Məhsul", links: ["Dashboard", "Analitika", "AI Optimizer", "Grid İdarəsi"] },
  { title: "Şirkət", links: ["Haqqımızda", "Komanda", "Karyera", "Press"] },
  { title: "Resurslar", links: ["Sənədlər", "API", "Bloq", "Dəstək"] },
  { title: "Hüquqi", links: ["Məxfilik", "İstifadə Şərtləri", "Cookies", "GDPR"] },
];

// --- LOGO KOMPONENTİ ---
function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 group">
      <span className="relative grid place-items-center w-9 h-9 rounded-xl backdrop-blur-md bg-white/10 border border-white/10">
        <Zap className="w-5 h-5 text-[#64ffda] drop-shadow-[0_0_8px_rgba(100,255,218,0.7)]" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Eco<span className="text-[#64ffda]">AI</span>
      </span>
    </a>
  );
}

// --- İNTERAKTİV 3D ENERJİ ŞƏBƏKƏSİ ---
function Interactive3DGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];
    const count = 120;
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 250 + Math.random() * 100;

      particles.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        ox: r * Math.sin(phi) * Math.cos(theta),
        oy: r * Math.sin(phi) * Math.sin(theta),
        oz: r * Math.cos(phi),
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.0015;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.0015;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    const rotate = (
      p: { x: number; y: number; z: number },
      angleX: number,
      angleY: number
    ) => {
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y1 = p.y * cosX - p.z * sinX;
      const z1 = p.y * sinX + p.z * cosX;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x2 = p.x * cosY + z1 * sinY;
      const z2 = -p.x * sinY + z1 * cosY;

      return { x: x2, y: y1, z: z2 };
    };

    let angleX = 0;
    let angleY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      angleX = mouseRef.current.y + 0.002;
      angleY = mouseRef.current.x + 0.003;

      const projected: { x: number; y: number; depth: number }[] = [];

      particles.forEach((p) => {
        const rotated = rotate(p, angleX, angleY);
        p.x = rotated.x;
        p.y = rotated.y;
        p.z = rotated.z;

        const fov = 400;
        const distance = 600;
        const scale = fov / (fov + p.z + distance);
        const projX = p.x * scale + width / 2;
        const projY = p.y * scale + height / 2;

        projected.push({ x: projX, y: projY, depth: p.z });
      });

      ctx.lineWidth = 0.5;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dist = Math.hypot(projected[i].x - projected[j].x, projected[i].y - projected[j].y);
          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.15;
            ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
            ctx.stroke();
          }
        }
      }

      projected.forEach((p) => {
        const size = Math.max(1, (200 - p.depth) * 0.015);
        const alpha = Math.max(0.1, (200 - p.depth) * 0.004);
        ctx.fillStyle = `rgba(100, 255, 218, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 -z-10 block opacity-40" />;
}

// --- 3D TILT CARD ---
function TiltCard({
  children,
  className = "",
  intensity = 10,
  style = {},
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  style?: React.CSSProperties;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rY = (mouseX / (width / 2)) * intensity;
    const rX = -(mouseY / (height / 2)) * intensity;

    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-all duration-300 ease-out ${className}`}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  );
}

// --- MAIN PAGE ---
export default function LandingPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Zəhmət olmasa ad və e-mail daxil edin");
      return;
    }
    setLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      await supabase.from('muracietler').insert({
        tam_ad: form.name,
        email: form.email,
        mobil: form.phone || null,
        oxunub: false,
      });
      toast.success("Müraciətiniz qəbul edildi", {
        description: "Komandamız tezliklə sizinlə əlaqə saxlayacak."
      });
      setForm({ name: "", email: "", phone: "" });
    } catch {
      toast.error("Xəta baş verdi, yenidən cəhd edin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030d0a] text-white selection:bg-[#64ffda]/30 selection:text-white overflow-hidden">
      
      <Interactive3DGrid />

      {/* Gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[rgba(100,255,218,0.03)] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[rgba(16,185,129,0.03)] blur-[120px]" />
      </div>

      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 px-6 pt-6">
        <nav className="mx-auto max-w-7xl backdrop-blur-xl bg-black/20 border border-white/5 rounded-2xl px-6 py-4 flex items-center justify-between">
          <Logo />
          <ul className="hidden md:flex items-center gap-10 text-sm font-medium text-gray-400">
            {nav.map((n: NavItem) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-[#64ffda] transition-colors duration-300">{n.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <a href="/login" className="hidden sm:inline-flex text-sm text-gray-300 hover:text-white font-medium transition">
              Daxil Ol
            </a>
            <a href="#contact" className="relative group overflow-hidden px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#00e699]/10 border border-[#00e699]/30 text-[#00e699] hover:text-white transition-all duration-300">
              <span className="absolute inset-0 bg-[#00e699] translate-y-full group-hover:translate-y-0 transition-transform duration-300 -z-10" />
              Müraciət et
            </a>
          </div>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-44 pb-32 px-6">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#64ffda]/20 bg-[#64ffda]/5 text-xs font-semibold tracking-wider text-[#64ffda]">
              <Cpu className="w-3.5 h-3.5" />
              ECO-ENERGY REVOLUTION · BETA V2.4
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-white to-gray-500 bg-clip-text text-transparent">
              Enerji Gələcəyini <br />
              <span className="text-shimmer bg-gradient-to-r from-[#64ffda] via-[#00e699] to-[#64ffda]">AI İlə Qur</span>
            </h1>

            <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
              Mürəkkəb enerji axınlarını avtomatlaşdırın. Süni intellekt əsaslı EcoAI platforması evinizi ağıllı şəbəkəyə inteqrasiya edərək karbon izini minimuma endirir.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="#contact" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-[#00e699] text-[#030d0a] font-bold hover:bg-[#00cc88] shadow-[0_0_30px_rgba(0,230,153,0.3)] hover:shadow-[0_0_40px_rgba(0,230,153,0.5)] transition-all duration-300">
                Sistemi Sına <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#how" className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all">
                <PlayCircle className="w-5 h-5 text-[#64ffda]" /> İşləmə Mexanizmi
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-8 pt-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#64ffda]" /> GDPR UYĞUN SİSTEM</div>
              <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-[#64ffda]" /> CANLI BULUD İDARƏSİ</div>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            <TiltCard intensity={15} className="relative w-full max-w-[500px] aspect-square rounded-[40px] border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-8 shadow-2xl backdrop-blur-md flex flex-col justify-between" style={{ transformStyle: "preserve-3d" }}>
              
              <div className="absolute inset-4 rounded-[32px] border border-[#64ffda]/10 pointer-events-none" style={{ transform: "translateZ(30px)" }} />
              <div className="absolute inset-10 rounded-[24px] border border-[#64ffda]/5 pointer-events-none" style={{ transform: "translateZ(60px)" }} />

              <div className="flex justify-between items-start" style={{ transform: "translateZ(80px)" }}>
                <div>
                  <span className="text-[10px] tracking-[0.2em] text-[#64ffda] uppercase font-bold">CANLI SİSTEM</span>
                  <h3 className="text-xl font-bold mt-1">Ağıllı Şəbəkə</h3>
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  AKTİV AI
                </div>
              </div>

              <div className="my-auto flex flex-col items-center justify-center text-center py-6" style={{ transform: "translateZ(110px)" }}>
                <div className="relative w-40 h-40 rounded-full border border-[#64ffda]/20 flex items-center justify-center bg-[#64ffda]/5 shadow-[0_0_50px_rgba(100,255,218,0.1)]">
                  <div className="absolute inset-2 rounded-full border border-dashed border-[#64ffda]/40 animate-spin-slow" />
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block">EFFEKTİVLİK</span>
                    <span className="text-4xl font-extrabold text-[#64ffda]">+38.4%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6" style={{ transform: "translateZ(90px)" }}>
                <div>
                  <span className="text-[10px] text-gray-500 block">AYLIQ TƏSƏRRÜFAT</span>
                  <span className="text-lg font-bold text-white">₼142.00</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">KARBON İZİ AZALMA</span>
                  <span className="text-lg font-bold text-[#00e699]">2.4 Ton</span>
                </div>
              </div>

            </TiltCard>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="relative py-32 px-6 border-t border-white/5">
        <div className="mx-auto max-w-7xl">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[#64ffda] text-xs font-bold tracking-[0.3em] uppercase">MÖHTƏŞƏM FUNKSİONALLIQ</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">EcoAI Nə Edir?</h2>
            <p className="text-gray-400">Tamamilə avtomatlaşdırılmış idarəetmə ilə enerjinizi ağıllı şəkildə bölüşdürün.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f: FeatureItem, i: number) => (
              <TiltCard key={i} intensity={8} className="relative group rounded-3xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-8 hover:border-[#64ffda]/20 transition-all duration-500" style={{ transformStyle: "preserve-3d" }}>
                
                <div 
                  className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-500"
                  style={{ 
                    background: f.glow, 
                    filter: "blur(40px)",
                    transform: "translateZ(-10px)"
                  }} 
                />

                <div className="w-12 h-12 rounded-2xl bg-[#64ffda]/10 border border-[#64ffda]/20 flex items-center justify-center text-[#64ffda] mb-8" style={{ transform: "translateZ(40px)" }}>
                  <f.icon className="w-6 h-6" />
                </div>

                <div className="space-y-3" style={{ transform: "translateZ(60px)" }}>
                  <span className="text-[10px] font-bold text-[#64ffda] tracking-widest">{f.tag}</span>
                  <h3 className="text-2xl font-bold text-white">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>

              </TiltCard>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative py-24 px-4 border-t border-white/5 bg-black/10">
        <div className="mx-auto max-w-6xl">
          
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <span className="text-[#64ffda] text-xs font-bold tracking-[0.3em] uppercase">SADƏ VƏ SÜRLƏTLİ</span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Cəmi 3 Addımda Qoşulma</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10 relative">
            {steps.map((s: StepItem, i: number) => (
              <TiltCard key={i} intensity={5} className="relative rounded-3xl border border-white/5 bg-white/5 p-8 flex flex-col justify-between min-h-[300px]" style={{ transformStyle: "preserve-3d" }}>
                <div className="flex justify-between items-start" style={{ transform: "translateZ(40px)" }}>
                  <span className="text-5xl font-extrabold text-[#64ffda]/10">{s.n}</span>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#64ffda]">
                    <s.icon className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="space-y-2 mt-8" style={{ transform: "translateZ(60px)" }}>
                  <h4 className="text-xl font-bold text-white">{s.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>

        </div>
      </section>

      {/* CONTACT FORM */}
      <section id="contact" className="relative py-32 px-6 border-t border-white/5">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[40px] border border-white/5 bg-gradient-to-br from-white/5 to-transparent p-10 md:p-16 relative overflow-hidden grid md:grid-cols-2 gap-12 items-center">
            
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#64ffda]/3 blur-[120px] -z-10" />

            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest text-[#64ffda] uppercase">PULSUZ ENERJİ AUDİTİ</span>
              <h3 className="text-4xl font-bold leading-tight">Gələcəyin Enerjisini Bu Gün Sınayın</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Müraciət edin və sizin üçün evinizin mövcud tariflərə uyğun pulsuz qənaət simulyasiyasını hazırlayaq.
              </p>
              
              <ul className="space-y-4 pt-4 text-sm text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]"><Check className="w-3 h-3" /></span>
                  14 Günlük öhdəliksiz sınaq müddəti
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#64ffda]/10 flex items-center justify-center text-[#64ffda]"><Check className="w-3 h-3" /></span>
                  Canlı ROI (Tərs İnvestisiya) hesabatı
                </li>
              </ul>
            </div>

            <form onSubmit={onSubmit} className="space-y-4 backdrop-blur-md bg-black/20 border border-white/5 rounded-2xl p-6 md:p-8">
              <label className="block space-y-2">
                <span className="text-xs text-gray-400">Ad Soyad</span>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Adınız və Soyadınız"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#64ffda] outline-none transition duration-300 text-sm"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs text-gray-400">E-mail</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nümunə@ecoai.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#64ffda] outline-none transition duration-300 text-sm"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-xs text-gray-400">Telefon nömrəsi</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+994 (50) 000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#64ffda] outline-none transition duration-300 text-sm"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 rounded-xl bg-[#00e699] text-[#030d0a] font-bold hover:bg-[#00cc88] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-[#030d0a] border-t-transparent rounded-full animate-spin" />
                    Göndərilir...
                  </>
                ) : (
                  <>
                    Yoxla <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative pt-20 pb-12 px-6 border-t border-white/5 bg-[#010604]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-12 mb-16">
            
            <div className="md:col-span-4 space-y-4">
              <Logo />
              <p className="text-sm text-gray-500 max-w-xs">
                Süni intellekt əsaslı yaşıl enerji optimallaşdırma platforması.
              </p>
              <div className="flex gap-3 pt-2">
                {[
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/omar-babayev-21888437b" },
                  { Icon: Github, href: "https://github.com/etikhacker" },
                  { Icon: Mail, href: "mailto:babayev.omr.23@gmail.com" },
                  { Icon: Send, href: "https://t.me/@EduTrackAssistantBot" },
                  { Icon: Facebook, href: "https://www.facebook.com/share/1BWb7iSsQ9/"}
                ].map(({ Icon, href }: { Icon: React.ComponentType<{ className?: string }>; href: string }, i: number) => (
                  <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#64ffda]/10 hover:border-[#64ffda]/30 transition duration-300">
                    <Icon className="w-4 h-4 text-[#64ffda]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerCols.map((c: FooterCol, i: number) => (
                <div key={i}>
                  <h4 className="text-sm font-bold text-white mb-4">{c.title}</h4>
                  <ul className="space-y-2 text-sm text-gray-500">
                    {c.links.map((l: string, j: number) => (
                      <li key={j}>
                        <a href="#" className="hover:text-[#64ffda] transition duration-300">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
            <p>© 2026 EcoAI. Bütün hüquqlar qorunur.</p>
            <p>Made with ⚡ in Baku</p>
          </div>
        </div>
      </footer>

    </div>
  );
}