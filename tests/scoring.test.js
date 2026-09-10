import { describe, expect, it } from 'vitest';
import { starsFor, tootsFor } from '../src/game/scoring.js';

describe('scoring', () => {
  it('toot bands', () => {
    expect(tootsFor(1)).toBe(2);
    expect(tootsFor(2)).toBe(1);
    expect(tootsFor(3)).toBe(0);
    expect(tootsFor(4)).toBe(0);
  });

  it('stars and parade always', () => {
    expect(starsFor(0)).toBe(0);
    expect(starsFor(3)).toBe(0);
    expect(starsFor(4)).toBe(1);
    expect(starsFor(8)).toBe(2);
    expect(starsFor(12)).toBe(3);
    expect(starsFor(99)).toBe(3);
  });
});
