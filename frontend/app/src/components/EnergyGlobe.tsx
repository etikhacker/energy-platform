'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// ============================================
//   EcoAI — Energy Grid Globe
//   A stylised 3D sensor network sphere:
//   wireframe shell + pulsing sensor nodes +
//   travelling energy arcs + a glowing AI core.
//   Built with plain three.js so it drops into
//   any Next.js client component with no extra
//   dependencies beyond `three`.
// ============================================

const COLORS = {
  teal: 0x2dd4bf,
  green: 0x4ade80,
  dim: 0x113a33,
  star: 0xbdf5ea,
};

interface Bounds {
  width: number;
  height: number;
}

function makeGlowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    grad.addColorStop(0, 'rgba(173, 255, 235, 0.9)');
    grad.addColorStop(0.35, 'rgba(45, 212, 191, 0.45)');
    grad.addColorStop(1, 'rgba(45, 212, 191, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function uniqueVertices(geometry: THREE.BufferGeometry): THREE.Vector3[] {
  const pos = geometry.getAttribute('position');
  const seen = new Set<string>();
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    const key = `${v.x.toFixed(3)},${v.y.toFixed(3)},${v.z.toFixed(3)}`;
    if (!seen.has(key)) {
      seen.add(key);
      points.push(v);
    }
  }
  return points;
}

export default function EnergyGlobe() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    const bounds: Bounds = { width: 1, height: 1 };

    // ----- Core three.js setup -----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.3, 3.3);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const glowTexture = makeGlowTexture();

    // ----- Outer wireframe shell (the "grid") -----
    const shellGeo = new THREE.IcosahedronGeometry(1, 3);
    const shellEdges = new THREE.EdgesGeometry(shellGeo);
    const shellMat = new THREE.LineBasicMaterial({
      color: COLORS.teal,
      transparent: true,
      opacity: 0.22,
    });
    const shell = new THREE.LineSegments(shellEdges, shellMat);
    globeGroup.add(shell);

    // ----- Soft inner fill for depth -----
    const fillGeo = new THREE.IcosahedronGeometry(0.985, 3);
    const fillMat = new THREE.MeshBasicMaterial({
      color: COLORS.dim,
      transparent: true,
      opacity: 0.45,
    });
    const fill = new THREE.Mesh(fillGeo, fillMat);
    globeGroup.add(fill);

    // ----- Ambient glow sprite behind the globe -----
    const haloMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Sprite(haloMat);
    halo.scale.set(3.6, 3.6, 1);
    globeGroup.add(halo);

    // ----- Sensor nodes at sphere vertices -----
    const nodeGeoSource = new THREE.IcosahedronGeometry(1, 1);
    const nodePositions = uniqueVertices(nodeGeoSource);
    nodeGeoSource.dispose();

    const nodeMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const nodes: THREE.Sprite[] = nodePositions.map((pos, i) => {
      const sprite = new THREE.Sprite(nodeMat.clone());
      sprite.position.copy(pos);
      sprite.scale.setScalar(0.1 + (i % 5) * 0.01);
      sprite.userData.phase = (i / nodePositions.length) * Math.PI * 2;
      globeGroup.add(sprite);
      return sprite;
    });

    // ----- Travelling energy arcs between nodes -----
    const ARC_COUNT = 16;
    const arcMeshes: THREE.Mesh[] = [];
    const pulses: THREE.Sprite[] = [];
    const pulseCurves: THREE.QuadraticBezierCurve3[] = [];

    for (let i = 0; i < ARC_COUNT; i++) {
      const a = nodePositions[Math.floor(Math.random() * nodePositions.length)];
      const b = nodePositions[Math.floor(Math.random() * nodePositions.length)];
      if (!a || !b || a.distanceTo(b) < 0.6) continue;

      const mid = a.clone().add(b).multiplyScalar(0.5);
      const lift = 1 + 0.35 + Math.random() * 0.15;
      mid.normalize().multiplyScalar(lift);

      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const tubeGeo = new THREE.TubeGeometry(curve, 24, 0.0035, 6, false);
      const tubeMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? COLORS.teal : COLORS.green,
        transparent: true,
        opacity: 0.28,
      });
      const tube = new THREE.Mesh(tubeGeo, tubeMat);
      globeGroup.add(tube);
      arcMeshes.push(tube);

      const pulse = new THREE.Sprite(nodeMat.clone());
      pulse.scale.setScalar(0.08);
      pulse.userData.t = Math.random();
      pulse.userData.speed = 0.15 + Math.random() * 0.2;
      globeGroup.add(pulse);
      pulses.push(pulse);
      pulseCurves.push(curve);
    }

    // ----- Central AI core -----
    const coreGeo = new THREE.IcosahedronGeometry(0.16, 1);
    const coreMat = new THREE.MeshBasicMaterial({ color: COLORS.star });
    const core = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(core);

    const coreGlow = new THREE.Sprite(haloMat.clone());
    coreGlow.scale.set(1.1, 1.1, 1);
    globeGroup.add(coreGlow);

    // ----- Orbit rings -----
    const rings: THREE.Mesh[] = [];
    const ringDefs = [
      { radius: 1.5, tilt: 0.35, speed: 0.05 },
      { radius: 1.75, tilt: -0.5, speed: -0.035 },
      { radius: 2.0, tilt: 0.9, speed: 0.025 },
    ];
    ringDefs.forEach((def, i) => {
      const ringGeo = new THREE.TorusGeometry(def.radius, 0.004, 8, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? COLORS.green : COLORS.teal,
        transparent: true,
        opacity: 0.18,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + def.tilt;
      ring.userData.speed = def.speed;
      globeGroup.add(ring);
      rings.push(ring);
    });

    // ----- Background star field -----
    const starCount = 1800;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 18 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPos[i * 3 + 2] = r * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: COLORS.star,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ----- Pointer drag interaction -----
    const target = { x: 0, y: 0.15 };
    const current = { x: 0, y: 0.15 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velocityX = 0.0006;

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velocityX = 0;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      target.x += dx * 0.004;
      target.y += dy * 0.004;
      target.y = Math.max(-1.1, Math.min(1.1, target.y));
      velocityX = dx * 0.0006;
    };
    const onPointerUp = () => {
      dragging = false;
    };

    canvas.style.touchAction = 'none';
    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // ----- Resize handling -----
    const resize = () => {
      const rect = container.getBoundingClientRect();
      bounds.width = Math.max(1, rect.width);
      bounds.height = Math.max(1, rect.height);
      camera.aspect = bounds.width / bounds.height;
      camera.updateProjectionMatrix();
      renderer.setSize(bounds.width, bounds.height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener('resize', resize);

    // ----- Animation loop -----
    const clock = new THREE.Clock();
    let frameId = 0;

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      if (!dragging) {
        target.x += velocityX + 0.0009 * dt * 60;
      }
      current.x += (target.x - current.x) * 0.06;
      current.y += (target.y - current.y) * 0.06;
      globeGroup.rotation.y = current.x;
      globeGroup.rotation.x = current.y * 0.4;

      shell.rotation.y += 0.0006;
      fill.rotation.y -= 0.0003;

      nodes.forEach((sprite) => {
        const phase = sprite.userData.phase as number;
        const pulse = 0.6 + Math.sin(t * 1.4 + phase) * 0.4;
        (sprite.material as THREE.SpriteMaterial).opacity = 0.35 + pulse * 0.55;
      });

      pulses.forEach((sprite, i) => {
        const curve = pulseCurves[i];
        if (!curve) return;
        sprite.userData.t = (sprite.userData.t + sprite.userData.speed * dt) % 1;
        const p = curve.getPoint(sprite.userData.t);
        sprite.position.copy(p);
      });

      rings.forEach((ring) => {
        ring.rotation.z += ring.userData.speed * dt;
      });

      core.rotation.y += 0.01;
      core.rotation.x += 0.006;
      const coreScale = 1 + Math.sin(t * 2) * 0.06;
      core.scale.setScalar(coreScale);
      (coreGlow.material as THREE.SpriteMaterial).opacity = 0.4 + Math.sin(t * 2) * 0.15;

      stars.rotation.y += 0.00006;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    // ----- Cleanup -----
    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      [shellGeo, shellEdges, fillGeo, coreGeo, starGeo].forEach((g) => g.dispose());
      [shellMat, fillMat, coreMat, starMat, haloMat, nodeMat].forEach((m) => m.dispose());
      arcMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      rings.forEach((ring) => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
      nodes.forEach((sprite) => (sprite.material as THREE.Material).dispose());
      pulses.forEach((sprite) => (sprite.material as THREE.Material).dispose());
      glowTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0 }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}