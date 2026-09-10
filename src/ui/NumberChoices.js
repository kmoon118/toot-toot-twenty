import { isTap, onActivate, pointFrom } from '../app/input/pointer.js';

export function renderNumberChoices({ choices, strip, disabled, halo, dimmed, onChoose, onDisabledTap }) {
  const wrap = document.createElement('div');
  wrap.className = strip ? 'answers strip' : 'answers';
  const nums = strip ? [...Array(21).keys()] : choices;
  for (const n of nums) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice';
    btn.textContent = String(n);
    btn.setAttribute('aria-label', String(n));
    btn.dataset.value = String(n);
    const locked = disabled || (halo != null && n !== halo);
    if (locked) {
      btn.setAttribute('aria-disabled', 'true');
      btn.classList.add('is-locked-choice');
    }
    if (halo === n) btn.classList.add('is-halo');
    if (dimmed && dimmed.has(n)) btn.classList.add('is-wrong');
    let start = null;
    btn.addEventListener('pointerdown', (e) => {
      start = pointFrom(e);
    });
    onActivate(btn, (e) => {
      if (start && e && e.clientX != null && !isTap(start, pointFrom(e))) return;
      if (btn.getAttribute('aria-disabled') === 'true') {
        onDisabledTap?.(n);
        return;
      }
      onChoose?.(n, btn);
    });
    wrap.appendChild(btn);
  }
  return wrap;
}
