import { useMemo, useRef, useState } from 'react';
import { portfolioData } from '../portfolio-content';
import { useNocturne } from './NocturneContext';
import { PENTATONIC } from './audio';
import { Icon, LightOrb, SectionHead } from './ui';

/* ---------- III · Constellations: every skill is a star, every shape is a melody ---------- */
const W = 300, H = 210, PAD = 22;
const px = (s) => PAD + s.x * (W - PAD * 2);
const py = (s) => PAD + s.y * (H - PAD * 2);

// Higher on the chart = higher note. The shape of the constellation *is* its melody.
const noteFor = (star, offset) => PENTATONIC[Math.min(PENTATONIC.length - 1, Math.round((1 - star.y) * 6) + offset)];

function ConstellationCard({ c, index }) {
  const { playNotes } = useNocturne();
  const [active, setActive] = useState(null);
  const [visited, setVisited] = useState(() => new Set());
  const [lit, setLit] = useState(() => new Set());
  const [playing, setPlaying] = useState(null);
  const timers = useRef([]);
  const offset = index % 3;
  const complete = lit.size === c.lines.length;

  const touch = (i) => {
    setActive(i);
    playNotes([noteFor(c.stars[i], offset)], { duration: 2.4 });
    const nextLit = new Set(lit);
    c.lines.forEach(([a, b], li) => {
      if ((a === i && visited.has(b)) || (b === i && visited.has(a))) nextLit.add(li);
    });
    const nextVisited = new Set(visited).add(i);
    setVisited(nextVisited);
    if (nextLit.size !== lit.size) {
      setLit(nextLit);
      if (nextLit.size === c.lines.length) setTimeout(play, 500);
    }
  };

  function play() {
    timers.current.forEach(clearTimeout);
    const order = c.stars.map((s, i) => i).sort((a, b) => c.stars[a].x - c.stars[b].x);
    playNotes(order.map((i) => noteFor(c.stars[i], offset)), { gap: 0.3 });
    timers.current = order.map((i, k) => setTimeout(() => setPlaying(i), k * 300));
    timers.current.push(setTimeout(() => setPlaying(null), order.length * 300 + 400));
  }

  return (
    <article className={`constellation-card glass reveal ${complete ? 'complete' : ''}`} style={{ '--i': index }}>
      <header>
        <h3>{c.name}</h3>
        <p className="real-name">{c.real}</p>
      </header>
      <svg viewBox={`0 0 ${W} ${H}`} className="star-chart" role="group" aria-label={`${c.name} constellation`}>
        {c.lines.map(([a, b], li) => (
          <line
            key={li}
            x1={px(c.stars[a])} y1={py(c.stars[a])} x2={px(c.stars[b])} y2={py(c.stars[b])}
            className={lit.has(li) ? 'lit' : ''}
          />
        ))}
        {c.stars.map((s, i) => {
          const r = 2 + s.level * 1.1;
          const x = px(s), y = py(s);
          const on = active === i || playing === i;
          const labelRight = s.x < 0.62;
          return (
            <g
              key={s.name}
              className={`chart-star ${on ? 'on' : ''} ${visited.has(i) ? 'seen' : ''}`}
              tabIndex={0}
              role="button"
              aria-label={`${s.name}, ${s.level} of 5`}
              onPointerEnter={() => touch(i)}
              onFocus={() => touch(i)}
              onPointerLeave={() => setActive(null)}
              onBlur={() => setActive(null)}
            >
              <circle cx={x} cy={y} r={r * 2.3} className="star-halo" />
              <circle cx={x} cy={y} r={r} className="star-core" />
              <circle cx={x} cy={y} r={16} className="star-hit" />
              <text x={labelRight ? x + r + 8 : x - r - 8} y={y + 4} textAnchor={labelRight ? 'start' : 'end'} className="star-label">
                {s.name}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="skill-list">
        {c.stars.map((s) => (
          <li key={s.name}>
            <span>{s.name}</span>
            <span className="mag" aria-label={`${s.level} of 5`}>
              {Array.from({ length: 5 }, (_, k) => <i key={k} className={k < s.level ? 'on' : ''} />)}
            </span>
          </li>
        ))}
      </ul>
      <button type="button" className="text-btn play-btn" onClick={play}>
        ▶ {complete ? 'Constellation complete, play again' : 'Play this constellation'}
      </button>
    </article>
  );
}

export function Constellations() {
  return (
    <section id="constellations" className="section">
      <SectionHead
        num="III"
        tempo="Andante"
        title="The skills I navigate by"
        sub="Each skill is a star; brighter means I use it more. Hover the stars to trace a constellation. Each one plays its own melody."
      />
      <div className="constellation-grid">
        {portfolioData.constellations.map((c, i) => <ConstellationCard key={c.id} c={c} index={i} />)}
      </div>
      <LightOrb id="sky" className="orb-inline" style={{ right: '6%', top: '9rem' }} />
    </section>
  );
}

/* ---------- IV · Orbits: full-stack planets and an ML nebula ---------- */
const sphere = (h) =>
  `radial-gradient(circle at 32% 30%, hsl(${h} 90% 88%) 0%, hsl(${h} 65% 62%) 28%, hsl(${h} 55% 34%) 62%, hsl(${h} 60% 10%) 100%)`;

function ProjectDetail({ p }) {
  const moons = p.technologies.slice(0, 6);
  return (
    <article className="project-detail glass" aria-live="polite" key={p.id}>
      <div className="detail-head">
        <div className="detail-planet" style={{ '--h': p.hue }} aria-hidden="true">
          <span className="planet-body" style={{ background: sphere(p.hue) }} />
          {moons.map((t, i) => (
            <span key={t} className="moon-orbit" style={{ '--r': `${36 + i * 6}px`, '--t': `${7 + i * 3.4}s`, '--o': `${i * -2.1}s` }}>
              <span className="tech-moon" />
            </span>
          ))}
        </div>
        <div>
          <p className="detail-category">{p.category}</p>
          <h3>{p.title}</h3>
        </div>
      </div>
      <p className="detail-desc">{p.description}</p>
      <ul className="detail-features">
        {p.features.map((f) => <li key={f}>{f}</li>)}
      </ul>
      <p className="detail-impact"><Icon.Sparkle size={12} /> {p.impact}</p>
      <div className="tags">
        {p.technologies.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
      {p.link && (
        <a className="btn btn-primary btn-sm" href={p.link} target="_blank" rel="noopener noreferrer">
          {p.link.includes('github.com') ? <><Icon.GitHub size={14} /> View on GitHub</> : <><Icon.External /> View live</>}
        </a>
      )}
    </article>
  );
}

function ProjectPills({ projects, selected, onSelect }) {
  return (
    <div className="project-pills" role="tablist" aria-label="Projects">
      {projects.map((p) => (
        <button
          key={p.id}
          type="button"
          role="tab"
          aria-selected={selected === p.id}
          className={selected === p.id ? 'on' : ''}
          onClick={() => onSelect(p.id)}
          style={{ '--h': p.hue }}
        >
          <i /> {p.title}
        </button>
      ))}
    </div>
  );
}

function OrbitSystem({ projects, selected, onSelect }) {
  return (
    <div className="orbit-system" aria-label="Full-stack projects shown as planets">
      <div className="orbit-sun"><span>full-stack</span></div>
      {projects.map((p, i) => {
        const r = 22 + i * 5.3;
        const duration = 46 + i * 17;
        const delay = -(duration * ((i * 0.37) % 1));
        return (
          <div key={p.id} className="orbit" style={{ '--r': `${r}%`, '--start': `${Math.round(((i * 0.37) % 1) * 360)}deg` }}>
            <div className="orbit-ring" />
            <div className="orbit-arm" style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
              <button
                type="button"
                className={`planet ${selected === p.id ? 'on' : ''}`}
                onClick={() => onSelect(p.id)}
                aria-label={p.title}
                style={{ '--size': `${16 + (projects.length - i) * 2.4}px`, animationDuration: `${duration}s`, animationDelay: `${delay}s` }}
              >
                <span className="planet-body" style={{ background: sphere(p.hue) }} />
                {i % 3 === 1 && <span className="planet-ring" />}
                <span className="planet-label">{p.title}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const NEBULA_SPOTS = [[0.3, 0.26], [0.68, 0.22], [0.52, 0.5], [0.2, 0.62], [0.8, 0.58], [0.44, 0.84], [0.76, 0.86]];

function NebulaField({ projects, selected, onSelect }) {
  return (
    <div className="nebula-field" aria-label="Machine-learning projects shown as newborn stars">
      <div className="nebula-cloud c1" /><div className="nebula-cloud c2" /><div className="nebula-cloud c3" />
      {projects.map((p, i) => {
        const [x, y] = NEBULA_SPOTS[i % NEBULA_SPOTS.length];
        return (
          <button
            key={p.id}
            type="button"
            className={`newborn ${selected === p.id ? 'on' : ''}`}
            style={{ left: `${x * 100}%`, top: `${y * 100}%`, '--h': p.hue, animationDelay: `${i * -1.3}s` }}
            onClick={() => onSelect(p.id)}
            aria-label={p.title}
          >
            <Icon.Sparkle size={22} />
            <span className="newborn-label">{p.title}</span>
          </button>
        );
      })}
      <LightOrb id="nebula" style={{ left: '84%', top: '12%' }} />
    </div>
  );
}

function PlainCard({ p }) {
  return (
    <article className="plain-card glass">
      <p className="detail-category">{p.category}</p>
      <h3>{p.title}</h3>
      <p className="detail-desc">{p.description}</p>
      <p className="detail-impact"><Icon.Sparkle size={12} /> {p.impact}</p>
      <div className="tags">{p.technologies.map((t) => <span key={t} className="tag">{t}</span>)}</div>
      {p.link && <a className="text-link" href={p.link} target="_blank" rel="noopener noreferrer">{p.link.includes('github.com') ? 'GitHub' : 'Live site'} →</a>}
    </article>
  );
}

function Group({ title, blurb, projects, Visual, flip }) {
  const { plain } = useNocturne();
  const [selected, setSelected] = useState(projects[0].id);
  const project = useMemo(() => projects.find((p) => p.id === selected), [projects, selected]);
  return (
    <div className="orbit-group reveal">
      <header className="group-head">
        <h3>{title}</h3>
        <p>{blurb}</p>
      </header>
      {plain ? (
        <div className="plain-grid">{projects.map((p) => <PlainCard key={p.id} p={p} />)}</div>
      ) : (
        <div className={`group-body ${flip ? 'flip' : ''}`}>
          <div className="group-visual">
            <Visual projects={projects} selected={selected} onSelect={setSelected} />
            <ProjectPills projects={projects} selected={selected} onSelect={setSelected} />
          </div>
          <ProjectDetail p={project} />
        </div>
      )}
    </div>
  );
}

export function Orbits() {
  const system = portfolioData.projects.filter((p) => p.group === 'system');
  const nebula = portfolioData.projects.filter((p) => p.group === 'nebula');
  return (
    <section id="orbits" className="section">
      <SectionHead
        num="IV"
        tempo="Allegro"
        title="Worlds I've built"
        sub="Pick a planet or a newborn star to read its story. The small moons circling each one are its tech stack."
      />
      <Group
        title="The Nebula"
        blurb="Where stars are born: my machine-learning and AI work."
        projects={nebula}
        Visual={NebulaField}
      />
      <Group
        title="The System"
        blurb="Full-stack worlds held together by clean APIs and a little gravity."
        projects={system}
        Visual={OrbitSystem}
        flip
      />
    </section>
  );
}
