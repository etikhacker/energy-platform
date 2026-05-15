import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const simpleVert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const combinedFrag = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform float uBrushSize;
uniform float uBrushStrength;
uniform float uFluidDecay;
uniform float uTrailLength;
uniform float uStopDecay;
uniform sampler2D uPreviousFrame;
uniform sampler2D uFluidTex;
uniform int uFrame;

varying vec2 vUv;

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
         + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
         dot(x12.zw, x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f*f*(3.0-2.0*f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float val = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for(int i = 0; i < 5; i++) {
    val += amp * noise(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return val;
}

float drops(vec2 uv, float t, float density, float speed, float seed) {
  vec2 n = floor(uv * density);
  vec2 f = fract(uv * density);
  float tOffset = hash(n + seed) * 6.283;
  float dropT = fract(t * speed + tOffset);
  float radius = 0.05 + 0.1 * hash(n + seed + 100.0);
  vec2 center = vec2(0.5) + 0.3 * vec2(sin(tOffset * 1.7), cos(tOffset * 2.3));
  float dist = length(f - center);
  float ripple = sin(dist * 30.0 - dropT * 10.0) * 0.5 + 0.5;
  ripple *= exp(-dist * 5.0) * smoothstep(0.0, 0.1, dropT) * smoothstep(1.0, 0.7, dropT);
  return ripple;
}

float inkFlow(vec2 uv, float t) {
  float val = 0.0;
  val += snoise(uv * 3.0 + t * 0.1) * 0.5 + 0.5;
  val += snoise(uv * 2.0 - t * 0.15) * 0.5 + 0.5;
  val += drops(uv, t, 4.0, 0.08, 0.0) * 0.3;
  vec2 warp = vec2(fbm(uv * 2.0 + t * 0.05), fbm(uv * 2.0 + t * 0.05 + 5.0));
  val += snoise(uv * 4.0 + warp + t * 0.08) * 0.4;
  return val / 2.5;
}

float lineDistance(vec2 p, vec2 a, vec2 b) {
  return length(p - a - (b - a) * clamp(dot(p - a, b - a) / dot(b - a, b - a), 0.0, 1.0));
}

vec4 sampleFluidState(sampler2D tex, vec2 uv) {
  vec4 raw = texture2D(tex, uv);
  vec4 raw2 = texture2D(tex, uv + vec2(0.5, 0.0));
  return vec4(raw.rg, raw2.rg);
}

vec4 packFluidState(vec4 state) {
  return vec4(clamp(state.rg * 0.5 + 0.5, 0.0, 1.0), clamp(state.ba * 0.5 + 0.5, 0.0, 1.0));
}

vec3 fluidInkColor(vec2 uv, float height, float velMag, float t) {
  vec3 inkColor = vec3(0.05, 0.70, 0.78);
  vec3 heightColor = mix(inkColor * 0.6, inkColor * 1.8, smoothstep(-0.1, 0.5, height));
  vec3 heatColor = mix(vec3(0.0, 0.0, 0.0), vec3(0.2, 0.8, 0.9), smoothstep(0.0, 0.8, velMag));
  vec3 finalColor = mix(heightColor, heatColor, 0.35);
  float pattern = snoise(uv * 5.0 + t * 0.02) * 0.2 + snoise(uv * 10.0 - t * 0.03) * 0.1;
  finalColor += pattern;
  return finalColor * (1.0 + velMag * 0.5);
}

float ripple(vec2 uv, vec2 center, float t, float freq, float decay, float speed) {
  float d = distance(uv, center);
  return sin(d * freq - t * speed) * exp(-d * decay);
}

void main() {
  vec2 uv = vUv;
  vec2 centeredUV = uv * 2.0 - 1.0;
  vec2 aspect = vec2(iResolution.x / iResolution.y, 1.0);
  centeredUV.x *= aspect.x;

  vec4 prevState = sampleFluidState(uPreviousFrame, uv);
  float height = prevState.r;
  float velX = prevState.g;
  float velY = prevState.b;
  float velMag = velX * velX + velY * velY;
  float t = iTime;
  float newHeight = height;
  float newVelX = velX;
  float newVelY = velY;

  vec2 pixel = 1.0 / iResolution.xy;
  float left = sampleFluidState(uPreviousFrame, uv + vec2(-pixel.x, 0.0)).r;
  float right = sampleFluidState(uPreviousFrame, uv + vec2(pixel.x, 0.0)).r;
  float up = sampleFluidState(uPreviousFrame, uv + vec2(0.0, pixel.y)).r;
  float down = sampleFluidState(uPreviousFrame, uv + vec2(0.0, -pixel.y)).r;

  float avgHeight = (left + right + up + down) * 0.25;
  newHeight = mix(newHeight, avgHeight, 0.45);

  float heightDiff = avgHeight - height;
  newVelX += heightDiff * 0.5;
  newVelY += heightDiff * 0.5;
  newVelX *= 0.95;
  newVelY *= 0.95;
  newHeight += (newVelX + newVelY) * 0.3;

  float mouseVel = length(iMouse.zw);
  bool mouseActive = mouseVel > 0.01;
  if (mouseActive) {
    vec2 mUV = (iMouse.xy / iResolution.xy) * 2.0 - 1.0;
    mUV.x *= aspect.x;
    float mDist = distance(centeredUV, mUV);
    float mSize = uBrushSize * 0.01;
    float brushFactor = 0.5 + 0.5 * snoise(gl_FragCoord.xy * 0.05 + t);
    newHeight += brushFactor * uBrushStrength * exp(-mDist * mDist / (mSize * mSize));
    newVelX += (iMouse.z * 0.01 + (snoise(gl_FragCoord.xy * 0.1 + t * 0.5) * 0.5)) * exp(-mDist * mDist / (mSize * mSize * 0.5));
    newVelY += (iMouse.w * 0.01 + (snoise(gl_FragCoord.xy * 0.1 + t * 0.5 + 100.0) * 0.5)) * exp(-mDist * mDist / (mSize * mSize * 0.5));
  }

  float inkActive = 1.0 - uStopDecay;
  if (inkActive > 0.001) {
    vec2 nUv = uv * aspect;
    float dropSpacing = 3.0 + 2.0 * snoise(vec2(floor(t * 0.5), 0.0));
    float nDrops = 8.0;
    float dropSize = 0.03;

    for (int i = 0; i < 8; i++) {
      float seed = float(i) * 100.0;
      vec2 pos = vec2(snoise(vec2(seed, floor(t * 0.3))), snoise(vec2(seed + 1.0, floor(t * 0.3))));
      pos = pos * 0.5 + 0.5;
      pos = pos * 0.8 + 0.1;
      pos.x *= aspect.x;
      float d = distance(nUv, pos);
      float intensity = smoothstep(dropSize, 0.0, d) * 0.7;
      float phase = hash(vec2(seed, floor(t * 0.3))) * 6.28;
      float rise = sin(t * 2.0 + phase) * 0.3 + 0.7;
      float strength = intensity * rise;
      newHeight += strength * 0.4;
      newVelX += cos(phase + t) * strength * 0.2;
      newVelY += sin(phase + t) * strength * 0.2;
    }

    float flowVal = inkFlow(nUv, t);
    float flowD = flowVal * 0.2;
    vec2 flowDir = vec2(snoise(nUv * 2.0 + t * 0.1 + 50.0), snoise(nUv * 2.0 + t * 0.1 + 60.0));
    newHeight += flowD * 0.15;
    newVelX += flowDir.x * flowD * 0.1;
    newVelY += flowDir.y * flowD * 0.1;

    float autoRipple = ripple(nUv, vec2(0.0, 0.0), t, 15.0, 2.0, 3.0) * 0.05
                     + ripple(nUv, vec2(0.5 * aspect.x, 0.3), t + 2.0, 20.0, 3.0, 4.0) * 0.03;
    newHeight += autoRipple;
  }

  newHeight *= uFluidDecay;
  newHeight = clamp(newHeight, -1.0, 1.0);
  newVelX *= 0.98;
  newVelY *= 0.98;

  vec3 fluidColor = fluidInkColor(uv, newHeight, velMag, t);

  float shade = smoothstep(-0.2, 0.5, newHeight);
  fluidColor = fluidColor * (0.5 + shade * 0.5);

  float surfaceHighlight = smoothstep(0.3, 0.8, newHeight);
  fluidColor += vec3(0.15, 0.6, 0.7) * surfaceHighlight * 0.2;

  float edge = length(fwidth(centeredUV)) * 10.0;
  float vig = smoothstep(0.0, 0.7, 1.0 - edge);

  vec3 bgColor = vec3(0.0, 0.05, 0.07);
  vec3 color = mix(bgColor, fluidColor, 0.7 + 0.2 * smoothstep(0.0, 0.3, velMag));

  float depth = 1.0 - uv.y;
  vec3 atmos = vec3(0.0, 0.03, 0.04) * exp(-depth * 2.0) * 0.2;
  color += atmos * (1.0 - uStopDecay);

  color += vec3(0.0, 0.04, 0.05) * (1.0 - uv.y) * 0.15 * (1.0 - uStopDecay);

  float refl = smoothstep(0.6, 1.0, velMag) * 0.2;
  color += vec3(0.3, 0.6, 0.7) * refl * (1.0 - uStopDecay);

  float displacement = length(vec2(dFdx(newHeight), dFdy(newHeight)));
  color += vec3(0.08, 0.3, 0.4) * displacement * 0.3;

  color *= 0.7 + 0.3 * vig;

  gl_FragColor = vec4(color, 1.0);
}
`;

export default function LivingCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, lastX: 0, lastY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    // Scenes and cameras
    const displayScene = new THREE.Scene();
    const displayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Render targets for ping-pong (512x512 simulation resolution)
    const simWidth = 512;
    const simHeight = 512;
    const rtOptions: THREE.RenderTargetOptions = {
      type: THREE.FloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    };
    let texA = new THREE.WebGLRenderTarget(simWidth, simHeight, rtOptions);
    let texB = new THREE.WebGLRenderTarget(simWidth, simHeight, rtOptions);

    // Display material
    const displayMaterial = new THREE.ShaderMaterial({
      vertexShader: simpleVert,
      fragmentShader: combinedFrag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1) },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        uBrushSize: { value: 2.0 },
        uBrushStrength: { value: 0.4 },
        uFluidDecay: { value: 0.98 },
        uTrailLength: { value: 0.85 },
        uStopDecay: { value: 0.0 },
        uPreviousFrame: { value: texA.texture },
        uFluidTex: { value: texA.texture },
        uFrame: { value: 0 },
      },
      side: THREE.DoubleSide,
      transparent: false,
      blending: THREE.NoBlending,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), displayMaterial);
    displayScene.add(quad);

    // Clock
    const clock = new THREE.Clock();
    let frameCount = 0;

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const mouseVelX = (mouseX - mouseRef.current.lastX) * 0.3;
      const mouseVelY = (mouseY - mouseRef.current.lastY) * -0.3;
      displayMaterial.uniforms.iMouse.value.set(mouseX, canvas.height - mouseY, mouseVelX, mouseVelY);
      mouseRef.current.lastX = mouseX;
      mouseRef.current.lastY = mouseY;
    };

    const handleMouseLeave = () => {
      displayMaterial.uniforms.iMouse.value.set(0, 0, 0, 0);
    };

    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Render loop
    let animId: number;
    const render = () => {
      animId = requestAnimationFrame(render);

      const elapsed = clock.getElapsedTime();
      frameCount++;

      // Update uniforms
      displayMaterial.uniforms.iTime.value = elapsed;
      displayMaterial.uniforms.uFrame.value = frameCount;

      // Ping-pong: render simulation to texB using texA as previous
      displayMaterial.uniforms.uPreviousFrame.value = texA.texture;
      renderer.setRenderTarget(texB);
      renderer.render(displayScene, displayCamera);

      // Swap
      const temp = texA;
      texA = texB;
      texB = temp;

      // Render to screen
      displayMaterial.uniforms.uPreviousFrame.value = texA.texture;
      displayMaterial.uniforms.uFluidTex.value = texA.texture;
      renderer.setRenderTarget(null);
      renderer.render(displayScene, displayCamera);
    };

    if (!reducedMotion) {
      render();
    } else {
      // Static frame for reduced motion
      displayMaterial.uniforms.iTime.value = 5.0;
      displayMaterial.uniforms.uFrame.value = 300;
      renderer.render(displayScene, displayCamera);
    }

    // Resize handler
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      displayMaterial.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight, 1);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      texA.dispose();
      texB.dispose();
      displayMaterial.dispose();
      renderer.dispose();
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
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
