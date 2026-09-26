import { useState } from 'react';
import { portfolioData } from '../portfolio-content';
import { useNocturne } from './NocturneContext';
import { nocturneAudio } from './audio';
import { Icon, LightOrb, MoonGlyph, SectionHead } from './ui';

const { journey, achievements, certifications, hero } = portfolioData;

/* ---------- V · Phases: the moon waxes as the story goes on ---------- */
export function Phases() {
  const n = journey.length;
  return (
    <section id="phases" className="section">
      <SectionHead
        num="V"
        tempo="Moderato"
        title="A moon that keeps waxing"
        sub="Experience and education, oldest to newest. Every phase a little fuller."
      />
      <ol className="phases">
        {journey.map((j, i) => {
          const k = 0.08 + (0.9 * i) / Math.max(1, n - 1);
          return (
            <li key={j.title + j.period} className={`phase reveal ${i % 2 ? 'right' : 'left'}`}>
              <div className="phase-moon">
                <MoonGlyph k={k} size={46} />
              </div>
              <div className="phase-card glass">
                <p className="phase-meta">
                  <span className={`kind ${j.kind}`}>{j.kind === 'education' ? 'Study' : 'Work'}</span>
                  {j.period}
                </p>
                <h3>{j.title}</h3>
                <p className="phase-org">{j.org} · {j.location}</p>
                <p className="phase-desc">{j.description}</p>
                {j.points.length > 0 && (
                  <ul>{j.points.map((p) => <li key={p}>{p}</li>)}</ul>
                )}
                {j.technologies.length > 0 && (
                  <div className="tags">{j.technologies.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                )}
              </div>
              {i === 3 && <LightOrb id="phases" style={{ left: '50%', top: '-1.6rem' }} />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ---------- VI · Bright moments ---------- */
export function Moments() {
  return (
    <section id="moments" className="section">
      <SectionHead num="VI" tempo="Scherzo" title="Bright moments" />
      <div className="moments-grid">
        {achievements.map((a) => (
          <article key={a.title} className="moment glass reveal">
            <span className={`moment-star r${a.rank}`} aria-hidden="true"><Icon.Sparkle size={40 - a.rank * 8} /></span>
            <h3>{a.title}</h3>
            <p>{a.description}</p>
          </article>
        ))}
      </div>
      <div className="certs reveal">
        <p className="overline">Certified</p>
        <ul>
          {certifications.map((c) => (
            <li key={c.name}><strong>{c.name}</strong><span>{c.provider}</span></li>
          ))}
        </ul>
      </div>
      <LightOrb id="moments" style={{ left: '4%', bottom: '2rem' }} />
    </section>
  );
}

/* ---------- VII · Coda: write a letter, seal it, send it off as a shooting star ---------- */
export function Coda() {
  const { soundOn } = useNocturne();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [stage, setStage] = useState('write'); // write → sealing → flying → sent
  const [error, setError] = useState('');
  const c = hero.contact;

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const send = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError('A letter needs a name and a few words.');
      return;
    }
    setError('');
    setStage('sealing');
    if (soundOn) nocturneAudio.melody([62, 69, 74, 78, 81, 86], { gap: 0.11, velocity: 0.22 });
    setTimeout(() => setStage('flying'), 900);
    setTimeout(() => {
      setStage('sent');
      const subject = encodeURIComponent(`A letter from ${form.name.trim()}`);
      const body = encodeURIComponent(`${form.message.trim()}\n\n${form.name.trim()}${form.email ? ` (${form.email.trim()})` : ''}`);
      window.location.href = `mailto:${c.email}?subject=${subject}&body=${body}`;
    }, 2300);
  };

  return (
    <section id="coda" className="section coda">
      <SectionHead
        num="VII"
        tempo="Coda"
        title="Send a letter to the stars"
        sub="Recruiters, collaborators, fellow stargazers: I read every one."
      />
      <div className="coda-body">
        <div className={`letter-stage ${stage}`}>
          {stage !== 'sent' ? (
            <form className="letter-form paper" onSubmit={send} noValidate>
              <p className="letter-greeting">Dear Manas,</p>
              <label>
                <span>Your name</span>
                <input value={form.name} onChange={update('name')} autoComplete="name" required />
              </label>
              <label>
                <span>Your email (so I can write back)</span>
                <input type="email" value={form.email} onChange={update('email')} autoComplete="email" />
              </label>
              <label>
                <span>Your letter</span>
                <textarea rows={5} value={form.message} onChange={update('message')} required />
              </label>
              {error && <p className="form-error" role="alert">{error}</p>}
              <button type="submit" className="btn btn-primary" disabled={stage !== 'write'}>
                Seal &amp; send <Icon.Sparkle size={12} />
              </button>
              <div className="wax-seal stamp" aria-hidden="true"><Icon.Sparkle size={18} /></div>
            </form>
          ) : (
            <div className="letter-sent paper" role="status">
              <p className="letter-greeting">Your letter is on its way.</p>
              <p>Your mail app should have opened with the letter ready to go. Just press send.</p>
              <p>Nothing opened? Write to <a href={`mailto:${c.email}`}>{c.email}</a>.</p>
              <button type="button" className="text-btn" onClick={() => { setStage('write'); setForm({ name: '', email: '', message: '' }); }}>
                Write another
              </button>
            </div>
          )}
          <span className="letter-comet" aria-hidden="true" />
        </div>

        <aside className="coda-links glass reveal">
          <p className="overline">Or find me directly</p>
          <a href={`mailto:${c.email}`}><Icon.Mail /> {c.email}</a>
          <a href={c.linkedin} target="_blank" rel="noopener noreferrer"><Icon.LinkedIn /> LinkedIn</a>
          <a href={c.github} target="_blank" rel="noopener noreferrer"><Icon.GitHub /> GitHub</a>
          <a href={c.resume} target="_blank" rel="noopener noreferrer"><Icon.Doc /> Resume (PDF)</a>
          <p className="coda-meta">{c.phone} · {c.location}</p>
          <LightOrb id="coda" style={{ right: '1.2rem', bottom: '1.2rem' }} />
        </aside>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <p>Composed under the night sky · © {new Date().getFullYear()} Manas Khare</p>
      <p className="footer-small">
        Star positions from the Yale Bright Star Catalogue via d3-celestial · Seven small lights are hidden on this page.
      </p>
    </footer>
  );
}

/* ---------- 404: a black hole ---------- */
export function BlackHole() {
  const words = ['404', 'this', 'page', 'drifted', 'too', 'close', '✦', 'lost', 'light'];
  return (
    <main className="blackhole-page">
      <div className="blackhole" aria-hidden="true">
        <div className="accretion" />
        <div className="photon-ring" />
        <div className="event-horizon" />
        {words.map((w, i) => (
          <span key={i} className="infalling" style={{ '--a': `${i * 40}deg`, '--d': `${i * -0.7}s` }}>{w}</span>
        ))}
      </div>
      <h1>This page fell past the event horizon.</h1>
      <p>Whatever was here has been pulled somewhere light can't follow.</p>
      <a className="btn btn-primary" href="/">Escape the pull, back home</a>
    </main>
  );
}
