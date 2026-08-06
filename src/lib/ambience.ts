/**
 * THE HALLOWEEN VAULT — cinematic procedural sound design.
 *
 * Everything is synthesised with WebAudio (no assets, no autoplay).
 * The context is only created after a real user gesture.
 *
 * Palette:
 *  - haunted mansion room tone (low bass bed + resonant creaking timbers)
 *  - wind moving through bare trees (filtered noise, two moving bands)
 *  - distant thunder
 *  - a slow minor-key celesta score
 *  - witch laughs, spell casts, crystal chimes, door creaks, drum rolls
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let bus: ConvolverNode | null = null;
let ambienceGain: GainNode | null = null;
let stopAmbienceFn: (() => void) | null = null;
let muted = true;

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();

    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    // Cathedral-ish tail so every sound feels like a big empty mansion.
    bus = ctx.createConvolver();
    bus.buffer = impulse(ctx, 2.8, 2.6);
    const wet = ctx.createGain();
    wet.gain.value = 0.34;
    bus.connect(wet).connect(master);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Route a node to both the dry master and the reverb bus. */
function send(node: AudioNode, wet = 1) {
  if (master) node.connect(master);
  if (bus && wet > 0) {
    const g = ctx!.createGain();
    g.gain.value = wet;
    node.connect(g).connect(bus);
  }
}

function impulse(c: AudioContext, seconds: number, decay: number) {
  const len = Math.floor(c.sampleRate * seconds);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
  }
  return buf;
}

function noiseBuffer(c: AudioContext, seconds = 6) {
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    // Slightly brown-tinted noise — warmer, less "ocean spray".
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    d[i] = last * 3.2;
  }
  return buf;
}

export function isMuted() {
  return muted;
}

/* ------------------------------------------------------------------ */
/* Ambience bed                                                        */
/* ------------------------------------------------------------------ */

export function startAmbience() {
  const c = ensureCtx();
  if (!c || !master) return;
  muted = false;
  if (stopAmbienceFn) {
    ambienceGain?.gain.cancelScheduledValues(c.currentTime);
    ambienceGain?.gain.linearRampToValueAtTime(0.55, c.currentTime + 1.6);
    return;
  }

  const amb = c.createGain();
  amb.gain.value = 0.0001;
  amb.connect(master);
  ambienceGain = amb;

  /* Deep cinematic sub bass — the "vault" itself breathing. */
  const sub = c.createOscillator();
  sub.type = "sine";
  sub.frequency.value = 36;
  const subGain = c.createGain();
  subGain.gain.value = 0.16;
  const subLfo = c.createOscillator();
  subLfo.frequency.value = 0.07;
  const subLfoGain = c.createGain();
  subLfoGain.gain.value = 0.08;
  subLfo.connect(subLfoGain).connect(subGain.gain);
  sub.connect(subGain).connect(amb);

  /* Minor-key drone chord (haunted mansion organ, very quiet). */
  const chordGains: GainNode[] = [];
  [73.42, 87.31, 110, 146.83].forEach((f, i) => {
    const o = c.createOscillator();
    o.type = i === 3 ? "sine" : "triangle";
    o.frequency.value = f;
    o.detune.value = i % 2 ? 6 : -6;
    const g = c.createGain();
    g.gain.value = 0.022 / (i + 1);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 620;
    o.connect(lp).connect(g);
    g.connect(amb);
    if (bus) g.connect(bus);
    chordGains.push(g);
    o.start();
    (o as OscillatorNode & { _keep?: boolean })._keep = true;
    stopables.push(o);
  });

  /* Wind through bare trees — two moving bandpasses on brown noise. */
  const wind = c.createBufferSource();
  wind.buffer = noiseBuffer(c, 9);
  wind.loop = true;
  const bp1 = c.createBiquadFilter();
  bp1.type = "bandpass";
  bp1.frequency.value = 320;
  bp1.Q.value = 1.6;
  const bp2 = c.createBiquadFilter();
  bp2.type = "bandpass";
  bp2.frequency.value = 1250;
  bp2.Q.value = 3.2;
  const windGain = c.createGain();
  windGain.gain.value = 0.13;
  const gustLfo = c.createOscillator();
  gustLfo.frequency.value = 0.045;
  const gustDepth = c.createGain();
  gustDepth.gain.value = 0.09;
  gustLfo.connect(gustDepth).connect(windGain.gain);
  const sweep = c.createOscillator();
  sweep.frequency.value = 0.03;
  const sweepDepth = c.createGain();
  sweepDepth.gain.value = 700;
  sweep.connect(sweepDepth).connect(bp2.frequency);
  wind.connect(bp1).connect(windGain);
  wind.connect(bp2).connect(windGain);
  windGain.connect(amb);
  if (bus) windGain.connect(bus);

  sub.start();
  subLfo.start();
  wind.start();
  gustLfo.start();
  sweep.start();
  stopables.push(sub, subLfo, wind, gustLfo, sweep);

  /* Occasional events: thunder, distant creaks, celesta motif. */
  const timer = window.setInterval(() => {
    if (muted) return;
    const r = Math.random();
    if (r < 0.3) distantThunder();
    else if (r < 0.6) hauntedCreak(0.35);
    else scoreMotif();
  }, 11000);

  amb.gain.linearRampToValueAtTime(0.55, c.currentTime + 3.5);

  stopAmbienceFn = () => {
    window.clearInterval(timer);
    stopables.forEach((n) => {
      try {
        (n as OscillatorNode).stop();
      } catch {
        /* already stopped */
      }
    });
    stopables.length = 0;
    chordGains.length = 0;
    ambienceGain = null;
    stopAmbienceFn = null;
  };
}

const stopables: Array<OscillatorNode | AudioBufferSourceNode> = [];

export function fadeOutAmbience() {
  muted = true;
  if (!ctx || !ambienceGain) return;
  ambienceGain.gain.cancelScheduledValues(ctx.currentTime);
  ambienceGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
  const stop = stopAmbienceFn;
  window.setTimeout(() => stop?.(), 1200);
}

/** Duck the ambience while a big one-shot plays. */
function duck(seconds = 1.2) {
  if (!ctx || !ambienceGain) return;
  const t = ctx.currentTime;
  ambienceGain.gain.cancelScheduledValues(t);
  const v = ambienceGain.gain.value;
  ambienceGain.gain.setValueAtTime(v, t);
  ambienceGain.gain.linearRampToValueAtTime(v * 0.45, t + 0.12);
  ambienceGain.gain.linearRampToValueAtTime(0.55, t + seconds);
}

/** Guard: one-shots stay silent while the user has chosen mute. */
function sfx(): AudioContext | null {
  if (muted) return null;
  return ensureCtx();
}

/* ------------------------------------------------------------------ */
/* One-shots                                                           */
/* ------------------------------------------------------------------ */

export function distantThunder() {
  const c = sfx();
  if (!c) return;
  duck(2.6);
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, 3);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(220, c.currentTime);
  lp.frequency.exponentialRampToValueAtTime(70, c.currentTime + 2.6);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.42, c.currentTime + 0.5);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 2.9);
  src.connect(lp).connect(g);
  send(g, 0.8);
  src.start();
  src.stop(c.currentTime + 3);
}

/** Deep cinematic impact — used for the vault opening. */
export function cinematicBoom() {
  const c = sfx();
  if (!c) return;
  duck(3);
  const o = c.createOscillator();
  o.type = "sine";
  o.frequency.setValueAtTime(110, c.currentTime);
  o.frequency.exponentialRampToValueAtTime(28, c.currentTime + 1.8);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, c.currentTime);
  g.gain.exponentialRampToValueAtTime(0.6, c.currentTime + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 2.6);
  o.connect(g);
  send(g, 0.6);
  o.start();
  o.stop(c.currentTime + 2.7);

  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 1.5);
  const bp = c.createBiquadFilter();
  bp.type = "lowpass";
  bp.frequency.value = 400;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.3, c.currentTime);
  ng.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.4);
  n.connect(bp).connect(ng);
  send(ng, 0.9);
  n.start();
  n.stop(c.currentTime + 1.5);
}

/** Old timber / haunted door creak. */
export function doorCreak(level = 0.5) {
  const c = sfx();
  if (!c) return;
  const o = c.createOscillator();
  o.type = "sawtooth";
  const t = c.currentTime;
  o.frequency.setValueAtTime(88, t);
  o.frequency.linearRampToValueAtTime(196, t + 1.1);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900;
  bp.Q.value = 9;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.1 * level, t + 0.2);
  g.gain.linearRampToValueAtTime(0.0001, t + 1.2);
  // Rasp: amplitude wobble makes the wood "stick".
  const wob = c.createOscillator();
  wob.frequency.value = 21;
  const wobG = c.createGain();
  wobG.gain.value = 0.05 * level;
  wob.connect(wobG).connect(g.gain);
  o.connect(bp).connect(g);
  send(g, 0.7);
  o.start();
  wob.start();
  o.stop(t + 1.25);
  wob.stop(t + 1.25);
}

export const hauntedCreak = doorCreak;

/** Slow minor celesta motif — the Vault's musical signature. */
export function scoreMotif() {
  const c = sfx();
  if (!c) return;
  const notes = [587.33, 698.46, 880, 1046.5, 880];
  notes.forEach((f, i) => {
    const t = c.currentTime + i * 0.55;
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const o2 = c.createOscillator();
    o2.type = "triangle";
    o2.frequency.value = f * 2.01;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.075, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
    const g2 = c.createGain();
    g2.gain.value = 0.3;
    o.connect(g);
    o2.connect(g2).connect(g);
    send(g, 1);
    o.start(t);
    o2.start(t);
    o.stop(t + 1.7);
    o2.stop(t + 1.7);
  });
}

/** Bright magical shimmer — crystal chime. */
export function crystalChime() {
  const c = sfx();
  if (!c) return;
  [1318.5, 1760, 2349, 2637].forEach((f, i) => {
    const t = c.currentTime + i * 0.055;
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.1, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    o.connect(g);
    send(g, 1);
    o.start(t);
    o.stop(t + 1.6);
  });
}

export const magicSparkle = crystalChime;

/** Rising magical spell — used for casting and card selection. */
export function spellCast() {
  const c = sfx();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(180, t);
  o.frequency.exponentialRampToValueAtTime(1800, t + 0.9);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.16, t + 0.25);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(400, t);
  bp.frequency.exponentialRampToValueAtTime(4200, t + 0.9);
  bp.Q.value = 4;
  o.connect(bp).connect(g);
  send(g, 1);
  o.start(t);
  o.stop(t + 1.2);

  const shimmer = c.createBufferSource();
  shimmer.buffer = noiseBuffer(c, 1.2);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2600;
  const sg = c.createGain();
  sg.gain.setValueAtTime(0.0001, t);
  sg.gain.exponentialRampToValueAtTime(0.08, t + 0.5);
  sg.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
  shimmer.connect(hp).connect(sg);
  send(sg, 1);
  shimmer.start(t);
  shimmer.stop(t + 1.2);
}

/** Warm pumpkin-magic tap for buttons. */
export function pumpkinPop() {
  const c = sfx();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(440, t);
  o.frequency.exponentialRampToValueAtTime(1100, t + 0.09);
  const g = c.createGain();
  g.gain.setValueAtTime(0.09, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
  o.connect(g);
  send(g, 0.6);
  o.start(t);
  o.stop(t + 0.3);
}

export const spookClick = pumpkinPop;

/**
 * The witch laugh — a cackling formant sweep. Playful but eerie.
 * `big` gives the giant jack-o'-lantern version.
 */
export function witchLaugh(big = false) {
  const c = sfx();
  if (!c) return;
  duck(big ? 3 : 1.8);
  const base = big ? 150 : 300;
  const beats = big ? 9 : 7;
  for (let i = 0; i < beats; i++) {
    const t = c.currentTime + i * (big ? 0.19 : 0.14);
    const o = c.createOscillator();
    o.type = "sawtooth";
    const f = base + Math.sin(i * 1.7) * base * 0.18 - i * (big ? 4 : 8);
    o.frequency.setValueAtTime(f * 1.25, t);
    o.frequency.exponentialRampToValueAtTime(f * 0.82, t + 0.12);

    // Two vocal formants turn the buzz into a voice.
    const f1 = c.createBiquadFilter();
    f1.type = "bandpass";
    f1.frequency.value = big ? 520 : 780;
    f1.Q.value = 7;
    const f2 = c.createBiquadFilter();
    f2.type = "bandpass";
    f2.frequency.value = big ? 1180 : 1650;
    f2.Q.value = 9;

    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(big ? 0.3 : 0.17, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + (big ? 0.2 : 0.14));

    o.connect(f1).connect(g);
    o.connect(f2).connect(g);
    send(g, 1);
    o.start(t);
    o.stop(t + 0.25);
  }
}

export const pumpkinLaugh = () => witchLaugh(true);

/** Tension drum roll for the Oracle. */
export function drumRoll(seconds = 2.2) {
  const c = sfx();
  if (!c) return;
  duck(seconds + 1);
  const t0 = c.currentTime;
  let t = t0;
  let step = 0.1;
  while (t < t0 + seconds) {
    const n = c.createBufferSource();
    n.buffer = noiseBuffer(c, 0.12);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 240;
    const g = c.createGain();
    const amt = 0.05 + 0.16 * ((t - t0) / seconds);
    g.gain.setValueAtTime(amt, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    n.connect(lp).connect(g);
    send(g, 0.4);
    n.start(t);
    n.stop(t + 0.12);
    t += step;
    step = Math.max(0.028, step * 0.9);
  }
}

/** Big magical reveal — chord bloom + shimmer. */
export function magicReveal() {
  const c = sfx();
  if (!c) return;
  duck(3);
  [261.63, 311.13, 392, 523.25, 622.25].forEach((f, i) => {
    const t = c.currentTime + i * 0.06;
    const o = c.createOscillator();
    o.type = "triangle";
    o.frequency.value = f;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.15);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    o.connect(g);
    send(g, 1);
    o.start(t);
    o.stop(t + 2.5);
  });
  window.setTimeout(() => crystalChime(), 220);
}

/* ------------------------------------------------------------------ */
/* Haunted-house rebuild intro sound design                            */
/* ------------------------------------------------------------------ */

/**
 * Try to start the ambience without a gesture. If the browser blocks it,
 * arm one-time listeners so audio fades in the moment the user interacts.
 */
export function tryAutoStartAmbience() {
  if (typeof window === "undefined") return;
  const attempt = () => {
    startAmbience();
    return ctx?.state === "running";
  };
  if (attempt()) return;
  const events = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
  const onGesture = () => {
    events.forEach((e) => window.removeEventListener(e, onGesture));
    startAmbience();
  };
  events.forEach((e) => window.addEventListener(e, onGesture, { once: true, passive: true }));
}

/** Long reversed magical swell — a piece of the house flying home. */
export function reverseWhoosh(seconds = 0.9, level = 0.5) {
  const c = sfx();
  if (!c) return;
  const t = c.currentTime;
  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, seconds + 0.2);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.4;
  bp.frequency.setValueAtTime(220, t);
  bp.frequency.exponentialRampToValueAtTime(2600, t + seconds);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.09 * level, t + seconds * 0.92);
  g.gain.exponentialRampToValueAtTime(0.0001, t + seconds + 0.12);
  n.connect(bp).connect(g);
  send(g, 0.9);
  n.start(t);
  n.stop(t + seconds + 0.2);
}

/** Dry supernatural thunk as a timber locks into place. */
export function woodLock(level = 0.5) {
  const c = sfx();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "triangle";
  o.frequency.setValueAtTime(190 + Math.random() * 60, t);
  o.frequency.exponentialRampToValueAtTime(58, t + 0.16);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22 * level, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
  o.connect(g);
  send(g, 0.5);
  o.start(t);
  o.stop(t + 0.32);

  const n = c.createBufferSource();
  n.buffer = noiseBuffer(c, 0.3);
  const hp = c.createBiquadFilter();
  hp.type = "bandpass";
  hp.frequency.value = 1500 + Math.random() * 900;
  hp.Q.value = 2;
  const ng = c.createGain();
  ng.gain.setValueAtTime(0.08 * level, t);
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
  n.connect(hp).connect(ng);
  send(ng, 0.8);
  n.start(t);
  n.stop(t + 0.3);
}

/** Rusted chains swinging in the dark. */
export function chainRattle(level = 0.4) {
  const c = sfx();
  if (!c) return;
  const t0 = c.currentTime;
  for (let i = 0; i < 9; i++) {
    const t = t0 + i * (0.05 + Math.random() * 0.07);
    const n = c.createBufferSource();
    n.buffer = noiseBuffer(c, 0.2);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2600 + Math.random() * 2600;
    bp.Q.value = 12;
    const g = c.createGain();
    g.gain.setValueAtTime(0.05 * level * (1 - i / 12), t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    n.connect(bp).connect(g);
    send(g, 1);
    n.start(t);
    n.stop(t + 0.16);
  }
}

/** Deep house groan — the structure waking up. */
export function houseGroan(level = 0.6) {
  const c = sfx();
  if (!c) return;
  const t = c.currentTime;
  const o = c.createOscillator();
  o.type = "sawtooth";
  o.frequency.setValueAtTime(52, t);
  o.frequency.linearRampToValueAtTime(41, t + 2.4);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 320;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(0.13 * level, t + 0.8);
  g.gain.linearRampToValueAtTime(0.0001, t + 2.6);
  const wob = c.createOscillator();
  wob.frequency.value = 5.5;
  const wobG = c.createGain();
  wobG.gain.value = 0.045 * level;
  wob.connect(wobG).connect(g.gain);
  o.connect(lp).connect(g);
  send(g, 0.9);
  o.start(t);
  wob.start(t);
  o.stop(t + 2.7);
  wob.stop(t + 2.7);
}

/** Windows igniting — slow supernatural bloom. */
export function emberIgnite() {
  const c = sfx();
  if (!c) return;
  const t = c.currentTime;
  [98, 147, 233, 311].forEach((f, i) => {
    const o = c.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(f * 0.7, t + i * 0.12);
    o.frequency.exponentialRampToValueAtTime(f, t + 1.6 + i * 0.12);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.1, t + 0.9 + i * 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
    o.connect(g);
    send(g, 1);
    o.start(t + i * 0.12);
    o.stop(t + 3.4);
  });
}
