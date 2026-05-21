import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  Zap,
  Sun,
  BatteryCharging,
  BrainCircuit,
  Plug,
  Sparkles,
  PiggyBank,
  Twitter,
  Linkedin,
  Github,
  Facebook,
  ArrowRight,
  PlayCircle,
  ShieldCheck,
  Leaf,
  TrendingUp,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import featSolar from "@/assets/feature-solar.jpg";
import featBattery from "@/assets/feature-battery.jpg";
import featAI from "@/assets/feature-ai.jpg";

const nav = [
  { label: "Xüsusiyyətlər", href: "#features" },
  { label: "Statistika", href: "#stats" },
  { label: "Necə İşləyir", href: "#how" },
  { label: "Əlaqə", href: "#contact" },
];

const heroStats = [
  { value: "450", unit: "kWh", label: "Aylıq qənaət", icon: Zap },
  { value: "84", unit: "%", label: "Batareya effektivliyi", icon: BatteryCharging },
  { value: "1.2t", unit: "CO₂", label: "Karbon azaldıldı", icon: Leaf },
  { value: "₼84", unit: "", label: "Aylıq qənaət", icon: PiggyBank },
];

const features = [
  {
    icon: Sun,
    title: "Solar Monitorinq",
    desc: "Günəş panellərinizin real vaxt gücünü, verimliliyini və hava şəraitinə uyğun proqnozlarını izləyin.",
    img: featSolar,
    tag: "Real-time",
  },
  {
    icon: BatteryCharging,
    title: "Batareya İdarəsi",
    desc: "AI ilə optimal şarj/boşalma idarəsi — bahalı saatlarda şəbəkədən deyil, batareyadan istifadə.",
    img: featBattery,
    tag: "Smart",
  },
  {
    icon: BrainCircuit,
    title: "AI Optimizer",
    desc: "ML alqoritmləri evinizin istehlak nümunəsini öyrənir və şəxsi enerji planı yaradır.",
    img: featAI,
    tag: "ML",
  },
];

const steps = [
  { n: "01", icon: Plug, title: "Qoşulun", desc: "Mövcud invertor və sayğaclara 5 dəqiqəlik quraşdırma. Heç bir əlavə avadanlıq tələb olunmur." },
  { n: "02", icon: Sparkles, title: "AI Analiz Edir", desc: "ML alqoritmləri istehlak nümunənizi, tarif saatlarını və hava proqnozunu öyrənir." },
  { n: "03", icon: PiggyBank, title: "Qənaət Edin", desc: "Avtomatik optimallaşdırma ilə xərclər 40%-ə qədər azalır, karbon izi minimuma enir." },
];

const months = ["Yan", "Fev", "Mar", "Apr", "May", "İyn", "İyl", "Avq", "Sen", "Okt", "Noy", "Dek"];
const barData = [42, 58, 51, 67, 73, 81, 88, 84, 76, 69, 78, 92];

const trustLogos = ["AZER ENERJI", "BAKU SOLAR", "GREEN GRID", "VOLT-X", "ECO LAB", "POWER+"];

const footerCols = [
  { title: "Məhsul", links: ["Dashboard", "Analitika", "AI Optimizer", "Grid İdarəsi"] },
  { title: "Şirkət", links: ["Haqqımızda", "Komanda", "Karyera", "Press"] },
  { title: "Resurslar", links: ["Sənədlər", "API", "Bloq", "Dəstək"] },
  { title: "Hüquqi", links: ["Məxfilik", "İstifadə Şərtləri", "Cookies", "GDPR"] },
];

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 group">
      <span className="relative grid place-items-center w-9 h-9 rounded-xl glass-strong">
        <Zap className="w-5 h-5 text-[hsl(168_47%_71%)] drop-shadow-[0_0_8px_hsl(168_47%_71%/0.7)]" strokeWidth={2.5} />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Eco<span className="text-[hsl(168_47%_71%)]">AI</span>
      </span>
    </a>
  );
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            e.target.classList.add("animate-fade-up");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      el.style.opacity = "0";
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

export default function LandingPage() {
  useReveal();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
  setChartVisible(true);
}, []);

  const onSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!form.name || !form.email) {
    toast.error("Zəhmət olmasa ad və e-mail daxil edin");
    return;
  }
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
      description: "Komandamız tezliklə sizinlə əlaqə saxlayacaq."
    });
    setForm({ name: "", email: "", phone: "" });
  } catch {
    toast.error("Xəta baş verdi, yenidən cəhd edin");
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden text-foreground">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-overlay" />
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[hsl(182_88%_31%/0.35)] blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-[hsl(168_47%_71%/0.18)] blur-[140px] animate-float-slow" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-[hsl(182_88%_41%/0.22)] blur-[130px] animate-float" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 pt-4">
        <nav className="mx-auto max-w-7xl glass rounded-2xl px-5 py-3 flex items-center justify-between">
          <Logo />
          <ul className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="hover:text-[hsl(168_47%_71%)] transition-colors">{n.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href="/login" className="hidden sm:inline-flex items-center px-4 py-2 rounded-xl text-sm border border-[hsl(168_47%_71%/0.3)] text-[hsl(168_47%_71%)] hover:bg-[hsl(168_47%_71%/0.1)] transition">
  Daxil Ol
</a>
            <a href="#contact" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-[hsl(182_88%_31%)] text-white hover:bg-[hsl(182_88%_36%)] shadow-[0_8px_24px_-8px_hsl(182_88%_31%/0.8)] transition">
              Müraciət et <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </nav>
      </header>

      {/* Hero — split layout with dashboard image */}
      <section className="relative pt-40 md:pt-48 pb-20 px-4">
        <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <div data-reveal className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs text-[hsl(168_47%_71%)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(168_47%_71%)] animate-pulse" />
              AI-powered enerji platforması · Beta v2.4
            </div>
            <h1 data-reveal className="mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Enerji İstehlakınızı<br />
              <span className="text-shimmer">AI ilə Optimallaşdırın</span>
            </h1>
            <p data-reveal className="mt-5 max-w-xl text-base md:text-lg text-muted-foreground">
              Süni intellekt texnologiyası ilə enerji xərclərini azaldın, karbon izini minimuma endirin və evinizi ağıllı şəbəkəyə qoşun.
            </p>
            <div data-reveal className="mt-7 flex flex-wrap gap-3">
              <a href="#contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[hsl(182_88%_31%)] text-white font-medium hover:bg-[hsl(182_88%_36%)] shadow-[0_12px_32px_-10px_hsl(182_88%_31%/0.9)] transition">
                Başla <ArrowRight className="w-4 h-4" />
              </a>
              <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass hover:bg-[hsl(168_47%_71%/0.08)] transition">
                <PlayCircle className="w-5 h-5 text-[hsl(168_47%_71%)]" /> Demo İzlə
              </button>
            </div>
            <div data-reveal className="mt-8 flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-[hsl(168_47%_71%)]" /> GDPR uyğun</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[hsl(168_47%_71%)]" /> 14 gün pulsuz sınaq</div>
              <div className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[hsl(168_47%_71%)]" /> Kart tələb olunmur</div>
            </div>
          </div>

          <div data-reveal className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden glass-strong p-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-[hsl(182_88%_31%/0.4)] via-transparent to-[hsl(168_47%_71%/0.25)]" />
              <img
                src={heroDashboard}
                alt="EcoAI dashboard"
                width={1600}
                height={1100}
                className="relative rounded-2xl w-full h-auto"
              />
            </div>
            {/* Floating mini cards */}
            <div className="absolute -left-4 md:-left-10 top-10 glass rounded-2xl p-4 w-44 hidden md:block animate-float">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-[hsl(168_47%_71%)]" /> Bu gün
              </div>
              <div className="mt-1 text-2xl font-semibold">+24%</div>
              <div className="text-[10px] text-muted-foreground">enerji effektivliyi</div>
            </div>
            <div className="absolute -right-2 md:-right-8 bottom-8 glass rounded-2xl p-4 w-48 hidden md:block animate-float-slow">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Leaf className="w-4 h-4 text-[hsl(168_47%_71%)]" /> CO₂ qənaəti
              </div>
              <div className="mt-1 text-2xl font-semibold">1.2 ton</div>
              <div className="h-1 mt-2 rounded-full bg-[hsl(168_47%_71%/0.15)] overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-[hsl(182_88%_31%)] to-[hsl(168_47%_71%)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero stat strip */}
        <div data-reveal className="mx-auto max-w-7xl mt-20 grid grid-cols-2 md:grid-cols-4 gap-4">
          {heroStats.map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5 hover:-translate-y-1 transition group border border-[hsl(168_47%_71%/0.2)]">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl grid place-items-center bg-[hsl(182_88%_31%/0.2)] border border-[hsl(168_47%_71%/0.2)] group-hover:scale-110 transition">
                  <s.icon className="w-4 h-4 text-[hsl(168_47%_71%)]" />
                </div>
                <TrendingUp className="w-4 h-4 text-[hsl(168_47%_71%/0.6)]" />
              </div>
              <div className="mt-4 text-2xl md:text-3xl font-semibold">
                {s.value}<span className="text-base text-[hsl(168_47%_71%)] ml-1">{s.unit}</span>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-10 px-4 border-y border-[hsl(168_47%_71%/0.08)]">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
            Qabaqcıl şirkətlər tərəfindən etibar edilir
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4 opacity-60">
            {trustLogos.map((l) => (
              <span key={l} className="text-sm font-semibold tracking-wider text-muted-foreground">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features — with images */}
      <section id="features" className="relative py-24 px-4">
        <div className="mx-auto max-w-7xl">
          <div data-reveal className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-sm uppercase tracking-[0.2em] text-[hsl(168_47%_71%)]">Xüsusiyyətlər</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
              Ağıllı enerji üçün <span className="text-shimmer">tam həll</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Solar paneldən batareyaya, evdən şəbəkəyə — bütün enerji axınınızı bir platformadan idarə edin.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div data-reveal key={f.title} className="glass rounded-3xl overflow-hidden group hover:border-[hsl(168_47%_71%/0.35)] transition flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={f.img}
                    alt={f.title}
                    loading="lazy"
                    width={900}
                    height={700}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg-deep))] via-[hsl(var(--bg-deep)/0.3)] to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider glass text-[hsl(168_47%_71%)]">
                    {f.tag}
                  </span>
                  <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl grid place-items-center glass-strong">
                    <f.icon className="w-5 h-5 text-[hsl(168_47%_71%)]" />
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{f.desc}</p>
                  <a href="#" className="mt-5 inline-flex items-center gap-1.5 text-sm text-[hsl(168_47%_71%)] hover:gap-2.5 transition-all">
                    Daha çox <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats + chart */}
      <section id="stats" className="relative py-24 px-4">
        <div className="mx-auto max-w-7xl glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[hsl(182_88%_31%/0.25)] blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-[hsl(168_47%_71%/0.18)] blur-3xl" />
          <div className="relative">
            <div data-reveal className="text-center mb-10">
              <p className="text-sm uppercase tracking-[0.2em] text-[hsl(168_47%_71%)]">Statistika</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
                Ölçülə bilən <span className="text-shimmer">nəticələr</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {heroStats.map((s) => (
                <div data-reveal key={s.label} className="text-center glass rounded-2xl p-6 border border-[hsl(168_47%_71%/0.3)]">
                  <div className="text-4xl md:text-5xl font-semibold text-shimmer">
                    {s.value}<span className="text-2xl ml-0.5">{s.unit}</span>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>

            <div ref={chartRef} className="glass rounded-2xl p-6 min-h-[200px]">
              <div className="flex items-end justify-between mb-4 flex-wrap gap-3">
                <div>
                  <h3 className="text-lg font-semibold">Aylıq enerji qənaəti</h3>
                  <p className="text-xs text-muted-foreground">2025 — kWh / ay</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-t from-[hsl(182_88%_31%)] to-[hsl(168_47%_71%)]" />
                    Qənaət
                  </span>
                  <span className="text-[hsl(168_47%_71%)]">+18% YoY</span>
                </div>
              </div>
              <div className="flex items-end gap-2 md:gap-3 h-64">
                {barData.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="relative w-full flex items-end h-full">
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[10px] rounded-md glass-strong opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        {v * 5} kWh
                      </div>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[hsl(182_88%_31%)] to-[hsl(168_47%_71%)] shadow-[0_-4px_24px_-8px_hsl(168_47%_71%/0.6)] group-hover:from-[hsl(182_88%_41%)] group-hover:to-white"
                        style={{
                          height: chartVisible ? `${v}%` : "0%",
                          transition: `height 1s cubic-bezier(.2,.7,.2,1) ${i * 70}ms, background 0.2s`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] md:text-xs text-muted-foreground">{months[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative py-24 px-4">
        <div className="mx-auto max-w-6xl">
          <div data-reveal className="text-center mb-14">
            <p className="text-sm uppercase tracking-[0.2em] text-[hsl(168_47%_71%)]">Necə İşləyir</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-semibold tracking-tight">
              Üç addımda <span className="text-shimmer">qənaət</span>
            </h2>
          </div>
          <div className="relative grid md:grid-cols-3 gap-6">
            <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[hsl(168_47%_71%/0.3)] to-transparent" />
            {steps.map((s) => (
              <div data-reveal key={s.n} className="glass rounded-3xl p-7 relative hover:-translate-y-1 transition border border-[hsl(168_47%_71%/0.25)]">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-6xl font-semibold text-[hsl(168_47%_71%/0.5)] leading-none">{s.n}</span>
                  <div className="w-12 h-12 rounded-2xl grid place-items-center glass-strong">
                    <s.icon className="w-5 h-5 text-[hsl(168_47%_71%)]" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="relative py-24 px-4">
        <div className="mx-auto max-w-5xl">
          <div data-reveal className="glass-strong rounded-3xl p-8 md:p-12 relative overflow-hidden grid md:grid-cols-2 gap-10 items-center">
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[hsl(182_88%_31%/0.4)] blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[hsl(168_47%_71%/0.2)] blur-3xl" />

            <div className="relative">
              <p className="text-sm uppercase tracking-[0.2em] text-[hsl(168_47%_71%)]">Əlaqə</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
                Demo versiya üçün <span className="text-shimmer">qeydiyyat</span>
              </h2>
              <p className="mt-3 text-muted-foreground">
                Şəxsi demo seansı və enerji auditi tamamilə pulsuzdur. 14 gün ərzində platformanın bütün xüsusiyyətlərini sınayın.
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {["Şəxsi enerji məsləhətçisi", "Real evinizdə canlı demo", "Tam ROI hesabatı"].map((x) => (
                  <li key={x} className="flex items-center gap-2 text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-[hsl(182_88%_31%/0.2)] grid place-items-center">
                      <Check className="w-3 h-3 text-[hsl(168_47%_71%)]" />
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={onSubmit} className="relative grid gap-4 glass rounded-2xl p-6">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted-foreground">Tam ad</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ad Soyad"
                  className="px-4 py-3 rounded-xl bg-input border border-[hsl(168_47%_71%/0.15)] focus:border-[hsl(168_47%_71%/0.5)] focus:ring-2 focus:ring-[hsl(168_47%_71%/0.15)] outline-none transition"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted-foreground">E-mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="ad@nümunə.az"
                  className="px-4 py-3 rounded-xl bg-input border border-[hsl(168_47%_71%/0.15)] focus:border-[hsl(168_47%_71%/0.5)] focus:ring-2 focus:ring-[hsl(168_47%_71%/0.15)] outline-none transition"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="text-muted-foreground">Mobil nömrə</span>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+994 50 000 00 00"
                  className="px-4 py-3 rounded-xl bg-input border border-[hsl(168_47%_71%/0.15)] focus:border-[hsl(168_47%_71%/0.5)] focus:ring-2 focus:ring-[hsl(168_47%_71%/0.15)] outline-none transition"
                />
              </label>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[hsl(182_88%_31%)] text-white font-medium hover:bg-[hsl(182_88%_36%)] shadow-[0_12px_32px_-10px_hsl(182_88%_31%/0.9)] transition"
              >
                Müraciət et <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                Göndərməklə <a href="#" className="text-[hsl(168_47%_71%)]">İstifadə Şərtləri</a> ilə razılaşırsınız.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative pt-16 pb-10 px-4 border-t border-[hsl(168_47%_71%/0.08)]">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-4">
              <Logo />
              <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                AI-powered enerji optimallaşdırma platforması. Daha ağıllı, daha təmiz, daha sərfəli.
              </p>
              <div className="mt-5 flex items-center gap-3">
                {[Twitter, Linkedin, Github, Facebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 grid place-items-center rounded-xl glass hover:bg-[hsl(168_47%_71%/0.12)] transition">
                    <Icon className="w-4 h-4 text-[hsl(168_47%_71%)]" />
                  </a>
                ))}
              </div>
            </div>
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerCols.map((c) => (
                <div key={c.title}>
                  <h4 className="text-sm font-semibold mb-3">{c.title}</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {c.links.map((l) => (
                      <li key={l}>
                        <a href="#" className="hover:text-[hsl(168_47%_71%)] transition-colors">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 pt-6 border-t border-[hsl(168_47%_71%/0.08)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
            <p>© 2025 EcoAI. Bütün hüquqlar qorunur.</p>
            <p>Made with ⚡ in Baku</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
