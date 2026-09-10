import { packAnimals } from '../../game/pack.js';
import { startTrip, applyCombine, applyAnswer, advance, currentProblem } from '../../game/session.js';
import { recordCorrect } from '../storage/save.js';
import { useStrip } from '../layoutMode.js';
import { features } from '../features.js';
import { renderMuteButton } from '../../ui/MuteButton.js';
import { renderFrame, pulseCell } from '../../ui/Frame.js';
import { renderNumberChoices } from '../../ui/NumberChoices.js';
import { ANSWER_LOCK_MS, AUTO_COUNT_MS, AUTO_COUNT_REDUCED_MS } from '../../game/hints.js';
import { onActivate } from '../input/pointer.js';
import { renderJourney, setJourneyProgress } from '../../ui/Journey.js';

const CHUG_MS = 800;

export function renderTripScreen(root, ctx, params) {
  const routeId = params.routeId || 1;
  const session = startTrip(routeId, ctx.save.mastery, Date.now());
  applyCombine(session);
  let lockUntil = 0;
  let dimmed = new Set();
  let counting = false;
  let counted = new Set();
  let journeyEl = null;
  let problemHost = null;
  let eqEl = null;
  let muteHost = null;

  function progress() {
    if (session.tripDone) return 6;
    if (session.status === 'celebrating') return Math.min(6, session.problemIndex + 1);
    return session.problemIndex;
  }

  function persistCorrect(result) {
    recordCorrect(ctx.save, {
      routeId: session.routeId,
      factKey: currentProblem(session).factKey,
      triesUntilCorrect: result.triesUntilCorrect,
      wrongEvents: session.missesThisProblem,
      now: Date.now(),
      tripFinished: result.tripDone,
    });
  }

  function goMap() {
    ctx.show('map');
  }

  function confirmHome() {
    if (session.tripDone) {
      goMap();
      return;
    }
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div>Leave this trip?</div>`;
    const stay = document.createElement('button');
    stay.className = 'big-btn green';
    stay.textContent = 'Keep playing';
    onActivate(stay, () => overlay.remove());
    const leave = document.createElement('button');
    leave.className = 'big-btn amber';
    leave.textContent = 'Go to map';
    onActivate(leave, goMap);
    card.append(stay, leave);
    overlay.appendChild(card);
    root.querySelector('.screen').appendChild(overlay);
  }

  async function autoCount(problem) {
    counting = true;
    const packed = packAnimals(problem.a, problem.b);
    const ms = ctx.reduceMotion() ? AUTO_COUNT_REDUCED_MS : AUTO_COUNT_MS;
    for (const animal of packed) {
      pulseCell(problemHost, animal.cell);
      ctx.audio.speakNumber(animal.cell + 1, 'count');
      await new Promise((r) => window.setTimeout(r, ms));
    }
    counting = false;
  }

  function youWin() {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div style="font-size:40px">🚉</div>
      <div>The train is here!</div>
      <div>You win</div>`;
    const again = document.createElement('button');
    again.className = 'big-btn green';
    again.textContent = 'Another trip';
    onActivate(again, () => ctx.show('trip', { routeId: session.routeId }));
    const mapBtn = document.createElement('button');
    mapBtn.className = 'big-btn';
    mapBtn.textContent = 'Map';
    onActivate(mapBtn, goMap);
    card.append(again, mapBtn);
    overlay.appendChild(card);
    root.querySelector('.screen').appendChild(overlay);
  }

  async function onChoose(n) {
    if (Date.now() < lockUntil || counting) return;
    lockUntil = Date.now() + ANSWER_LOCK_MS;
    const result = applyAnswer(session, n);
    if (result.ignored) {
      ctx.audio.playSfx('nudge');
      return;
    }
    if (!result.correct) {
      dimmed.add(n);
      ctx.audio.playSfx('nudge');
      if (result.hintLevel === 1) ctx.audio.speakTryAgain();
      paintProblem();
      if (result.hintLevel === 2) await autoCount(currentProblem(session));
      return;
    }
    persistCorrect(result);
    ctx.audio.playSfx('toot-short');
    ctx.audio.speakNumber(currentProblem(session).sum, 'sum');
    setJourneyProgress(journeyEl, progress());
    paintProblem();
    const wait = ctx.reduceMotion() ? 350 : Math.max(CHUG_MS, 600);
    window.setTimeout(() => {
      if (result.tripDone) {
        ctx.audio.playSfx('cheer');
        youWin();
        return;
      }
      advance(session, Date.now());
      applyCombine(session);
      dimmed = new Set();
      counted = new Set();
      paintProblem();
    }, wait);
  }

  function ensureShell() {
    if (problemHost) return;
    const layout = document.documentElement.dataset.layout || 'wide';
    if (layout === 'unsupported') {
      root.innerHTML = `<div class="shell"><div class="unsupported-card">Turn the iPad<br/>or use full screen</div></div>`;
      return;
    }
    root.innerHTML = '';
    const screen = document.createElement('div');
    screen.className = 'screen';
    screen.innerHTML = `<div class="sky"></div><div class="sun" aria-hidden="true"></div><div class="hill hill-left"></div><div class="hill hill-right"></div>`;

    const chrome = document.createElement('div');
    chrome.className = 'chrome';
    muteHost = document.createElement('div');
    chrome.appendChild(muteHost);
    const spacer = document.createElement('div');
    chrome.appendChild(spacer);
    const home = document.createElement('button');
    home.className = 'chrome-btn';
    home.setAttribute('aria-label', 'Home');
    home.textContent = '⌂';
    onActivate(home, confirmHome);
    chrome.appendChild(home);

    eqEl = document.createElement('div');
    eqEl.className = 'equation';

    const stage = document.createElement('div');
    stage.className = 'trip-stage';
    problemHost = document.createElement('div');
    problemHost.className = 'trip-problem';
    problemHost.style.cssText = 'display:flex;flex-direction:column;flex:1;min-height:0;';
    stage.appendChild(problemHost);

    journeyEl = renderJourney({ progress: 0 });

    screen.append(chrome, eqEl, stage, journeyEl);
    root.appendChild(screen);
  }

  function paintProblem() {
    ensureShell();
    if (!problemHost) return;
    const problem = currentProblem(session);
    muteHost.replaceChildren(
      renderMuteButton({
        muted: ctx.save.settings.muted,
        onToggle: () => {
          ctx.toggleMute();
          paintProblem();
        },
      }),
    );
    eqEl.textContent = `${problem.a} + ${problem.b} = ?`;

    const strip = useStrip(problem, ctx.save.mastery, features, {
      width: window.innerWidth,
      height: window.innerHeight,
      layout: document.documentElement.dataset.layout || 'wide',
    });
    const packed = packAnimals(problem.a, problem.b);
    problemHost.innerHTML = '';
    const row = document.createElement('div');
    row.className = 'frame-row';
    const frames = problem.frameCount === 2 ? [1, 2] : [1];
    for (const id of frames) {
      row.appendChild(
        renderFrame({
          size: problem.frameSize,
          packed,
          frameId: id,
          speciesA: problem.speciesA,
          speciesB: problem.speciesB,
          onTapAnimal: (idx) => {
            counted.add(idx);
            ctx.audio.speakNumber(idx, 'count');
          },
        }),
      );
    }
    problemHost.appendChild(row);
    const halo = session.hintLevel >= 3 ? problem.sum : null;
    problemHost.appendChild(
      renderNumberChoices({
        choices: problem.choices,
        strip,
        disabled: session.status === 'celebrating',
        halo,
        dimmed,
        onChoose,
        onDisabledTap: () => ctx.audio.playSfx('nudge'),
      }),
    );
    setJourneyProgress(journeyEl, progress());
  }

  paintProblem();
  const onResize = () => {
    const step = progress();
    problemHost = null;
    journeyEl = null;
    paintProblem();
    setJourneyProgress(journeyEl, step, { instant: true });
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}
