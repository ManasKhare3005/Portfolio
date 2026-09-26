import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { moonPhase, sunPosition, toHorizontal } from './astro';
import { nocturneAudio } from './audio';

const NocturneContext = createContext(null);
export const useNocturne = () => useContext(NocturneContext);

export const ORB_IDS = ['hero', 'letter', 'sky', 'nebula', 'phases', 'moments', 'coda'];

const DEFAULT_LOCATION = { lat: 33.43, lon: -111.94, label: 'Tempe, Arizona', precise: false };

const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable */ }
  }
};

const session = {
  get(key) { try { return sessionStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { sessionStorage.setItem(key, value); } catch { /* ignore */ } }
};

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

export function NocturneProvider({ children }) {
  const reducedMotion = useMemo(prefersReducedMotion, []);
  const [now, setNow] = useState(() => new Date());
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [manualTheme, setManualTheme] = useState(() => store.get('nocturne-theme', null));
  const [plain, setPlain] = useState(() => store.get('nocturne-plain', false));
  const [soundOn, setSoundOn] = useState(false);
  const [found, setFound] = useState(() => new Set(store.get('nocturne-orbs', [])));
  const [secretOpen, setSecretOpen] = useState(false);
  const [intro, setIntro] = useState(() =>
    reducedMotion || session.get('nocturne-intro-seen') ? 'done' : 'intro'
  );
  const [toast, setToast] = useState(null);
  const meteorListeners = useRef(new Set());
  const toastTimer = useRef();

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 4200);
  }, []);

  // Clock: minute resolution is enough for the sky caption and auto theme
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  // Approximate location from the timezone: no permission prompt needed
  useEffect(() => {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    fetch('/sky/tz.json')
      .then((r) => r.json())
      .then((zones) => {
        const hit = zones[tz];
        if (!hit) return;
        const city = tz.split('/').pop().replace(/_/g, ' ');
        setLocation((prev) => (prev.precise ? prev : { lat: hit[0], lon: hit[1], label: city, precise: false }));
      })
      .catch(() => {});
  }, []);

  const requestPreciseLocation = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
        label: 'your exact location',
        precise: true
      }),
      () => showToast('Location stayed private. Showing the sky for your timezone instead.'),
      { maximumAge: 600000, timeout: 10000 }
    );
  }, [showToast]);

  const sky = useMemo(() => {
    const sun = sunPosition(now);
    const sunAlt = toHorizontal(sun.ra, sun.dec, now, location.lat, location.lon).alt;
    return { sunAlt, moon: moonPhase(now) };
  }, [now, location]);

  const autoTheme = sky.sunAlt > -4 ? 'day' : 'night';
  const theme = manualTheme || autoTheme;

  const toggleTheme = useCallback(() => {
    const next = theme === 'night' ? 'day' : 'night';
    setManualTheme(next);
    store.set('nocturne-theme', next);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    nocturneAudio.setMood(theme);
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = theme === 'night' ? '/web_logo_dark.jpg' : '/web_logo.jpg';
    document.head.appendChild(link);
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle('plain', plain);
    document.documentElement.classList.toggle('reduced', reducedMotion);
  }, [plain, reducedMotion]);

  const toggleSound = useCallback(async () => {
    if (soundOn) {
      nocturneAudio.disable();
      setSoundOn(false);
    } else {
      const ok = await nocturneAudio.enable();
      setSoundOn(ok);
      if (!ok) showToast('Your browser does not support Web Audio.');
    }
  }, [soundOn, showToast]);

  const togglePlain = useCallback(() => {
    const next = !plain;
    setPlain(next);
    store.set('nocturne-plain', next);
    if (next) {
      nocturneAudio.disable();
      setSoundOn(false);
      setIntro('done');
    }
  }, [plain]);

  const hintedSound = useRef(false);
  const playNotes = useCallback((midis, opts) => {
    if (!soundOn) {
      if (!hintedSound.current) {
        hintedSound.current = true;
        showToast('Turn on sound (top right) to hear the stars ♪');
      }
      return;
    }
    if (midis.length === 1) nocturneAudio.note(midis[0], { velocity: 0.3, ...opts });
    else nocturneAudio.melody(midis, opts);
  }, [soundOn, showToast]);

  const onMeteors = useCallback((fn) => {
    meteorListeners.current.add(fn);
    return () => meteorListeners.current.delete(fn);
  }, []);
  const meteorShower = useCallback((count = 1) => {
    meteorListeners.current.forEach((fn) => fn(count));
  }, []);

  const collectOrb = useCallback((id) => {
    if (found.has(id)) return;
    const next = new Set(found);
    next.add(id);
    setFound(next);
    store.set('nocturne-orbs', [...next]);
    if (soundOn) nocturneAudio.melody([74, 78, 81, 86], { gap: 0.09, velocity: 0.22 });
    if (next.size === ORB_IDS.length) {
      setTimeout(() => {
        meteorShower(28);
        if (soundOn) nocturneAudio.melody([62, 66, 69, 74, 78, 81, 86, 90], { gap: 0.14, velocity: 0.25 });
        setSecretOpen(true);
      }, 700);
    } else {
      meteorShower(1);
    }
  }, [found, soundOn, meteorShower]);

  const finishIntro = useCallback(() => {
    session.set('nocturne-intro-seen', '1');
    setIntro('done');
  }, []);

  const value = {
    now, location, requestPreciseLocation, sky,
    theme, toggleTheme,
    plain, togglePlain, reducedMotion,
    soundOn, toggleSound, playNotes,
    found, collectOrb, secretOpen, setSecretOpen,
    intro, setIntro, finishIntro,
    onMeteors, meteorShower,
    toast, showToast
  };

  return <NocturneContext.Provider value={value}>{children}</NocturneContext.Provider>;
}
