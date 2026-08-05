/**
 * Procedural Halloween ambience — no audio assets, all WebAudio.
 * Nothing is created until the user interacts (browser autoplay policy).
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let stopAmbience: (() => void) | null = null;

function ensureCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext, seconds = 4) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

export function startAmbience() {
  const c = ensureCtx();
  if (!c || !master || stopAmbience) return;

  // Wind — filtered noise with a slow sweeping band
  const wind = c.createBufferSource();
  wind.buffer = noiseBuffer(c, 6);
  wind.loop = true;
  const windFilter = c.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.frequency.value = 420;
  windFilter.Q.value = 0.7;
  const windGain = c.createGain();
  windGain.gain.value = 0.22;
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.06;
  const lfoGain = c.createGain();
  lfoGain.gain.value = 260;
  lfo.connect(lfoGain).connect(windFilter.frequency);
  wind.connect(windFilter).connect(windGain).connect(master);
  wind.start();
  lfo.start();

  // Low haunted-house drone
  const drone = c.createOscillator();
  drone.type = "sine";
  drone.frequency.value = 55;
  const droneGain = c.createGain();
  droneGain.gain.value = 0.05;
  drone.connect(droneGain).connect(master);
  drone.start();

  // Occasional distant thunder + magical chimes
  const timer = window.setInterval(() => {
    if (Math.random() > 0.5) distantThunder();
    else magicSparkle();
  }, 14000);

  master.gain.cancelScheduledValues(c.currentTime);
  master.gain.linearRampToValueAtTime(0.5, c.currentTime + 2.5);

  stopAmbience = () => {
    window.clearInterval(timer);
    try {
      wind.stop();
      lfo.stop();
      drone.stop();
    } catch {
      /* already stopped */
    }
    stopAmbience = null;
  };
}

export function fadeOutAmbience() {
  if (!ctx || !master) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
  const stop = stopAmbience;
  window.setTimeout(() => stop?.(), 800);
}

export function distantThunder() {
  const c = ensureCtx();
  if (!c || !master) return;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 2.5);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 160;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 0.35);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 2.4);
  src.connect(lp).connect(g).connect(master);
  src.start();
  src.stop(c.currentTime + 2.5);
}

export function magicSparkle() {
  const c = ensureCtx();
  if (!c || !master) return;
  [880, 1320, 1760].forEach((f, i) => {
    const o = c.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    const g = c.createGain();
    const t = c.currentTime + i * 0.09;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    o.connect(g).connect(master!);
    o.start(t);
    o.stop(t + 0.8);
  });
}

/** Mischievous pumpkin laugh — descending warble */
export function pumpkinLaugh() {
  const c = ensureCtx();
  if (!c || !master) return;
  for (let i = 0; i < 5; i++) {
    const o = c.createOscillator();
    o.type = "sawtooth";
    const t = c.currentTime + i * 0.16;
    o.frequency.setValueAtTime(240 - i * 18, t);
    o.frequency.exponentialRampToValueAtTime(150 - i * 12, t + 0.13);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    o.connect(lp).connect(g).connect(master!);
    o.start(t);
    o.stop(t + 0.2);
  }
}

/** Small spooky UI click */
export function spookClick() {
  const c = ensureCtx();
  if (!c || !master) return;
  const o = c.createOscillator();
  o.type = "square";
  o.frequency.setValueAtTime(620, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(180, c.currentTime + 0.12);
  const g = c.createGain();
  g.gain.setValueAtTime(0.08, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.14);
  o.connect(g).connect(master);
  o.start();
  o.stop(c.currentTime + 0.15);
}
