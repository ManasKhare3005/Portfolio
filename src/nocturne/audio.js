// Generative ambient score for the sky. Everything is synthesized, no audio files.
// Harmony: IV – V – iii – vi in D major (the "royal road" progression beloved by anime scores),
// with D-major pentatonic "star" notes drifting on top.

const midiToHz = (m) => 440 * Math.pow(2, (m - 69) / 12);

export const PENTATONIC = [62, 64, 66, 69, 71, 74, 76, 78, 81, 83, 86, 88];

const PROGRESSION = [
  [43, 50, 54, 59], // Gmaj7
  [45, 52, 57, 61], // A
  [42, 49, 52, 57], // F#m7
  [47, 54, 57, 62]  // Bm7
];

const CHORD_SECONDS = 8;

class NocturneAudio {
  ctx = null;
  master = null;
  dry = null;
  wet = null;
  running = false;
  mood = "night";
  timers = [];
  chordIndex = 0;

  ensure() {
    if (this.ctx) return true;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return false;
    const ctx = new Ctx();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.ratio.value = 3;
    this.master.connect(comp).connect(ctx.destination);

    this.dry = ctx.createGain();
    this.dry.gain.value = 0.7;
    this.dry.connect(this.master);

    const reverb = ctx.createConvolver();
    reverb.buffer = this.impulse(4.5, 2.4);
    this.wet = ctx.createGain();
    this.wet.gain.value = 0.55;
    reverb.connect(this.wet).connect(this.master);
    this.reverbIn = reverb;
    return true;
  }

  impulse(seconds, decay) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * seconds);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const data = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  output(node, reverbSend = 0.6) {
    node.connect(this.dry);
    const send = this.ctx.createGain();
    send.gain.value = reverbSend;
    node.connect(send).connect(this.reverbIn);
  }

  // Soft felt-piano / celesta voice
  note(midi, { velocity = 0.35, duration = 2.8, delay = 0 } = {}) {
    if (!this.running) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + delay + 0.01;
    const f = midiToHz(midi);
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(velocity, t + 0.012);
    env.gain.exponentialRampToValueAtTime(0.0008, t + duration);
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.setValueAtTime(Math.min(12000, f * 7), t);
    tone.frequency.exponentialRampToValueAtTime(Math.max(400, f * 1.5), t + duration);
    tone.connect(env);
    [[1, 1, "sine"], [2, 0.22, "triangle"], [3, 0.06, "sine"], [1.002, 0.4, "sine"]].forEach(([mult, gain, type]) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = f * mult;
      const g = ctx.createGain();
      g.gain.value = gain;
      osc.connect(g).connect(tone);
      osc.start(t);
      osc.stop(t + duration + 0.1);
    });
    this.output(env, 0.7);
  }

  melody(midis, { gap = 0.26, velocity = 0.3 } = {}) {
    midis.forEach((m, i) => this.note(m, { velocity, delay: i * gap, duration: 3.2 }));
  }

  pad(chord) {
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.05;
    const hold = CHORD_SECONDS + 3;
    const shift = this.mood === "day" ? 12 : 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = this.mood === "day" ? 1400 : 800;
    filter.Q.value = 0.4;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.045, t + 3);
    env.gain.setValueAtTime(0.045, t + hold - 4);
    env.gain.linearRampToValueAtTime(0, t + hold);
    filter.connect(env);
    chord.forEach((m) => {
      [-6, 6].forEach((cents) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = midiToHz(m + shift);
        osc.detune.value = cents;
        const g = ctx.createGain();
        g.gain.value = 0.12;
        osc.connect(g).connect(filter);
        osc.start(t);
        osc.stop(t + hold + 0.1);
      });
    });
    this.output(env, 0.9);
  }

  loopChords = () => {
    if (!this.running) return;
    this.pad(PROGRESSION[this.chordIndex % PROGRESSION.length]);
    this.chordIndex++;
    this.timers.push(setTimeout(this.loopChords, CHORD_SECONDS * 1000));
  };

  loopSparkles = () => {
    if (!this.running) return;
    const low = this.mood === "day" ? 4 : 0;
    const high = this.mood === "day" ? PENTATONIC.length : PENTATONIC.length - 3;
    const pick = PENTATONIC[low + Math.floor(Math.random() * (high - low))];
    this.note(pick, { velocity: 0.08 + Math.random() * 0.12, duration: 3.5 });
    if (Math.random() < 0.3) this.note(pick + (Math.random() < 0.5 ? 12 : 7), { velocity: 0.06, delay: 0.3, duration: 3 });
    const wait = this.mood === "day" ? 900 + Math.random() * 2200 : 1400 + Math.random() * 3200;
    this.timers.push(setTimeout(this.loopSparkles, wait));
  };

  async enable() {
    if (!this.ensure()) return false;
    await this.ctx.resume();
    if (this.running) return true;
    this.running = true;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0.8, t + 2.5);
    this.loopChords();
    this.timers.push(setTimeout(this.loopSparkles, 1800));
    return true;
  }

  disable() {
    if (!this.ctx || !this.running) return;
    this.running = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(0, t + 1.2);
    setTimeout(() => { if (!this.running) this.ctx.suspend(); }, 1400);
  }

  setMood(mood) {
    this.mood = mood;
  }
}

export const nocturneAudio = new NocturneAudio();
