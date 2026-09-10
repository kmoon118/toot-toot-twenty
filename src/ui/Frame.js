import { renderSprite } from './Sprite.js';

export function renderFrame({ size, packed, frameId = 1, speciesA, speciesB, onTapAnimal }) {
  const frame = document.createElement('div');
  frame.className = `frame size-${size}`;
  frame.setAttribute('role', 'group');
  const cells = size === 5 ? 5 : 10;
  const start = frameId === 2 ? 10 : 0;

  for (let i = 0; i < cells; i++) {
    const cellIndex = start + i;
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.cell = String(cellIndex);
    const animal = packed.find((p) => p.cell === cellIndex);
    if (animal) {
      const species = animal.species === 'A' ? speciesA : speciesB;
      const sprite = renderSprite(species);
      sprite.dataset.countIndex = String(cellIndex + 1);
      cell.appendChild(sprite);
      cell.addEventListener('pointerup', (e) => {
        e.stopPropagation();
        onTapAnimal?.(cellIndex + 1, species);
      });
    }
    frame.appendChild(cell);
  }
  return frame;
}

export function pulseCell(root, cellIndex) {
  const cell = root.querySelector(`[data-cell="${cellIndex}"]`);
  if (!cell) return;
  cell.classList.add('is-pulse');
  window.setTimeout(() => cell.classList.remove('is-pulse'), 280);
}
