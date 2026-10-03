import { render, screen } from '@testing-library/preact';

import { GameDifficulty } from '../lib/game-difficulty';

import { Congratulations } from './congratulations';

const score = { id: 'score', rank: 3, player: 'Player', date: new Date(2026, 0, 2), time: 12_345 };

test('shows congratulations immediately and saved time and rank when available', () => {
  const view = render(<Congratulations difficulty={GameDifficulty.Easy} />);
  expect(screen.queryByText(/You won/)).toBeNull();
  view.rerender(<Congratulations difficulty={GameDifficulty.Easy} highscore={score} />);
  expect(screen.getByText('00:12:345')).toBeTruthy();
  expect(screen.getByText('Easy')).toBeTruthy();
});
