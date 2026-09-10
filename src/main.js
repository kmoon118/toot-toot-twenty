import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import { boot } from './app/App.js';

function syncAppHeight() {
  const vv = window.visualViewport;
  const h = vv ? vv.height : window.innerHeight;
  const t = vv ? vv.offsetTop : 0;
  const root = document.documentElement;
  root.style.setProperty('--app-height', `${h}px`);
  root.style.setProperty('--app-top', `${t}px`);
}

syncAppHeight();
window.addEventListener('resize', syncAppHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', syncAppHeight);
  window.visualViewport.addEventListener('scroll', syncAppHeight);
}

document.addEventListener(
  'touchmove',
  (e) => {
    if (e.touches && e.touches.length > 1) e.preventDefault();
  },
  { passive: false },
);

boot(document.getElementById('app'));
