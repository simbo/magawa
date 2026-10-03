import { formatDate } from './format-date.function';

test('formats local calendar dates from objects and strings with optional time', () => {
  const date = new Date(2026, 0, 2, 3, 4, 5);
  expect(formatDate(date)).toBe('02.01.2026 03:04:05');
  expect(formatDate(date.toISOString(), false)).toBe('02.01.2026');
});
