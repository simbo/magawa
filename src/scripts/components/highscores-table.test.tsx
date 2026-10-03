import { render, screen } from '@testing-library/preact';

import { HighscoresTable } from './highscores-table';

const score = { id: 'score', rank: 3, player: 'Player', date: new Date(2026, 0, 2), time: 12_345 };

test('distinguishes loading, empty and populated leaderboards and highlights the saved score', () => {
  const view = render(<HighscoresTable />);
  expect(screen.getByText('Loading...')).toBeTruthy();
  view.rerender(<HighscoresTable rows={[]} />);
  expect(screen.getByText('No entries found.')).toBeTruthy();
  view.rerender(<HighscoresTable rows={[score]} highlight="score" />);
  expect(screen.getByText('00:12:345')).toBeTruthy();
  expect(screen.getByText('Player').closest('tr')?.className).toContain('--highlight');
  expect(screen.getByText('Player').closest('tr')?.title).toContain('02.01.2026');
});
