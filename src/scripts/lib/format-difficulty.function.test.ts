import { formatDifficulty } from './format-difficulty.function';
import { GameDifficulty } from './game-difficulty';

test.each([
  [GameDifficulty.Easy, 'Easy'],
  [GameDifficulty.Medium, 'Medium'],
  [GameDifficulty.Hard, 'Hard'],
  [GameDifficulty.Custom, 'Custom'],
])('labels difficulty %s', (difficulty, expected) => {
  expect(formatDifficulty(difficulty)).toBe(expected);
});
