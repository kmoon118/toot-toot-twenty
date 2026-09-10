import { onActivate } from '../app/input/pointer.js';

export function renderCoupleLever({ onCouple, pulse }) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `lever${pulse ? ' is-pulse' : ''}`;
  btn.setAttribute('aria-label', 'Couple trains');
  btn.innerHTML = `<span class="handle"></span><span>Couple</span>`;
  onActivate(btn, () => onCouple?.());
  return btn;
}

export function wiggleLever(btn) {
  btn.classList.add('is-wiggle');
  window.setTimeout(() => btn.classList.remove('is-wiggle'), 400);
}
