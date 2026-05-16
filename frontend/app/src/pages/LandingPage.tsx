import { useEffect, useRef, useState } from 'react';

const TEAL = '#0a9396';
const TEAL_BRIGHT = '#2a9d8f';
const TEAL_LIGHT = '#94d2bd';
const BG = '#001219';
const BG2 = '#00171f';

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const stats = [
  { value: '450', unit: 'kWh', label: 'Aylıq Qənaət' },
  { value: '24', unit: '%', label: 'İstehlak Azalması' },
  { value: '1.2', unit: 't', label: 'CO₂ Azaldıldı' },
  { value: '$87', unit: '', label: 'Pul Qənaəti' },
];

const features = [
  {
    icon: '🧠',
    title: 'AI Analizi',
    desc: 'Süni intellekt istehlak nümunələrini öyrənir və real vaxtda optimallaşdırma tövsiyələri verir.',
  },
  {
    icon: '📡',
    title: 'Real-vaxt İzləmə',
    desc: 'Bütün cihazlarınızın enerji istehlakını saniyə-saniyə izləyin və idarə edin.',
  },
  {
    icon: '🌿',
    title: 'Karbon İzi',
    desc: 'CO₂ emissiyalarınızı hesablayın, azaldın və ətraf mühitə töhfənizi izləyin.',
  },
];

const steps = [
  { num: '01', title: 'Qoşulun', desc: 'Enerji sistemlərinizi platformaya birləşdirin — 5 dəqiqə çəkir.' },
  { num: '02', title: 'AI Analiz Edir', desc: 'Süni intellekt məlumatlarınızı analiz edib fərdi plan hazırlayır.' },
  { num: '03', title: 'Qənaət Edin', desc: 'Avtomatik optimallaşdırma ilə xərclər azalır, karbon izi kiçilir.' },
];

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView();
  const statsInView = useInView();
  const stepsInView = useInView();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBg = scrollY > 60
    ? 'rgba(0,18,25,0.95)'
    : 'transparent';

  return (
    <div style={{ background: BG, color: '#fff', fontFamily: "'DM Sans', sans-serif", overflowX: 'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: navBg, backdropFilter: scrollY > 60 ? 'blur(20px)' : 'none',
        borderBottom: scrollY > 60 ? '1px solid rgba(255,255,255,0.06)' : 'none',
        transition: 'all 0.4s ease',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `rgba(10,147,150,0.2)`, border: `1px solid rgba(10,147,150,0.4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <span style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, color: '#fff' }}>EcoAI</span>
        </div>

        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {['Xüsusiyyətlər', 'Statistika', 'Necə İşləyir', 'Əlaqə'].map(item => (
            <a key={item} href={`#${item}`} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >{item}</a>
          ))}
          <a href="/dashboard" style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            background: `rgba(10,147,150,0.15)`, border: `1px solid rgba(10,147,150,0.3)`,
            color: TEAL_LIGHT, textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `rgba(10,147,150,0.3)`; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `rgba(10,147,150,0.15)`; }}
          >Daxil Ol</a>
          <a href="/dashboard" style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            background: TEAL_BRIGHT, color: '#fff', textDecoration: 'none', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = TEAL; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = TEAL_BRIGHT; }}
          >Başla →</a>
        </div>
      </nav>

      {/* Hero */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 40px 80px', position: 'relative' }}>
        {/* BG glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, rgba(10,147,150,0.12) 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px',
            borderRadius: 20, border: `1px solid rgba(10,147,150,0.3)`,
            background: `rgba(10,147,150,0.08)`, marginBottom: 32,
            fontSize: 13, color: TEAL_LIGHT,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: TEAL_BRIGHT, display: 'inline-block' }} />
            AI-Powered Energy Intelligence Platform
          </div>

          <h1 style={{
            fontFamily: 'Syne', fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800,
            lineHeight: 1.1, marginBottom: 24, letterSpacing: '-1px',
          }}>
            Enerji İstehlakınızı{' '}
            <span style={{ color: TEAL_BRIGHT }}>AI ilə</span>{' '}
            Optimallaşdırın
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
            Süni intellekt texnologiyası ilə enerji xərclərini azaldın, karbon izini minimuma endir və real vaxt məlumatları ilə ağıllı qərarlar qəbul et.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard" style={{
              padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 500,
              background: TEAL_BRIGHT, color: '#fff', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = TEAL; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = TEAL_BRIGHT; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
            >Başla →</a>
            <a href="#Necə İşləyir" style={{
              padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 500,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
            >▶ Demo İzlə</a>
          </div>

          {/* Hero dashboard preview */}
          <div style={{
            marginTop: 64, padding: 24, borderRadius: 16,
            background: 'rgba(0,26,35,0.8)', border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {stats.map(s => (
                <div key={s.label} style={{ padding: 16, borderRadius: 10, background: 'rgba(10,147,150,0.08)', border: '1px solid rgba(10,147,150,0.15)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'JetBrains Mono', fontSize: 28, fontWeight: 500, color: TEAL_BRIGHT }}>{s.value}<span style={{ fontSize: 14 }}>{s.unit}</span></div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="Xüsusiyyətlər" ref={featuresInView.ref} style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56, opacity: featuresInView.inView ? 1 : 0, transform: featuresInView.inView ? 'none' : 'translateY(20px)', transition: 'all 0.6s ease' }}>
          <p style={{ fontSize: 13, color: TEAL_LIGHT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Xüsusiyyətlər</p>
          <h2 style={{ fontFamily: 'Syne', fontSize: 40, fontWeight: 700 }}>Niyə EcoAI?</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map((f, i) => (
            <div key={f.title} style={{
              padding: 28, borderRadius: 16,
              background: 'rgba(0,26,35,0.6)', border: '1px solid rgba(255,255,255,0.08)',
              opacity: featuresInView.inView ? 1 : 0,
              transform: featuresInView.inView ? 'none' : 'translateY(24px)',
              transition: `all 0.6s ease ${i * 0.1}s`,
              cursor: 'default',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `rgba(10,147,150,0.3)`; (e.currentTarget as HTMLElement).style.background = 'rgba(10,147,150,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,26,35,0.6)'; }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="Statistika" ref={statsInView.ref} style={{ padding: '80px 40px', background: `rgba(10,147,150,0.04)`, borderTop: '1px solid rgba(10,147,150,0.1)', borderBottom: '1px solid rgba(10,147,150,0.1)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center' }}>
          {stats.map((s, i) => (
            <div key={s.label} style={{
              opacity: statsInView.inView ? 1 : 0,
              transform: statsInView.inView ? 'none' : 'translateY(20px)',
              transition: `all 0.5s ease ${i * 0.1}s`,
            }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 48, fontWeight: 500, color: TEAL_BRIGHT, lineHeight: 1 }}>
                {s.value}<span style={{ fontSize: 24 }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginTop: 8 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="Necə İşləyir" ref={stepsInView.ref} style={{ padding: '80px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 13, color: TEAL_LIGHT, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Proses</p>
          <h2 style={{ fontFamily: 'Syne', fontSize: 40, fontWeight: 700 }}>Necə İşləyir?</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {steps.map((s, i) => (
            <div key={s.num} style={{
              display: 'flex', alignItems: 'flex-start', gap: 24, padding: 28,
              borderRadius: 16, background: 'rgba(0,26,35,0.6)', border: '1px solid rgba(255,255,255,0.08)',
              opacity: stepsInView.inView ? 1 : 0,
              transform: stepsInView.inView ? 'none' : 'translateX(-20px)',
              transition: `all 0.6s ease ${i * 0.15}s`,
            }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 32, fontWeight: 500, color: TEAL_BRIGHT, flexShrink: 0, lineHeight: 1 }}>{s.num}</div>
              <div>
                <h3 style={{ fontFamily: 'Syne', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', textAlign: 'center' }}>
        <div style={{
          maxWidth: 600, margin: '0 auto', padding: 56, borderRadius: 24,
          background: `linear-gradient(135deg, rgba(10,147,150,0.12) 0%, rgba(0,26,35,0.8) 100%)`,
          border: '1px solid rgba(10,147,150,0.2)',
        }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: 36, fontWeight: 700, marginBottom: 16 }}>İndi Başlayın</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', marginBottom: 32, lineHeight: 1.7 }}>
            Enerji xərclərini azaldın, karbon izini kiçilt. Pulsuz başla.
          </p>
          <a href="/dashboard" style={{
            display: 'inline-block', padding: '14px 40px', borderRadius: 10,
            background: TEAL_BRIGHT, color: '#fff', textDecoration: 'none',
            fontSize: 16, fontWeight: 500, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = TEAL; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = TEAL_BRIGHT; (e.currentTarget as HTMLElement).style.transform = 'none'; }}
          >Platformaya Qoşul →</a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>⚡</span>
          <span style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700 }}>EcoAI</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>© 2026 EcoAI. Bütün hüquqlar qorunur.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Məxfilik', 'Şərtlər', 'Əlaqə'].map(item => (
            <a key={item} href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none' }}>{item}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}