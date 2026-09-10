import { renderSprite } from './Sprite.js';

export function renderGroup({ count, species, side }) {
  const el = document.createElement('div');
  el.className = `group group-${side}${count === 0 ? ' is-empty' : ''}`;
  el.dataset.side = side;
  if (count === 0) {
    el.setAttribute('aria-label', 'Nobody waiting');
    return el;
  }
  for (let i = 0; i < count; i++) {
    el.appendChild(renderSprite(species));
  }
  return el;
}
