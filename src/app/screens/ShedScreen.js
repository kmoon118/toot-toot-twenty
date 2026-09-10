import { COLLECTIBLES } from '../../game/collectibles.js';
import { renderSprite, engineSvg } from '../../ui/Sprite.js';
import { onActivate } from '../input/pointer.js';

export function renderShedScreen(root, ctx) {
  root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `<div class="sky"></div>`;
  const chrome = document.createElement('div');
  chrome.className = 'chrome';
  const title = document.createElement('div');
  title.className = 'hint-line';
  title.textContent = 'Engine Shed';
  chrome.appendChild(title);
  const close = document.createElement('button');
  close.className = 'chrome-btn';
  close.setAttribute('aria-label', 'Close');
  close.textContent = '✓';
  onActivate(close, () => ctx.close());
  chrome.appendChild(close);

  const row = document.createElement('div');
  row.className = 'shed';
  const unlocked = new Set(ctx.save.collection.unlockedIds);
  for (const item of COLLECTIBLES) {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = `shed-slot${unlocked.has(item.id) ? '' : ' is-locked'}`;
    if (!unlocked.has(item.id)) {
      slot.textContent = '•';
    } else if (item.kind === 'animal') {
      slot.appendChild(renderSprite(item.id));
    } else {
      slot.innerHTML = engineSvg(item.color || '#E85D4C');
    }
    onActivate(slot, () => {
      if (unlocked.has(item.id)) ctx.audio.playSfx('cheer');
    });
    row.appendChild(slot);
  }
  screen.append(chrome, row);
  root.appendChild(screen);
}
