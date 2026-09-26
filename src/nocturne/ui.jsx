import { useCallback, useEffect, useRef, useState } from 'react';
import { useNocturne, ORB_IDS } from './NocturneContext';
import { portfolioData } from '../portfolio-content';

export function useInView(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (!('IntersectionObserver' in window)) { setInView(true); return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); io.disconnect(); }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return [ref, inView];
}

// Marks every .reveal element with data-in (not a class, so React re-renders can't wipe it) as it scrolls into view
export function useRevealAll(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal:not([data-in])');
    if (!('IntersectionObserver' in window)) { els.forEach((el) => el.setAttribute('data-in', '')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function SectionHead({ num, tempo, title, sub }) {
  return (
    <header className="section-head reveal">
      <p className="overline">{num} · <em>{tempo}</em></p>
      <h2>{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </header>
  );
}

// Moon phase glyph. k = illuminated fraction (0 new → 1 full), waxing lights the right side.
export function MoonGlyph({ k, size = 40, waxing = true, className = '' }) {
  const r = 18, cx = 20, cy = 20;
  const rx = Math.abs(1 - 2 * k) * r;
  const sweep = k < 0.5 ? 0 : 1;
  const lit = k <= 0.01
    ? null
    : k >= 0.99
      ? <circle cx={cx} cy={cy} r={r} className="moon-lit" />
      : <path className="moon-lit" d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`} />;
  return (
    <svg className={`moon-glyph ${className}`} width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx={cx} cy={cy} r={r} className="moon-dark" />
      <g transform={waxing ? undefined : `translate(40 0) scale(-1 1)`}>{lit}</g>
    </svg>
  );
}

/* ---------- Hidden lights (seven of them) ---------- */
export function LightOrb({ id, style, className = '' }) {
  const { found, collectOrb } = useNocturne();
  const [burst, setBurst] = useState(false);
  if (found.has(id) && !burst) return null;
  return (
    <button
      type="button"
      className={`light-orb ${burst ? 'burst' : ''} ${className}`}
      style={style}
      aria-label="A small, drifting light"
      onClick={() => {
        if (burst) return;
        setBurst(true);
        collectOrb(id);
        setTimeout(() => setBurst(false), 900);
      }}
    >
      <span className="light-orb-core" />
    </button>
  );
}

export function OrbCounter() {
  const { found } = useNocturne();
  return (
    <div className="orb-counter" title={`Lights found: ${found.size} of ${ORB_IDS.length}`} aria-label={`Hidden lights found: ${found.size} of ${ORB_IDS.length}`}>
      {ORB_IDS.map((id) => <span key={id} className={found.has(id) ? 'on' : ''} />)}
    </div>
  );
}

export function SecretLetter() {
  const { secretOpen, setSecretOpen } = useNocturne();
  const closeRef = useRef(null);
  useEffect(() => {
    if (!secretOpen) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setSecretOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [secretOpen, setSecretOpen]);
  if (!secretOpen) return null;
  return (
    <div className="modal-backdrop" onClick={() => setSecretOpen(false)}>
      <div className="secret-letter paper" role="dialog" aria-modal="true" aria-labelledby="secret-title" onClick={(e) => e.stopPropagation()}>
        <p className="overline">7 of 7 lights</p>
        <h3 id="secret-title">A wish, granted</h3>
        {portfolioData.secretLetter.map((p, i) => <p key={i}>{p}</p>)}
        <p className="signature">Manas</p>
        <div className="secret-actions">
          <a className="btn btn-primary" href="#coda" onClick={() => setSecretOpen(false)}>Write to me</a>
          <button ref={closeRef} className="btn btn-ghost" onClick={() => setSecretOpen(false)}>Back to the sky</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shooting stars (DOM layer above the canvas) ---------- */
export function Meteors() {
  const { onMeteors, theme, plain, reducedMotion, intro } = useNocturne();
  const [items, setItems] = useState([]);
  const idRef = useRef(0);

  const spawn = useCallback((count) => {
    const batch = Array.from({ length: count }, (_, i) => ({
      id: ++idRef.current,
      top: Math.random() * 45,
      left: 20 + Math.random() * 75,
      angle: 200 + Math.random() * 25,
      length: 120 + Math.random() * 160,
      duration: 0.9 + Math.random() * 0.8,
      delay: count > 1 ? i * 0.12 + Math.random() * 0.5 : 0
    }));
    setItems((prev) => [...prev, ...batch]);
    const longest = Math.max(...batch.map((b) => b.delay + b.duration));
    setTimeout(() => {
      const ids = new Set(batch.map((b) => b.id));
      setItems((prev) => prev.filter((m) => !ids.has(m.id)));
    }, (longest + 0.3) * 1000);
  }, []);

  useEffect(() => onMeteors(spawn), [onMeteors, spawn]);

  useEffect(() => {
    if (plain || reducedMotion || theme !== 'night' || intro !== 'done') return;
    let t;
    const loop = () => {
      t = setTimeout(() => { spawn(1); loop(); }, 9000 + Math.random() * 14000);
    };
    loop();
    return () => clearTimeout(t);
  }, [plain, reducedMotion, theme, intro, spawn]);

  if (plain) return null;
  return (
    <div className="meteors" aria-hidden="true">
      {items.map((m) => (
        <span
          key={m.id}
          className="meteor"
          style={{
            top: `${m.top}%`,
            left: `${m.left}%`,
            '--angle': `${m.angle}deg`,
            '--len': `${m.length}px`,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`
          }}
        />
      ))}
    </div>
  );
}

export function Toast() {
  const { toast } = useNocturne();
  return (
    <div className={`toast ${toast ? 'show' : ''}`} role="status" aria-live="polite">
      {toast}
    </div>
  );
}

/* ---------- Icons ---------- */
export const Icon = {
  Sun: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="12" y1="2.5" x2="12" y2="4.5" transform={`rotate(${a} 12 12)`} />
      ))}
    </svg>
  ),
  Moon: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5z" />
    </svg>
  ),
  GitHub: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  LinkedIn: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  External: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  Doc: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  Mail: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
    </svg>
  ),
  Sparkle: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0c.6 5.6 2.4 8.9 12 12-9.6 3.1-11.4 6.4-12 12-.6-5.6-2.4-8.9-12-12C9.6 8.9 11.4 5.6 12 0z" />
    </svg>
  )
};

export function SoundToggle() {
  const { soundOn, toggleSound, plain } = useNocturne();
  if (plain) return null;
  return (
    <button
      type="button"
      className={`icon-btn sound-toggle ${soundOn ? 'on' : ''}`}
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
      title={soundOn ? 'Sound on: the sky is playing' : 'Sound off: let the sky play'}
    >
      <span className="eq" aria-hidden="true"><i /><i /><i /><i /></span>
    </button>
  );
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useNocturne();
  const night = theme === 'night';
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={night ? 'Switch to Aubade (dawn) theme' : 'Switch to Nocturne (night) theme'}
      title={night ? 'Aubade: bring the dawn' : 'Nocturne: bring the night'}
    >
      {night ? <Icon.Sun /> : <Icon.Moon />}
    </button>
  );
}
