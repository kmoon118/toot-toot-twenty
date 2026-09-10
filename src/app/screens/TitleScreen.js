import { renderMuteButton } from '../../ui/MuteButton.js';
import { onActivate } from '../input/pointer.js';
import { renderJourney } from '../../ui/Journey.js';

export function renderTitleScreen(root, ctx) {
  root.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.innerHTML = `
    <div class="sky"></div>
    <div class="sun" aria-hidden="true"></div>
    <div class="cloud" style="top:18%;left:8%;width:90px;height:36px"></div>
    <div class="cloud" style="top:24%;left:28%;width:70px;height:28px"></div>
    <div class="hill hill-left"></div>
    <div class="hill hill-right"></div>
  `;
  const chrome = document.createElement('div');
  chrome.className = 'chrome';
  chrome.appendChild(
    renderMuteButton({
      muted: ctx.save.settings.muted,
      onToggle: () => ctx.toggleMute(),
    }),
  );
  const spacer = document.createElement('div');
  chrome.appendChild(spacer);
  const gear = document.createElement('button');
  gear.className = 'chrome-btn';
  gear.setAttribute('aria-label', 'Settings');
  gear.textContent = '⚙️';
  onActivate(gear, () => ctx.show('settings', { from: 'title' }));
  chrome.appendChild(gear);

  const main = document.createElement('div');
  main.className = 'title-main';
  const h1 = document.createElement('h1');
  h1.className = 'wordmark';
  h1.textContent = 'Toot-Toot Twenty';
  const play = document.createElement('button');
  play.type = 'button';
  play.className = 'play-engine';
  play.setAttribute('aria-label', 'Tap to play');
  play.innerHTML = `<span class="cab"></span><span>Tap to play</span>`;
  onActivate(play, () => {
    ctx.audio.unlock().catch(() => {});
    ctx.audio.playSfx('toot-short');
    ctx.show('map');
  });
  const hint = document.createElement('div');
  hint.className = 'hint-line';
  hint.textContent = 'Sunny Station';
  const shed = document.createElement('button');
  shed.className = 'chrome-btn';
  shed.setAttribute('aria-label', 'Engine Shed');
  shed.textContent = '🏠';
  onActivate(shed, () => ctx.show('shed'));
  main.append(h1, play, hint, shed);

  screen.append(chrome, main, renderJourney({ progress: 0 }));
  root.appendChild(screen);
}
