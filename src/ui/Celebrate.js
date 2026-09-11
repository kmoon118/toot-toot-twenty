const COLORS = ['#E85D4C', '#F5C542', '#4A90D9', '#F4A6C3', '#7ED957', '#9B6BD6', '#FFE566', '#FFFFFF'];

export function burstCelebrate(host, { reduced = false } = {}) {
  if (!host) return;
  host.querySelectorAll('.celebrate-layer').forEach((el) => el.remove());
  const layer = document.createElement('div');
  layer.className = 'celebrate-layer';
  layer.setAttribute('aria-hidden', 'true');
  if (reduced) {
    host.appendChild(layer);
    window.setTimeout(() => layer.remove(), 900);
    return;
  }
  for (let i = 0; i < 32; i++) {
    const bit = document.createElement('span');
    const star = i % 3 === 0;
    bit.className = star ? 'celebrate-bit is-star' : 'celebrate-bit';
    const angle = (Math.PI * 2 * i) / 32 + (i % 2) * 0.2;
    const dist = 90 + (i % 7) * 28;
    bit.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    bit.style.setProperty('--dy', `${Math.sin(angle) * dist - 40}px`);
    bit.style.setProperty('--rot', `${(i * 40) % 360}deg`);
    bit.style.setProperty('--delay', `${(i % 6) * 18}ms`);
    bit.style.background = COLORS[i % COLORS.length];
    layer.appendChild(bit);
  }
  host.appendChild(layer);
  window.setTimeout(() => layer.remove(), 1400);
}
