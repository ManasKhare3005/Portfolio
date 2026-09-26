import { Component, lazy, Suspense } from 'react';
import { NocturneProvider, useNocturne } from './nocturne/NocturneContext';
import { Hero, Intro, Letter, Nav } from './nocturne/Opening';
import { Constellations, Orbits } from './nocturne/Work';
import { BlackHole, Coda, Footer, Moments, Phases } from './nocturne/Closing';
import { Meteors, SecretLetter, Toast, useRevealAll } from './nocturne/ui';
import './nocturne/nocturne.css';

const Sky = lazy(() => import('./nocturne/Sky'));

// If WebGL is unavailable the CSS sky behind the canvas simply stays in place
class SkyBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

function Nocturne() {
  const { theme, location, intro, plain, reducedMotion } = useNocturne();
  useRevealAll([plain]);

  return (
    <div className={`app intro-${intro}`}>
      <div className="sky-fallback" aria-hidden="true" />
      {!plain && (
        <div className="sky-layer" aria-hidden="true">
          <SkyBoundary>
            <Suspense fallback={null}>
              <Sky theme={theme} location={location} intro={intro} paused={plain} reducedMotion={reducedMotion} />
            </Suspense>
          </SkyBoundary>
        </div>
      )}
      <Meteors />
      <Intro />
      <a href="#letter" className="skip-link">Skip to content</a>
      <Nav />
      <main>
        <Hero />
        <Letter />
        <Constellations />
        <Orbits />
        <Phases />
        <Moments />
        <Coda />
      </main>
      <Footer />
      <SecretLetter />
      <Toast />
    </div>
  );
}

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, '');
  if (path !== '' && path !== '/index.html') {
    return <BlackHole />;
  }
  return (
    <NocturneProvider>
      <Nocturne />
    </NocturneProvider>
  );
}
