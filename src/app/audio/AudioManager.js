import { AUTO_COUNT_MS, AUTO_COUNT_REDUCED_MS, SPEAK_SUM_MS } from '../../game/hints.js';

export function createAudioManager({ getSettings, getReduceMotion, captionEl }) {
  const Ctx = globalThis.AudioContext || globalThis.webkitAudioContext;
  let ctx = Ctx ? new Ctx() : null;
  let unlocked = false;
  let lastCaption = 0;

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
    } catch {
      unlocked = true;
    }
  }

  function beep(freq, dur, type = 'sine', gain = 0.08) {
    const settings = getSettings();
    if (!ctx || !unlocked || settings.muted) return;
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.value = gain;
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start();
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.stop(ctx.currentTime + dur);
    } catch {
      /* ignore */
    }
  }

  const sfx = {
    tap: () => beep(720, 0.08, 'triangle', 0.05),
    'couple-clank': () => beep(180, 0.16, 'square', 0.07),
    'toot-short': () => beep(420, 0.18, 'square', 0.07),
    'toot-long': () => beep(330, 0.35, 'square', 0.07),
    cheer: () => {
      beep(523, 0.12, 'triangle', 0.06);
      window.setTimeout(() => beep(659, 0.12, 'triangle', 0.06), 90);
      window.setTimeout(() => beep(784, 0.18, 'triangle', 0.06), 180);
    },
    nudge: () => beep(220, 0.12, 'sine', 0.05),
    'pop-sticker': () => beep(880, 0.1, 'triangle', 0.05),
    'ticket-punch': () => beep(640, 0.08, 'square', 0.05),
    'whoosh-enter': () => beep(260, 0.2, 'sine', 0.04),
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
    if (settings.muted || settings.voice === false) {
      showCaption(n, captionDurationMs(kind));
      return;
    }
    const ms = captionDurationMs(kind);
    showCaption(n, ms);
    const freq = 280 + Math.max(0, n) * 18;
    beep(freq, Math.min(0.28, ms / 1000), 'sine', 0.07);
  }

  function speakTryAgain() {
    const settings = getSettings();
    if (settings.muted) return;
    beep(196, 0.16, 'sine', 0.06);
    window.setTimeout(() => beep(174, 0.2, 'sine', 0.06), 140);
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
