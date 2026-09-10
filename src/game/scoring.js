export function tootsFor(triesUntilCorrect) {
  if (triesUntilCorrect === 1) return 2;
  if (triesUntilCorrect === 2) return 1;
  return 0;
}

export function starsFor(toots) {
  return Math.min(3, Math.floor(toots / 4));
}
