/** Shared shape for every math mode. Parent wires Map/Trip/session to these ids. */

export const OP = {
  ADD: 'add',
  TAKEAWAY: 'takeaway',
  MISSING: 'missing',
  COMPARE: 'compare',
  BOND: 'bond',
};

export const MODE_ROUTES = {
  takeaway: 7,
  missing: 8,
  compare: 9,
  bond: 10,
  mixed: 11,
};

export const MODE_STATIONS = [
  { id: 7, op: OP.TAKEAWAY, name: 'Hop-Off Halt', emoji: '🍃' },
  { id: 8, op: OP.MISSING, name: 'Spare Seat', emoji: '🪑' },
  { id: 9, op: OP.COMPARE, name: 'Twin Tracks', emoji: '⚖️' },
  { id: 10, op: OP.BOND, name: 'Ten Bond Bay', emoji: '🧩' },
  { id: 11, op: 'mixed', name: 'Mix-Up Main', emoji: '🎲' },
];

/**
 * Every next*() must return an object with at least:
 * - op: one of OP.*
 * - routeId: number
 * - a, b: non-negative integers (compare: two group sizes; bond: parts that sum to 10)
 * - answer: value the child must tap (number, or for compare 'left'|'right'|'same')
 * - factKey: string unique for mastery
 * - speciesA, speciesB: ids or null
 * - choices: array of tap values (same type as answer)
 * - choiceCount: choices.length
 * - input: 'choices'
 * - requireCombine: boolean
 * - frameSize: 5 | 10
 * - frameCount: 1 | 2
 * - strategy: string
 * - sum: a+b when it exists; takeaway uses start count
 *
 * Also export:
 * - ROUTE_ID, STATION
 * - generateTrip(args) -> problem[] length 6
 * - isCorrect(problem, value)
 * - equationParts(problem, { celebrating })
 * - packSpec(problem) describing how to draw groups
 */
export function baseProblem(partial) {
  return {
    op: OP.ADD,
    input: 'choices',
    requireCombine: true,
    frameSize: 5,
    frameCount: 1,
    strategy: 'count-all',
    makeTenSplit: false,
    splitIntoFirst: 0,
    ...partial,
  };
}
