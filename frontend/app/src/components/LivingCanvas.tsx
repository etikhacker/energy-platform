import { useEffect, useRef } from 'react';

export default function LivingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: {
      x: number;
      y: number;
      r: number;
      alpha: number;
      speed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        speed: Math.random() * 0.4 + 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const readTheme = () => {
      const styles = getComputedStyle(document.documentElement);
      return {
        bg: styles.getPropertyValue('--app-bg').trim() || '#001219',
        accent: styles.getPropertyValue('--accent').trim() || '#2a9d8f',
        animations: document.documentElement.dataset.animations !== 'off',
      };
    };

    const accentWithAlpha = (color: string, alpha: number) => {
      if (!color.startsWith('#')) return `rgba(148, 210, 189, ${alpha})`;

      const hex = color.replace('#', '');
      const normalized = hex.length === 3
        ? hex.split('').map((char) => char + char).join('')
        : hex;

      const value = Number.parseInt(normalized, 16);
      const r = (value >> 16) & 255;
      const g = (value >> 8) & 255;
      const b = value & 255;
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    let animId = 0;
    let t = 0;

    const drawFrame = (animated: boolean) => {
      if (animated) {
        animId = requestAnimationFrame(() => drawFrame(true));
        t += 0.012;
      }

      const w = canvas.width;
      const h = canvas.height;
      const theme = readTheme();

      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, w, h);

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(255,255,255,0.035)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,0.28)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const glow = ctx.createRadialGradient(w * 0.5, h * 0.45, 0, w * 0.5, h * 0.45, w * 0.55);
      glow.addColorStop(0, accentWithAlpha(theme.accent, 0.08));
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        const px = p.x * w;
        const py = p.y * h;
        const flicker = animated ? Math.sin(t * p.speed + p.phase) * 0.5 + 0.5 : 0.55;
        const alpha = p.alpha * flicker;

        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accentWithAlpha(theme.accent, alpha);
        ctx.fill();
      }
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    drawFrame(!reducedMotion && readTheme().animations);

    const observer = new MutationObserver(() => {
      cancelAnimationFrame(animId);
      drawFrame(!reducedMotion && readTheme().animations);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-animations'] });

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
