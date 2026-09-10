export const AUTO_COUNT_MS = 420;
export const AUTO_COUNT_REDUCED_MS = 280;
export const SPEAK_SUM_MS = 500;
export const ANSWER_LOCK_MS = 450;
export const CELEBRATE_MS = 1800;
export const MAX_HINT = 3;

export function nextHintLevel(missesThisProblem) {
  return Math.min(MAX_HINT, missesThisProblem);
}
