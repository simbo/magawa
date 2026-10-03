import { formatDuration } from './format-duration.function';

test.each([
  [0, '00:00:000'],
  [999, '00:00:999'],
  [60_001, '01:00:001'],
  [3_600_000, '60:00:000'],
])('formats duration %s', (value, expected) => {
  expect(formatDuration(value)).toBe(expected);
  expect(formatDuration(value, false)).toBe(expected.slice(0, -4));
});
