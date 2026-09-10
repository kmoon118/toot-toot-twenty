import { generateTrip } from './problemGenerator.js';
import { nextHintLevel } from './hints.js';
import { tootsFor } from './scoring.js';

export const AUTO_COMBINE_MS = 4000;

export function currentProblem(session) {
  if (session.tripDone) return session.problems[5];
  return session.problems[session.problemIndex];
}

export function startTrip(routeId, mastery, seed) {
  const problems = generateTrip({
    routeId,
    mastery,
    seed,
    recentKeys: (mastery && mastery.recentKeys) || [],
  });
  const first = problems[0];
  const now = typeof seed === 'object' && seed && seed.now ? seed.now : Date.now();
  return {
    routeId,
    problemIndex: 0,
    problems,
    status: 'presenting',
    combined: false,
    hintLevel: 0,
    missesThisProblem: 0,
    toots: 0,
    rng: typeof seed === 'function' ? seed : null,
    autoCombineAt: first.requireCombine ? 0 : now + AUTO_COMBINE_MS,
    tripDone: false,
  };
}

export function applyCombine(session) {
  session.combined = true;
  session.status = 'awaitingAnswer';
  session.autoCombineAt = 0;
  return { combined: true };
}

export function applyAnswer(session, value) {
  if (!session.combined) {
    return {
      ignored: true,
      wiggle: true,
      correct: false,
      hintLevel: session.hintLevel,
      triesUntilCorrect: 0,
      tripDone: false,
    };
  }
  const problem = currentProblem(session);
  if (value !== problem.sum) {
    session.missesThisProblem += 1;
    session.hintLevel = nextHintLevel(session.missesThisProblem);
    session.status = `hint${session.hintLevel}`;
    return {
      ignored: false,
      wiggle: false,
      correct: false,
      hintLevel: session.hintLevel,
      triesUntilCorrect: 0,
      tripDone: false,
    };
  }
  const triesUntilCorrect = /** @type {1|2|3|4} */ (session.missesThisProblem + 1);
  session.toots += tootsFor(triesUntilCorrect);
  session.status = 'celebrating';
  if (session.problemIndex === 5) {
    session.tripDone = true;
    session.problemIndex = 6;
    return {
      ignored: false,
      wiggle: false,
      correct: true,
      hintLevel: session.hintLevel,
      triesUntilCorrect,
      tripDone: true,
    };
  }
  return {
    ignored: false,
    wiggle: false,
    correct: true,
    hintLevel: session.hintLevel,
    triesUntilCorrect,
    tripDone: false,
  };
}

export function advance(session, now) {
  session.problemIndex += 1;
  session.combined = false;
  session.hintLevel = 0;
  session.missesThisProblem = 0;
  session.status = 'presenting';
  session.tripDone = false;
  const next = session.problems[session.problemIndex];
  session.autoCombineAt = next && next.requireCombine ? 0 : now + AUTO_COMBINE_MS;
}
