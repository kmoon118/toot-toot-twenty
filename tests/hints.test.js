import { describe, expect, it } from 'vitest';
import { MAX_HINT, nextHintLevel } from '../src/game/hints.js';

describe('hint ladder', () => {
  it('miss 1/2/3 map to hint levels', () => {
    expect(nextHintLevel(1)).toBe(1);
    expect(nextHintLevel(2)).toBe(2);
    expect(nextHintLevel(3)).toBe(3);
    expect(nextHintLevel(9)).toBe(MAX_HINT);
  });
});
