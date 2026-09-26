import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  bvToRgb, equatorialToWorld, equatorialVector, galacticToEquatorialVector,
  horizontalVector, moonPhase, moonPosition, sunPosition, toHorizontal
} from './astro';

const STAR_RADIUS = 100;
const isMobile = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 768px)').matches;

const NOISE = /* glsl */ `
  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }
`;

// Shared, mutable state the render loop reads without re-rendering React
function useLive(props) {
  const live = useRef({ day: props.theme === 'day' ? 1 : 0 });
  Object.assign(live.current, props);
  return live;
}

/* ---------- Sky dome: night gradient, golden-hour day, Shinkai-ish clouds ---------- */
function Dome({ uniforms }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * viewMatrix * vec4(vDir, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uDay; uniform float uTime; uniform vec3 uSunDir;
      varying vec3 vDir;
      ${NOISE}
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        float hc = max(h, 0.0);

        vec3 night = mix(vec3(0.07, 0.066, 0.15), vec3(0.01, 0.014, 0.04), pow(hc, 0.45));
        night += vec3(0.22, 0.12, 0.3) * exp(-hc * 10.0) * 0.28;

        vec3 day = mix(vec3(1.0, 0.77, 0.56), vec3(0.78, 0.74, 0.86), smoothstep(0.0, 0.22, hc));
        day = mix(day, vec3(0.33, 0.55, 0.84), smoothstep(0.18, 0.85, hc));
        float sd = max(dot(d, normalize(uSunDir)), 0.0);
        day += vec3(1.0, 0.7, 0.42) * pow(sd, 7.0) * 0.5;
        day += vec3(1.0, 0.9, 0.74) * smoothstep(0.9993, 0.9997, sd) * 0.55 + vec3(1.0, 0.85, 0.65) * pow(sd, 90.0) * 0.25;

        if (uDay > 0.01 && h > 0.0) {
          vec2 uv = d.xz / (h + 0.12) * 1.2 + vec2(uTime * 0.005, uTime * 0.002);
          float c = fbm(uv);
          float c2 = fbm(uv * 2.2 + 3.7);
          float cover = smoothstep(0.5, 0.8, c * 0.85 + c2 * 0.32)
                      * smoothstep(0.0, 0.1, h) * (1.0 - smoothstep(0.5, 0.95, h));
          float light = clamp(0.45 + 1.1 * (c - c2) + pow(sd, 3.0) * 0.7, 0.0, 1.0);
          vec3 lit = mix(vec3(1.0, 0.84, 0.74), vec3(1.0, 0.97, 0.93), smoothstep(0.0, 0.45, h));
          vec3 cloud = mix(vec3(0.63, 0.57, 0.72), lit, light);
          day = mix(day, cloud, cover * 0.92);
        }

        vec3 col = mix(night, day, uDay);
        vec3 ground = mix(vec3(0.059, 0.071, 0.157), vec3(0.59, 0.53, 0.67), uDay);
        col = mix(col, ground, smoothstep(0.02, -0.04, h));
        gl_FragColor = vec4(col, 1.0);
      }`
  }), [uniforms]);
  return (
    <mesh material={material} renderOrder={-10} frustumCulled={false}>
      <sphereGeometry args={[400, 48, 32]} />
    </mesh>
  );
}

/* ---------- Point shader shared by stars and the Milky Way ---------- */
function pointMaterial(uniforms, { milky = false } = {}) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms,
    vertexShader: /* glsl */ `
      attribute float aSize; attribute float aAlpha; attribute vec3 aColor; attribute float aSeed;
      uniform float uTime; uniform float uDay; uniform float uPixelRatio;
      varying vec3 vColor; varying float vAlpha; varying float vSize;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vec3 dir = normalize(wp.xyz);
        float horizon = smoothstep(-0.01, 0.06, dir.y);
        float extinction = mix(0.4, 1.0, smoothstep(0.0, 0.35, dir.y));
        float twinkle = ${milky ? '1.0' : '0.78 + 0.22 * sin(uTime * (1.1 + aSeed * 3.0) + aSeed * 60.0)'};
        vAlpha = aAlpha * twinkle * horizon * extinction * (1.0 - uDay);
        vColor = aColor;
        gl_PointSize = aSize * uPixelRatio;
        vSize = aSize;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vColor; varying float vAlpha; varying float vSize;
      void main() {
        float r = length(gl_PointCoord - 0.5) * 2.0;
        if (r > 1.0) discard;
        // Small points stay soft discs; big ones get a sharp core and a glow
        float sharp = ${milky ? '2.0' : 'mix(1.5, 7.0, smoothstep(4.0, 14.0, vSize))'};
        float core = pow(1.0 - smoothstep(0.0, 1.0, r), sharp);
        float a = ${milky ? 'core' : '(core + exp(-r * r * 5.0) * 0.3 * smoothstep(4.0, 14.0, vSize))'} * vAlpha;
        if (a < 0.002) discard;
        gl_FragColor = vec4(vColor, a);
      }`
  });
}

function Stars({ data, uniforms }) {
  const geometry = useMemo(() => {
    const s = data.stars;
    const n = s.length / 4;
    const pos = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    const size = new Float32Array(n);
    const alpha = new Float32Array(n);
    const seed = new Float32Array(n);
    const v = [0, 0, 0];
    const scale = isMobile ? 0.85 : 1;
    for (let i = 0; i < n; i++) {
      const [ra, dec, mag, bv] = [s[i * 4], s[i * 4 + 1], s[i * 4 + 2], s[i * 4 + 3]];
      equatorialVector(ra, dec, v);
      pos.set([v[0] * STAR_RADIUS, v[1] * STAR_RADIUS, v[2] * STAR_RADIUS], i * 3);
      col.set(bvToRgb(bv), i * 3);
      const b = Math.max(0, Math.min(1, (6.3 - mag) / 7.5));
      size[i] = (2.3 + 14 * b * b * b + 2.5 * b) * scale;
      alpha[i] = 0.42 + 0.8 * b;
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
    return g;
  }, [data]);
  const material = useMemo(() => pointMaterial(uniforms), [uniforms]);
  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

function MilkyWay({ uniforms }) {
  const geometry = useMemo(() => {
    const count = isMobile ? 9000 : 18000;
    const pos = [], col = [], size = [], alpha = [];
    const gauss = () => Math.sqrt(-2 * Math.log(Math.random() + 1e-9)) * Math.cos(2 * Math.PI * Math.random());
    let made = 0;
    while (made < count) {
      const l = Math.random() * 360;
      const dl = Math.min(l, 360 - l);
      if (Math.random() > 0.3 + 0.7 * Math.exp(-((dl / 70) ** 2))) continue;
      const width = 2.2 + 7.5 * Math.exp(-((dl / 32) ** 2));
      const b = gauss() * width - 0.8 * Math.exp(-((dl / 40) ** 2)) * (Math.random() < 0.35 ? 0 : 1);
      const v = galacticToEquatorialVector(l, b);
      pos.push(v[0] * STAR_RADIUS * 1.02, v[1] * STAR_RADIUS * 1.02, v[2] * STAR_RADIUS * 1.02);
      const warm = Math.exp(-((dl / 45) ** 2));
      const glow = Math.random() < 0.06;
      col.push(0.72 + 0.28 * warm, 0.78 + 0.1 * warm, 1.0 - 0.25 * warm);
      size.push(glow ? 24 + Math.random() * 40 : 1.8 + Math.random() * 2.2);
      alpha.push(glow ? 0.018 + 0.02 * warm : 0.05 + Math.random() * 0.14);
      made++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aColor', new THREE.Float32BufferAttribute(col, 3));
    g.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1));
    g.setAttribute('aAlpha', new THREE.Float32BufferAttribute(alpha, 1));
    g.setAttribute('aSeed', new THREE.Float32BufferAttribute(new Float32Array(made), 1));
    return g;
  }, []);
  const material = useMemo(() => pointMaterial(uniforms, { milky: true }), [uniforms]);
  return <points geometry={geometry} material={material} frustumCulled={false} renderOrder={-5} />;
}

function ConstellationLines({ data, uniforms }) {
  const geometry = useMemo(() => {
    const pts = [];
    const a = [0, 0, 0], b = [0, 0, 0];
    data.lines.forEach((line) => {
      for (let i = 0; i + 3 < line.length; i += 2) {
        equatorialVector(line[i], line[i + 1], a);
        equatorialVector(line[i + 2], line[i + 3], b);
        const r = STAR_RADIUS * 0.99;
        pts.push(a[0] * r, a[1] * r, a[2] * r, b[0] * r, b[1] * r, b[2] * r);
      }
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [data]);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms,
    vertexShader: /* glsl */ `
      varying float vFade;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vFade = smoothstep(-0.01, 0.1, normalize(wp.xyz).y);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uDay; varying float vFade;
      void main() {
        vec3 c = mix(vec3(0.62, 0.68, 1.0), vec3(0.3, 0.24, 0.4), uDay);
        gl_FragColor = vec4(c, mix(0.11, 0.2, uDay) * vFade);
      }`
  }), [uniforms]);
  return <lineSegments geometry={geometry} material={material} frustumCulled={false} />;
}

/* ---------- Nebulae & galaxies at their real positions (sizes exaggerated for beauty) ---------- */
const NEBULAE = [
  { ra: 83.8, dec: -5.4, size: 9, a: [1.0, 0.42, 0.62], b: [0.4, 0.5, 1.0] },     // Orion Nebula
  { ra: 161.3, dec: -59.9, size: 12, a: [1.0, 0.55, 0.4], b: [0.9, 0.3, 0.6] },   // Carina
  { ra: 271.0, dec: -24.4, size: 9, a: [1.0, 0.38, 0.55], b: [0.5, 0.4, 1.0] },   // Lagoon
  { ra: 266.4, dec: -29.0, size: 26, a: [1.0, 0.78, 0.55], b: [0.7, 0.5, 0.4] },  // Galactic core
  { ra: 10.7, dec: 41.3, size: 7, a: [0.85, 0.8, 1.0], b: [0.7, 0.7, 1.0] },     // Andromeda
  { ra: 56.75, dec: 24.1, size: 6, a: [0.5, 0.68, 1.0], b: [0.75, 0.85, 1.0] },   // Pleiades
  { ra: 314.7, dec: 44.3, size: 9, a: [1.0, 0.38, 0.5], b: [0.6, 0.3, 0.75] },    // North America
  { ra: 98.0, dec: 4.9, size: 6, a: [1.0, 0.45, 0.55], b: [0.8, 0.4, 0.6] },      // Rosette
  { ra: 80.9, dec: -69.8, size: 11, a: [0.8, 0.8, 1.0], b: [0.9, 0.7, 0.8] },     // Large Magellanic Cloud
  { ra: 13.2, dec: -72.8, size: 6, a: [0.8, 0.82, 1.0], b: [0.8, 0.75, 0.9] }     // Small Magellanic Cloud
];

function Nebula({ spec, index, uniforms }) {
  const ref = useRef();
  const pos = useMemo(() => {
    const v = equatorialVector(spec.ra, spec.dec);
    return v.map((x) => x * STAR_RADIUS * 0.97);
  }, [spec]);
  const width = 2 * STAR_RADIUS * Math.tan((spec.size * Math.PI) / 360);
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      ...uniforms,
      uA: { value: new THREE.Vector3(...spec.a) },
      uB: { value: new THREE.Vector3(...spec.b) },
      uSeed: { value: index * 7.31 }
    },
    vertexShader: /* glsl */ `
      varying vec2 vUv; varying float vFade;
      void main() {
        vUv = uv;
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vFade = smoothstep(-0.02, 0.12, normalize(wp.xyz).y);
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uDay; uniform float uTime; uniform vec3 uA; uniform vec3 uB; uniform float uSeed;
      varying vec2 vUv; varying float vFade;
      ${NOISE}
      void main() {
        vec2 p = vUv - 0.5;
        float r = length(p) * 2.0;
        float n = fbm(p * 3.2 + uSeed + uTime * 0.004);
        float n2 = fbm(p * 6.0 - uSeed);
        float shape = smoothstep(1.0, 0.1, r + (n - 0.5) * 0.9);
        vec3 col = mix(uA, uB, n2);
        float a = shape * shape * (0.25 + 0.6 * n) * 0.3 * vFade * (1.0 - uDay);
        gl_FragColor = vec4(col, a);
      }`
  }), [uniforms, spec, index]);

  useFrame(({ camera }) => {
    if (!ref.current) return;
    ref.current.quaternion.copy(camera.quaternion);
    if (ref.current.parent) {
      const pq = new THREE.Quaternion();
      ref.current.parent.getWorldQuaternion(pq);
      ref.current.quaternion.premultiply(pq.invert());
    }
  });

  return (
    <mesh ref={ref} position={pos} material={material} frustumCulled={false}>
      <planeGeometry args={[width, width]} />
    </mesh>
  );
}

/* ---------- Moon: real position and phase, drawn a little larger than life ---------- */
function Moon({ live, uniforms }) {
  const disc = useRef();
  const halo = useRef();
  const phaseU = useMemo(() => ({ uPhase: { value: 0 }, uSign: { value: 1 }, uIllum: { value: 0.5 } }), []);

  const discMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { ...uniforms, ...phaseU },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uDay; uniform float uPhase; uniform float uSign;
      varying vec2 vUv;
      ${NOISE}
      void main() {
        vec2 p = (vUv - 0.5) * 2.0;
        float r = length(p);
        if (r > 1.0) discard;
        vec3 n = vec3(p, sqrt(1.0 - r * r));
        vec3 s = vec3(uSign * sin(uPhase), 0.0, cos(uPhase));
        float lit = smoothstep(-0.04, 0.12, dot(n, s));
        float maria = smoothstep(0.52, 0.68, fbm(p * 2.3 + 4.0));
        vec3 surface = vec3(0.95, 0.93, 0.88) * (0.82 + 0.18 * fbm(p * 7.0)) * (1.0 - 0.22 * maria);
        surface *= mix(0.72, 1.0, n.z);
        vec3 col = surface * lit + vec3(0.05, 0.06, 0.09) * (1.0 - lit) * (1.0 - uDay);
        float edge = smoothstep(1.0, 0.96, r);
        float a = edge * mix(1.0, lit * 0.7, uDay);
        gl_FragColor = vec4(col, a);
      }`
  }), [uniforms, phaseU]);

  const haloMat = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { ...uniforms, ...phaseU },
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: /* glsl */ `
      uniform float uDay; uniform float uIllum; varying vec2 vUv;
      void main() {
        float r = length(vUv - 0.5) * 2.0;
        float g = exp(-r * r * 9.0) * 0.5 + exp(-r * r * 2.5) * 0.12;
        gl_FragColor = vec4(vec3(0.85, 0.88, 1.0), g * uIllum * (1.0 - uDay * 0.85));
      }`
  }), [uniforms, phaseU]);

  useFrame(({ camera }) => {
    const { lat, lon, date } = live.current;
    const moon = moonPosition(date);
    const hz = toHorizontal(moon.ra, moon.dec, date, lat, lon);
    const phase = moonPhase(date);
    phaseU.uPhase.value = ((180 - phase.elongation) * Math.PI) / 180;
    phaseU.uSign.value = phase.waxing ? 1 : -1;
    phaseU.uIllum.value = 0.25 + phase.illumination;
    const v = horizontalVector(hz.alt, hz.az);
    const visible = hz.alt > -3;
    [disc, halo].forEach((m, i) => {
      if (!m.current) return;
      m.current.visible = visible;
      const d = i === 0 ? 90 : 91;
      m.current.position.set(v[0] * d, v[1] * d, v[2] * d);
      m.current.quaternion.copy(camera.quaternion);
    });
  });

  return (
    <>
      <mesh ref={halo} material={haloMat} renderOrder={1} frustumCulled={false}>
        <planeGeometry args={[26, 26]} />
      </mesh>
      <mesh ref={disc} material={discMat} renderOrder={2} frustumCulled={false}>
        <planeGeometry args={[5.2, 5.2]} />
      </mesh>
    </>
  );
}

/* ---------- Rotates the whole celestial sphere to the visitor's real sky ---------- */
function CelestialSphere({ live, children }) {
  const ref = useRef();
  const last = useRef(0);
  const m = useMemo(() => new THREE.Matrix4(), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.matrixWorldNeedsUpdate = true;
    const t = clock.elapsedTime;
    if (t - last.current < 5 && last.current !== 0) return;
    last.current = t || 0.001;
    const { lat, lon } = live.current;
    const r = equatorialToWorld(new Date(), lat, lon);
    m.set(r[0], r[1], r[2], 0, r[3], r[4], r[5], 0, r[6], r[7], r[8], 0, 0, 0, 0, 1);
    ref.current.matrix.copy(m);
    ref.current.matrixWorldNeedsUpdate = true;
  });
  return <group ref={ref} matrixAutoUpdate={false}>{children}</group>;
}

/* ---------- Camera: tilts up after the intro, pans as you scroll ---------- */
function CameraRig({ live, uniforms }) {
  const { camera, size } = useThree();
  const cur = useRef({ alt: 3, az: 180 });
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (live.current.intro === 'done') cur.current.alt = 24;
    const onMove = (e) => {
      mouse.current.x = e.clientX / window.innerWidth - 0.5;
      mouse.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [live]);

  useEffect(() => {
    camera.fov = size.width < size.height ? 78 : 62;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((state, dt) => {
    const L = live.current;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const scroll = Math.min(1, window.scrollY / max);
    const still = L.reducedMotion;
    const targetAz = 180 + scroll * 110 + (still ? 0 : mouse.current.x * 4);
    // Past the hero the camera lifts off the horizon, then keeps rising with the page
    const lift = Math.min(1, window.scrollY / window.innerHeight);
    const targetAlt = L.intro === 'intro' ? 3 : 24 + lift * 24 + scroll * 22 - (still ? 0 : mouse.current.y * 2.5);
    const rate = L.intro === 'rising' ? 0.8 : 2.4;
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * rate);
    cur.current.alt += (targetAlt - cur.current.alt) * k;
    cur.current.az += (targetAz - cur.current.az) * k;
    const d = horizontalVector(cur.current.alt, cur.current.az);
    camera.lookAt(d[0], d[1], d[2]);

    // Day/night crossfade and the sunrise/sunset that goes with it
    const targetDay = L.theme === 'day' ? 1 : 0;
    L.day += (targetDay - L.day) * (1 - Math.exp(-Math.min(dt, 0.1) * 1.1));
    uniforms.uDay.value = L.day;
    uniforms.uTime.value = state.clock.elapsedTime;

    const sun = sunPosition(L.date);
    const real = toHorizontal(sun.ra, sun.dec, L.date, L.lat, L.lon);
    const shownAlt = real.alt > 6 ? real.alt : 9;
    const shownAz = real.alt > 6 ? real.az : cur.current.az + 28;
    const alt = -16 + (shownAlt + 16) * L.day;
    const s = horizontalVector(alt, shownAz);
    uniforms.uSunDir.value.set(s[0], s[1], s[2]);
  });
  return null;
}

function Scene(props) {
  const live = useLive(props);
  const { gl } = useThree();
  const uniforms = useMemo(() => ({
    uDay: { value: live.current.day },
    uTime: { value: 0 },
    uSunDir: { value: new THREE.Vector3(0, -1, 0) },
    uPixelRatio: { value: gl.getPixelRatio() }
  }), [gl, live]);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/sky/sky.json').then((r) => r.json()).then(setData).catch(() => {});
  }, []);

  return (
    <>
      <CameraRig live={live} uniforms={uniforms} />
      <Dome uniforms={uniforms} />
      <CelestialSphere live={live}>
        <MilkyWay uniforms={uniforms} />
        {NEBULAE.map((n, i) => <Nebula key={i} spec={n} index={i} uniforms={uniforms} />)}
        {data && <ConstellationLines data={data} uniforms={uniforms} />}
        {data && <Stars data={data} uniforms={uniforms} />}
      </CelestialSphere>
      <Moon live={live} uniforms={uniforms} />
    </>
  );
}

export default function Sky({ theme, location, intro, paused, reducedMotion }) {
  const [date, setDate] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <Canvas
      flat
      dpr={[1, isMobile ? 1.5 : 1.75]}
      frameloop={paused ? 'never' : 'always'}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      camera={{ fov: 62, near: 0.1, far: 1000, position: [0, 0, 0] }}
    >
      <Scene
        theme={theme}
        lat={location.lat}
        lon={location.lon}
        date={date}
        intro={intro}
        reducedMotion={reducedMotion}
      />
    </Canvas>
  );
}
