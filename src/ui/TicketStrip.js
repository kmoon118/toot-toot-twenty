export function renderTicketStrip(punched) {
  const el = document.createElement('div');
  el.className = 'tickets';
  el.setAttribute('aria-label', `${punched} of 6`);
  for (let i = 0; i < 6; i++) {
    const t = document.createElement('span');
    t.className = `ticket${i < punched ? ' is-punched' : ''}`;
    el.appendChild(t);
  }
  return el;
}
