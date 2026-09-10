import { COLLECTIBLES, overlayStamp } from '../../game/collectibles.js';
import { starsFor } from '../../game/scoring.js';
import { engineSvg } from '../../ui/Sprite.js';
import { onActivate } from '../input/pointer.js';

export function renderParadeScreen(root, ctx, params) {
  const toots = params.toots || 0;
  const stars = starsFor(toots);
  const latest = ctx.save.collection.unlockedIds[ctx.save.collection.unlockedIds.length - 1];
  const item = COLLECTIBLES.find((c) => c.id === latest) || COLLECTIBLES[0];
  const stamp = overlayStamp(ctx.save.collection);

  root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `<div class="sky"></div><div class="sun"></div><div class="hill hill-left"></div><div class="hill hill-right"></div><div class="track"></div>`;

  const chrome = document.createElement('div');
  chrome.className = 'chrome';
  const skip = document.createElement('button');
  skip.className = 'chrome-btn';
  skip.textContent = '⏭';
  skip.setAttribute('aria-label', 'Skip');
  skip.disabled = true;
  window.setTimeout(() => {
    skip.disabled = false;
  }, 1500);
  const finish = () => ctx.show('map');
  onActivate(skip, () => {
    if (!skip.disabled) finish();
  });
  chrome.appendChild(skip);

  const track = document.createElement('div');
  track.className = 'parade-track';
  const train = document.createElement('div');
  train.className = 'parade-train';
  const engine = document.createElement('div');
  engine.className = 'car';
  engine.style.background = '#E85D4C';
  engine.innerHTML = engineSvg('#E85D4C');
  train.appendChild(engine);
  const car = document.createElement('div');
  car.className = 'car';
  car.style.background = item.color || '#F4A6C3';
  car.textContent = latest ? (item.kind === 'animal' ? '🐾' : '★') : '★';
  if (stamp) {
    const star = document.createElement('div');
    star.textContent = '⭐';
    car.appendChild(star);
  }
  train.appendChild(car);
  track.appendChild(train);

  const banner = document.createElement('div');
  banner.className = 'hint-line';
  banner.style.alignSelf = 'center';
  banner.style.zIndex = '3';
  banner.innerHTML = `All aboard! <span class="stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span>`;

  const again = document.createElement('div');
  again.style.cssText = 'display:flex;gap:16px;justify-content:center;padding:12px;z-index:3';
  const more = document.createElement('button');
  more.className = 'big-btn green';
  more.textContent = '🚂 Another trip';
  onActivate(more, () => ctx.show('trip', { routeId: params.routeId || 1 }));
  const bench = document.createElement('button');
  bench.className = 'big-btn';
  bench.textContent = '🗺️ Map';
  onActivate(bench, finish);
  again.append(more, bench);

  screen.append(chrome, banner, track, again);
  root.appendChild(screen);
  ctx.audio.playSfx('toot-long');

  if (ctx.reduceMotion()) {
    window.setTimeout(finish, 2500);
  }
}
