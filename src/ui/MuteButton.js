import { onActivate } from '../app/input/pointer.js';

export function renderMuteButton({ muted, onToggle }) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'chrome-btn';
  btn.setAttribute('aria-label', muted ? 'Unmute sound' : 'Mute sound');
  btn.textContent = muted ? '🔇' : '🔊';
  onActivate(btn, () => onToggle?.());
  return btn;
}
