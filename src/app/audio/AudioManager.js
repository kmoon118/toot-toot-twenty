import { AUTO_COUNT_MS, AUTO_COUNT_REDUCED_MS, SPEAK_SUM_MS } from '../../game/hints.js';

export function createAudioManager({ getSettings, getReduceMotion, captionEl }) {
  const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
  let ctx = Ctx ? new Ctx() : null;
  let unlocked = false;
  let lastCaption = 0;
  let master = null;

  function ensureMaster() {
    if (!ctx || master) return master;
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);
    return master;
  }

  async function resume() {
    if (!ctx) return;
    if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
      try {
        await ctx.resume();
      } catch {
        /* ignore */
      }
    }
  }

  async function unlock() {
    if (!ctx) return;
    await resume();
    try {
      const buffer = ctx.createBuffer(1, 1, 22050);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.connect(ctx.destination);
      src.start(0);
      unlocked = true;
      ensureMaster();
    } catch {
      unlocked = true;
    }
  }

  function live() {
    const settings = getSettings();
    return Boolean(ctx && unlocked && !settings.muted);
  }

  function tone({ freq, dur, type = 'sine', peak = 0.08, t = 0, slide = 0, attack = 0.012, filter }) {
    if (!live()) return;
    const dest = ensureMaster();
    const now = ctx.currentTime + t;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), now + dur);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.setValueAtTime(filter, now);
      osc.connect(f);
      f.connect(g);
    } else {
      osc.connect(g);
    }
    g.connect(dest);
    osc.start(now);
    osc.stop(now + dur + 0.03);
  }

  function noiseBurst({ dur = 0.18, peak = 0.04, t = 0, hp = 1200, lp = 8000 }) {
    if (!live()) return;
    const dest = ensureMaster();
    const now = ctx.currentTime + t;
    const n = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < n; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const hpF = ctx.createBiquadFilter();
    hpF.type = 'highpass';
    hpF.frequency.value = hp;
    const lpF = ctx.createBiquadFilter();
    lpF.type = 'lowpass';
    lpF.frequency.value = lp;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    src.connect(hpF);
    hpF.connect(lpF);
    lpF.connect(g);
    g.connect(dest);
    src.start(now);
    src.stop(now + dur + 0.02);
  }

  function whistle(start, dur, peak = 0.07) {
    tone({ freq: start, dur, type: 'square', peak, filter: 1800 });
    tone({ freq: start * 1.5, dur, type: 'triangle', peak: peak * 0.45, filter: 2400 });
  }

  const sfx = {
    tap: () => {
      tone({ freq: 760, dur: 0.07, type: 'triangle', peak: 0.05 });
      tone({ freq: 1140, dur: 0.05, type: 'sine', peak: 0.03 });
    },
    'couple-clank': () => {
      noiseBurst({ dur: 0.12, peak: 0.05, hp: 200, lp: 1400 });
      tone({ freq: 180, dur: 0.16, type: 'square', peak: 0.06, filter: 700 });
      tone({ freq: 90, dur: 0.2, type: 'sine', peak: 0.05 });
    },
    'toot-short': () => {
      whistle(392, 0.22, 0.08);
      tone({ freq: 392, dur: 0.22, type: 'sawtooth', peak: 0.03, filter: 900 });
    },
    'toot-long': () => {
      whistle(330, 0.28, 0.07);
      whistle(392, 0.38, 0.07);
      tone({ freq: 330, dur: 0.18, type: 'square', peak: 0.05, t: 0.32, filter: 1200 });
    },
    cheer: () => {
      const notes = [523, 659, 784, 1046];
      notes.forEach((f, i) => {
        tone({ freq: f, dur: 0.16 + i * 0.02, type: 'triangle', peak: 0.07, t: i * 0.09 });
        tone({ freq: f * 2, dur: 0.1, type: 'sine', peak: 0.025, t: i * 0.09 });
      });
      tone({ freq: 523, dur: 0.35, type: 'sine', peak: 0.04, t: 0.36 });
      tone({ freq: 659, dur: 0.35, type: 'sine', peak: 0.04, t: 0.36 });
      tone({ freq: 784, dur: 0.42, type: 'triangle', peak: 0.05, t: 0.36 });
      noiseBurst({ dur: 0.22, peak: 0.035, t: 0.05, hp: 2500, lp: 9000 });
      whistle(440, 0.2, 0.055);
    },
    sparkle: () => {
      [1320, 1560, 1880, 2200].forEach((f, i) => {
        tone({ freq: f, dur: 0.09, type: 'sine', peak: 0.035, t: i * 0.04 });
      });
      noiseBurst({ dur: 0.16, peak: 0.03, hp: 3000, lp: 10000 });
    },
    nudge: () => {
      tone({ freq: 220, dur: 0.14, type: 'sine', peak: 0.05, slide: -40 });
    },
    'pop-sticker': () => {
      tone({ freq: 880, dur: 0.1, type: 'triangle', peak: 0.05 });
      tone({ freq: 1320, dur: 0.08, type: 'sine', peak: 0.03, t: 0.04 });
    },
    'ticket-punch': () => {
      tone({ freq: 640, dur: 0.08, type: 'square', peak: 0.045, filter: 1600 });
      noiseBurst({ dur: 0.06, peak: 0.03, hp: 800, lp: 3000 });
    },
    'whoosh-enter': () => {
      tone({ freq: 280, dur: 0.22, type: 'sine', peak: 0.04, slide: 160 });
      noiseBurst({ dur: 0.2, peak: 0.025, hp: 400, lp: 2200 });
    },
  };

  function playSfx(id) {
    sfx[id]?.();
  }

  function captionDurationMs(kind = 'count') {
    if (kind === 'sum') return SPEAK_SUM_MS;
    return getReduceMotion() ? AUTO_COUNT_REDUCED_MS : AUTO_COUNT_MS;
  }

  function showCaption(n, ms) {
    if (!captionEl) return;
    captionEl.textContent = String(n);
    captionEl.classList.add('is-on');
    lastCaption += 1;
    const token = lastCaption;
    window.setTimeout(() => {
      if (token === lastCaption) captionEl.classList.remove('is-on');
    }, ms);
  }

  function speakNumber(n, kind = 'count') {
    const settings = getSettings();
    const ms = captionDurationMs(kind);
    if (kind !== 'sum') showCaption(n, ms);
    if (settings.muted || settings.voice === false) return;
    const freq = 280 + Math.max(0, n) * 18;
    tone({ freq, dur: Math.min(0.28, ms / 1000), type: 'sine', peak: 0.07 });
    if (kind === 'sum') {
      tone({ freq: freq * 1.25, dur: 0.18, type: 'triangle', peak: 0.04, t: 0.08 });
    }
  }

  function speakTryAgain() {
    const settings = getSettings();
    if (settings.muted) return;
    tone({ freq: 196, dur: 0.16, type: 'sine', peak: 0.06 });
    tone({ freq: 174, dur: 0.2, type: 'sine', peak: 0.06, t: 0.14 });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') resume();
  });

  return {
    unlock,
    resume,
    playSfx,
    speakNumber,
    speakTryAgain,
    captionDurationMs,
    setMuted() {},
  };
}
