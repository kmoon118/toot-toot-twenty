import { describe, expect, it } from 'vitest';
import { COLLECTIBLES, awardCollectible, idAt } from '../src/game/collectibles.js';

describe('collectibles', () => {
  it('unlockOrder 0..23 unique, no hats', () => {
    expect(COLLECTIBLES).toHaveLength(24);
    const ids = COLLECTIBLES.map((c) => c.id);
    expect(new Set(ids).size).toBe(24);
    expect(ids.some((id) => id.includes('hat'))).toBe(false);
    COLLECTIBLES.forEach((c, i) => expect(c.unlockOrder).toBe(i));
  });

  it('idAt(24) is engine-red overlay', () => {
    expect(idAt(24)).toBe('engine-red');
    expect(idAt(25)).toBe('engine-yellow');
  });

  it('after 30 awards unlockedIds stays unique length 24', () => {
    const collection = { unlockedIds: [], nextIndex: 0 };
    for (let i = 0; i < 30; i++) awardCollectible(collection);
    expect(collection.unlockedIds).toHaveLength(24);
    expect(new Set(collection.unlockedIds).size).toBe(24);
    expect(collection.nextIndex).toBe(30);
  });
});
