import { describe, expect, it } from 'vitest';
import { packAnimals, makeTenFields } from '../src/game/pack.js';

describe('packAnimals', () => {
  const fixtures = [
    [5, 8],
    [8, 5],
    [1, 14],
    [14, 1],
    [16, 4],
    [11, 9],
    [10, 5],
    [3, 2],
  ];

  for (const [a, b] of fixtures) {
    it(`packs ${a}+${b} without overflowing a tray`, () => {
      const packed = packAnimals(a, b);
      expect(packed).toHaveLength(a + b);
      const cells = packed.map((p) => p.cell);
      expect(new Set(cells).size).toBe(a + b);
      expect(Math.max(...cells, -1)).toBeLessThan(a + b);
      expect(packed.filter((p) => p.species === 'A').every((p, i) => p.cell === i)).toBe(true);
      packed.filter((p) => p.species === 'B').forEach((p, i) => {
        expect(p.cell).toBe(a + i);
      });
      for (const p of packed) {
        expect(p.frame).toBe(p.cell < 10 ? 1 : 2);
      }
      const f1 = packed.filter((p) => p.frame === 1).length;
      const f2 = packed.filter((p) => p.frame === 2).length;
      expect(f1).toBeLessThanOrEqual(10);
      expect(f2).toBeLessThanOrEqual(10);
    });
  }
});

describe('makeTenFields', () => {
  it('splits only when a < 10 and sum > 10', () => {
    expect(makeTenFields(5, 8)).toEqual({ makeTenSplit: true, splitIntoFirst: 5 });
    expect(makeTenFields(8, 5)).toEqual({ makeTenSplit: true, splitIntoFirst: 2 });
    expect(makeTenFields(1, 14)).toEqual({ makeTenSplit: true, splitIntoFirst: 9 });
    expect(makeTenFields(14, 1)).toEqual({ makeTenSplit: false, splitIntoFirst: 0 });
    expect(makeTenFields(11, 9)).toEqual({ makeTenSplit: false, splitIntoFirst: 0 });
    expect(makeTenFields(10, 5)).toEqual({ makeTenSplit: false, splitIntoFirst: 0 });
    expect(makeTenFields(3, 2)).toEqual({ makeTenSplit: false, splitIntoFirst: 0 });
  });
});
