export function pointFrom(event) {
  return { x: event.clientX, y: event.clientY };
}

export function isTap(start, end, max = 24) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.hypot(dx, dy) < max;
}

/** Fire once for pointerup or click so iPad and desktop both work. */
export function onActivate(el, handler) {
  let last = 0;
  const go = (event) => {
    if (event && event.button != null && event.button !== 0) return;
    const now = Date.now();
    if (now - last < 400) return;
    last = now;
    handler(event);
  };
  el.addEventListener('pointerup', go);
  el.addEventListener('click', go);
}

export function desktopCheatsEnabled() {
  try {
    return (
      matchMedia('(pointer: fine)').matches &&
      (navigator.maxTouchPoints === 0 || navigator.maxTouchPoints == null)
    );
  } catch {
    return false;
  }
}
