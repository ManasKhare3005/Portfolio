import { useEffect, useRef, useState } from 'react';
import { portfolioData } from '../portfolio-content';
import { useNocturne } from './NocturneContext';
import { Icon, LightOrb, OrbCounter, SectionHead, SoundToggle, ThemeToggle, useInView } from './ui';

const { hero, letter } = portfolioData;

const NAV = [
  ['letter', 'Letter'],
  ['constellations', 'Constellations'],
  ['orbits', 'Orbits'],
  ['phases', 'Phases'],
  ['coda', 'Write to me']
];

export function Nav() {
  const { plain, togglePlain } = useNocturne();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav-solid' : ''}`} aria-label="Main">
      <a href="#home" className="nav-brand">
        <Icon.Sparkle size={12} /> <span>Manas Khare</span>
      </a>
      <div className="nav-links">
        {NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
      </div>
      <div className="nav-tools">
        <OrbCounter />
        <button type="button" className="text-btn" onClick={togglePlain} aria-pressed={plain}>
          {plain ? 'Show the sky' : 'Skip the sky'}
        </button>
        <SoundToggle />
        <ThemeToggle />
        <a href={hero.contact.resume} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
          <Icon.Doc size={14} /> Resume
        </a>
        <button
          type="button"
          className="icon-btn menu-btn"
          aria-expanded={open}
          aria-label="Menu"
          onClick={() => setOpen(!open)}
        >
          <span className={`burger ${open ? 'x' : ''}`}><i /><i /><i /></span>
        </button>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {NAV.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <button type="button" className="text-btn" onClick={() => { togglePlain(); setOpen(false); }}>
          {plain ? 'Show the sky' : 'Skip the sky'}
        </button>
      </div>
    </nav>
  );
}

/* Opening shot: dark horizon, "look up.", then the camera tilts into the sky */
export function Intro() {
  const { intro, setIntro, finishIntro, theme } = useNocturne();
  const [line, setLine] = useState(0);

  useEffect(() => {
    if (intro !== 'intro') return;
    const timers = [
      setTimeout(() => setLine(1), 500),
      setTimeout(() => setLine(2), 1900),
      setTimeout(() => setLine(3), 3100),
      setTimeout(() => setIntro('rising'), 3500),
      setTimeout(finishIntro, 6200)
    ];
    const skip = (e) => {
      if (e.type === 'keydown' && e.key === 'Tab') return;
      finishIntro();
    };
    window.addEventListener('keydown', skip);
    window.addEventListener('wheel', skip, { passive: true });
    window.addEventListener('touchmove', skip, { passive: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('touchmove', skip);
    };
  }, [intro, setIntro, finishIntro]);

  if (intro === 'done') return null;
  return (
    <div className={`intro ${intro}`} aria-live="polite">
      <p className={`intro-line ${line >= 1 && line < 3 ? 'show' : ''}`}>
        {line >= 2 ? 'look up.' : theme === 'night' ? 'the sky tonight is real.' : 'this is your real sky.'}
      </p>
      <button type="button" className="intro-skip text-btn" onClick={finishIntro}>skip ›</button>
    </div>
  );
}

export function Silhouette() {
  return (
    <svg className="silhouette" viewBox="0 0 1440 320" preserveAspectRatio="xMaxYMax slice" aria-hidden="true">
      <path className="hill-3" d="M0 205 C 200 160, 380 196, 560 176 S 900 140, 1100 178 S 1350 160, 1440 182 V320 H0Z" />
      <path className="hill-2" d="M0 250 C 180 222, 320 246, 520 236 C 700 226, 820 200, 1000 212 C 1150 222, 1300 246, 1440 236 V320 H0Z" />
      <path className="hill-1" d="M0 298 C 240 288, 520 298, 760 284 C 900 276, 975 252, 1055 250 C 1150 248, 1240 268, 1440 280 V320 H0Z" />
      <g className="hill-1" transform="translate(1030 251)">
        {/* someone sitting on the crest, pointing at the sky */}
        <circle cx="16" cy="-46" r="7" />
        <path d="M9 -38 L22 -39 L30 -6 L12 -4 Z" />
        <path d="M13 -34 L-5 -60 L-1 -62 L19 -36 Z" />
        <path d="M14 -7 L-2 -22 L-14 -3 L-9 -1 L-1 -13 L18 0 Z" />
        <path d="M28 -30 L40 -14 L36 -12 L26 -24 Z" />
      </g>
      <g className="hill-1 telescope" transform="translate(1110 249)">
        <path d="M0 0 L10 -24 L20 0" fill="none" strokeWidth="2.4" />
        <path d="M10 -24 L10 0" fill="none" strokeWidth="2" />
        <rect x="-6" y="-31" width="36" height="7" rx="2" transform="rotate(-38 10 -26)" />
      </g>
    </svg>
  );
}

function NameConstellation({ play }) {
  const stars = [[92, 52], [214, 80], [330, 38], [452, 72], [566, 46], [690, 34], [806, 76], [912, 48]];
  return (
    <div className={`name-constellation ${play ? 'play' : ''}`}>
      <h1 className="sr-only">{hero.name}</h1>
      <svg viewBox="0 0 1000 200" aria-hidden="true">
        <polyline className="name-lines" points={stars.map((s) => s.join(',')).join(' ')} />
        {stars.map(([x, y], i) => (
          <circle key={i} className="name-star" cx={x} cy={y} r={i % 3 === 0 ? 3.2 : 2.2} style={{ animationDelay: `${0.4 + i * 0.18}s` }} />
        ))}
        <text x="500" y="160" textAnchor="middle" className="name-text">{hero.name}</text>
      </svg>
    </div>
  );
}

function SkyCaption() {
  const { location, requestPreciseLocation, sky, now, theme } = useNocturne();
  const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const pct = Math.round(sky.moon.illumination * 100);
  return (
    <p className="sky-caption">
      <Icon.Sparkle size={10} />{' '}
      {theme === 'night' ? 'The real sky' : 'The sky, at golden hour,'} above <strong>{location.label}</strong> · {time} · {sky.moon.name} ({pct}%)
      {!location.precise && (
        <button type="button" className="link-btn" onClick={requestPreciseLocation}>use my exact location</button>
      )}
    </p>
  );
}

export function Hero() {
  const { intro } = useNocturne();
  const ready = intro !== 'intro';
  return (
    <section id="home" className={`hero ${ready ? 'ready' : ''}`}>
      <div className="hero-inner">
        <p className="overline hero-fade" style={{ '--d': '0.2s' }}>I · <em>Prelude</em></p>
        <NameConstellation play={ready} />
        <p className="hero-role hero-fade" style={{ '--d': '1.6s' }}>{hero.title}</p>
        <p className="hero-tagline hero-fade" style={{ '--d': '1.9s' }}>{hero.tagline}</p>
        <p className="hero-desc hero-fade" style={{ '--d': '2.1s' }}>{hero.description}</p>
        <div className="hero-ctas hero-fade" style={{ '--d': '2.3s' }}>
          <a href="#orbits" className="btn btn-primary">Explore my work</a>
          <a href="#coda" className="btn btn-ghost">Write to me</a>
          <a href={hero.contact.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost"><Icon.GitHub /> GitHub</a>
        </div>
      </div>
      <div className="hero-foot hero-fade" style={{ '--d': '2.6s' }}>
        <SkyCaption />
        <span className="scroll-cue">scroll to look around</span>
      </div>
      <Silhouette />
      <LightOrb id="hero" style={{ left: '12%', bottom: '24%' }} />
    </section>
  );
}

/* ---------- II · A letter, typed out like an Auto Memory Doll would ---------- */
function Typewriter({ paragraphs, start, instant, onDone }) {
  const total = paragraphs.reduce((n, p) => n + p.length, 0);
  const [count, setCount] = useState(instant ? total : 0);
  const raf = useRef();

  useEffect(() => {
    if (instant) { setCount(total); return; }
    if (!start) return;
    let last = performance.now();
    let c = 0;
    const tick = (t) => {
      c = Math.min(total, c + ((t - last) / 1000) * 190);
      last = t;
      setCount(Math.floor(c));
      if (c < total) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [start, instant, total]);

  useEffect(() => { if (count >= total) onDone?.(); }, [count, total, onDone]);

  let remaining = count;
  return (
    <div className="typewriter" onClick={() => { cancelAnimationFrame(raf.current); setCount(total); }}>
      {paragraphs.map((p, i) => {
        const shown = Math.max(0, Math.min(p.length, remaining));
        remaining -= p.length;
        const typing = shown > 0 && shown < p.length;
        return (
          <p key={i}>
            <span>{p.slice(0, shown)}</span>
            {typing && <span className="caret" aria-hidden="true" />}
            <span className="ghost" aria-hidden="true">{p.slice(shown)}</span>
          </p>
        );
      })}
    </div>
  );
}

export function Letter() {
  const { plain, reducedMotion, sky, now } = useNocturne();
  const [ref, inView] = useInView({ threshold: 0.35 });
  const [done, setDone] = useState(false);
  const date = now.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  return (
    <section id="letter" className="section">
      <SectionHead num="II" tempo="Adagio" title="A letter" />
      <article ref={ref} className={`letter paper reveal ${done ? 'signed' : ''}`}>
        <p className="letter-date">{date}, beneath a {sky.moon.name.toLowerCase()}</p>
        <p className="letter-greeting">{letter.greeting}</p>
        <Typewriter
          paragraphs={letter.paragraphs}
          start={inView}
          instant={plain || reducedMotion}
          onDone={() => setDone(true)}
        />
        <p className="letter-signoff">{letter.signoff}</p>
        <p className="signature">{letter.signature}</p>
        <div className="wax-seal" aria-hidden="true"><Icon.Sparkle size={18} /></div>
        <LightOrb id="letter" style={{ right: '8%', bottom: '14%' }} />
      </article>
    </section>
  );
}
