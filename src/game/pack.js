/**
 * Species A occupies cells 0..a-1; species B occupies a..a+b-1.
 * Frame 1 is cells 0..9; frame 2 is 10..19.
 * @param {number} a
 * @param {number} b
 */
export function packAnimals(a, b) {
  const out = [];
  for (let i = 0; i < a; i++) out.push({ species: 'A', cell: i, frame: i < 10 ? 1 : 2 });
  for (let i = 0; i < b; i++) {
    const cell = a + i;
    out.push({ species: 'B', cell, frame: cell < 10 ? 1 : 2 });
  }
  return out;
}

/** Make-ten is an animation on top of packing, not a second placement rule. */
export function makeTenFields(a, b) {
  const makeTenSplit = a < 10 && a + b > 10;
  return { makeTenSplit, splitIntoFirst: makeTenSplit ? 10 - a : 0 };
}
