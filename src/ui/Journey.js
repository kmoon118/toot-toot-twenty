const STOPS = 6;

function trainMarkup() {
  return `<svg class="journey-train-svg" viewBox="0 0 140 70" aria-hidden="true">
    <rect x="54" y="22" width="52" height="28" rx="6" fill="#F4A6C3" stroke="#2B2B2B" stroke-width="3"/>
    <circle cx="68" cy="54" r="8" fill="#2B2B2B"/>
    <circle cx="92" cy="54" r="8" fill="#2B2B2B"/>
    <circle cx="68" cy="54" r="3" fill="#F5C542"/>
    <circle cx="92" cy="54" r="3" fill="#F5C542"/>
    <circle cx="80" cy="36" r="8" fill="#FFF6E5" stroke="#2B2B2B" stroke-width="2"/>
    <rect x="4" y="24" width="56" height="26" rx="7" fill="#E85D4C" stroke="#2B2B2B" stroke-width="3"/>
    <rect x="32" y="8" width="26" height="20" rx="5" fill="#FFF6E5" stroke="#2B2B2B" stroke-width="3"/>
    <rect x="2" y="18" width="12" height="8" rx="3" fill="#6B6B6B"/>
    <circle cx="18" cy="54" r="9" fill="#2B2B2B"/>
    <circle cx="44" cy="54" r="9" fill="#2B2B2B"/>
    <circle cx="18" cy="54" r="3.5" fill="#F5C542"/>
    <circle cx="44" cy="54" r="3.5" fill="#F5C542"/>
  </svg>`;
}

function stationEl() {
  const wrap = document.createElement('div');
  wrap.className = 'journey-station';
  wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = `<div class="station-flag">🏁</div><div class="station-roof"></div><div class="station-body">🚉</div>`;
  return wrap;
}

export function renderJourney({ progress = 0 } = {}) {
  const el = document.createElement('div');
  el.className = 'journey';
  el.setAttribute('aria-label', 'Train to the station');
  const rail = document.createElement('div');
  rail.className = 'journey-rail';
  const stops = document.createElement('div');
  stops.className = 'journey-stops';
  for (let i = 0; i < STOPS; i++) {
    const d = document.createElement('span');
    d.className = 'journey-stop';
    stops.appendChild(d);
  }
  const train = document.createElement('div');
  train.className = 'journey-train';
  train.innerHTML = trainMarkup();
  el.append(rail, stops, stationEl(), train);

  function setProgress(n, { instant = false } = {}) {
    const step = Math.max(0, Math.min(STOPS, n));
    el.dataset.progress = String(step);
    const reduce = document.documentElement.classList.contains('reduce-motion');
    train.style.transition = instant || reduce ? 'none' : 'left 0.75s ease-in-out';
    train.style.left = `calc(${step / STOPS} * (100% - 210px))`;
    [...stops.children].forEach((d, i) => {
      d.classList.toggle('is-lit', i < step);
    });
    el.classList.toggle('is-arrived', step >= STOPS);
  }

  el._setProgress = setProgress;
  requestAnimationFrame(() => setProgress(progress, { instant: true }));
  return el;
}

export function setJourneyProgress(el, n, opts) {
  el?._setProgress?.(n, opts);
}
