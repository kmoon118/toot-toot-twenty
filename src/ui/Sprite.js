const PALETTES = {
  duck: { body: '#F5C542', accent: '#E85D4C', eye: '#2B2B2B', belly: '#FFF6E5' },
  bunny: { body: '#F4A6C3', accent: '#E85D4C', eye: '#2B2B2B', belly: '#FFF6E5' },
  puppy: { body: '#C9844A', accent: '#8B5A2B', eye: '#2B2B2B', belly: '#F3D5B0' },
  kitten: { body: '#F4A06A', accent: '#E85D4C', eye: '#2B2B2B', belly: '#FFF6E5' },
  bear: { body: '#8B5A2B', accent: '#5C3A1A', eye: '#2B2B2B', belly: '#D4A574' },
  frog: { body: '#6FBF73', accent: '#2E8B57', eye: '#2B2B2B', belly: '#C8F0B4' },
  fox: { body: '#E67A3A', accent: '#2B2B2B', eye: '#2B2B2B', belly: '#FFF6E5' },
  panda: { body: '#FFF6E5', accent: '#2B2B2B', eye: '#2B2B2B', belly: '#FFFFFF' },
  hedgehog: { body: '#C9844A', accent: '#5C3A1A', eye: '#2B2B2B', belly: '#F3D5B0' },
  owl: { body: '#8B5A2B', accent: '#F5C542', eye: '#2B2B2B', belly: '#F3D5B0' },
};

function animalSvg(species) {
  const p = PALETTES[species] || PALETTES.duck;
  const extra =
    species === 'bunny'
      ? `<ellipse cx="22" cy="10" rx="6" ry="14" fill="${p.body}" stroke="#2B2B2B" stroke-width="3"/>
         <ellipse cx="42" cy="10" rx="6" ry="14" fill="${p.body}" stroke="#2B2B2B" stroke-width="3"/>`
      : species === 'hedgehog'
        ? `<path d="M12 36 L20 18 L32 12 L44 18 L52 36" fill="${p.accent}" stroke="#2B2B2B" stroke-width="3" stroke-linejoin="round"/>`
        : species === 'owl'
          ? `<circle cx="24" cy="28" r="10" fill="${p.belly}" stroke="#2B2B2B" stroke-width="3"/>
             <circle cx="40" cy="28" r="10" fill="${p.belly}" stroke="#2B2B2B" stroke-width="3"/>`
          : '';
  const snout =
    species === 'duck'
      ? `<ellipse cx="48" cy="36" rx="10" ry="6" fill="${p.accent}" stroke="#2B2B2B" stroke-width="3"/>`
      : species === 'frog'
        ? `<ellipse cx="22" cy="18" rx="7" ry="6" fill="${p.body}" stroke="#2B2B2B" stroke-width="3"/><ellipse cx="42" cy="18" rx="7" ry="6" fill="${p.body}" stroke="#2B2B2B" stroke-width="3"/>`
        : '';
  const patches =
    species === 'panda'
      ? `<ellipse cx="22" cy="30" rx="8" ry="7" fill="${p.accent}"/><ellipse cx="42" cy="30" rx="8" ry="7" fill="${p.accent}"/>`
      : species === 'fox'
        ? `<polygon points="14,22 22,8 28,22" fill="${p.body}" stroke="#2B2B2B" stroke-width="3"/>
           <polygon points="36,22 42,8 50,22" fill="${p.body}" stroke="#2B2B2B" stroke-width="3"/>`
        : '';
  return `<svg viewBox="0 0 64 64" aria-hidden="true">
    ${extra}
    <ellipse cx="32" cy="38" rx="20" ry="18" fill="${p.body}" stroke="#2B2B2B" stroke-width="3"/>
    <ellipse cx="32" cy="44" rx="12" ry="9" fill="${p.belly}"/>
    ${patches}
    ${snout}
    <circle cx="24" cy="34" r="3.2" fill="${p.eye}"/>
    <circle cx="40" cy="34" r="3.2" fill="${p.eye}"/>
    <circle cx="25" cy="33" r="1" fill="#fff"/>
    <circle cx="41" cy="33" r="1" fill="#fff"/>
  </svg>`;
}

export function renderSprite(species, className = '') {
  const el = document.createElement('span');
  el.className = `sprite ${className}`.trim();
  el.dataset.species = species || '';
  el.innerHTML = species ? animalSvg(species) : '';
  return el;
}

export function engineSvg(color = '#E85D4C') {
  return `<svg viewBox="0 0 80 48" aria-hidden="true">
    <rect x="8" y="16" width="48" height="20" rx="6" fill="${color}" stroke="#2B2B2B" stroke-width="3"/>
    <rect x="36" y="6" width="22" height="16" rx="4" fill="#FFF6E5" stroke="#2B2B2B" stroke-width="3"/>
    <circle cx="22" cy="40" r="7" fill="#2B2B2B"/>
    <circle cx="48" cy="40" r="7" fill="#2B2B2B"/>
    <circle cx="22" cy="40" r="3" fill="#F5C542"/>
    <circle cx="48" cy="40" r="3" fill="#F5C542"/>
  </svg>`;
}
