import { fireEvent, render, screen, waitFor } from '@testing-library/preact';

import { GameDifficulty } from '../lib/game-difficulty';
import { getHighscores } from '../lib/highscores';

import { HighscoresView } from './highscores-view';

vi.mock('../lib/highscores', () => ({ getHighscores: vi.fn() }));
const collection = {
  items: [{ id: 'one', rank: 1, player: 'Player', date: new Date(), time: 1234 }],
  total: 2,
  page: 1,
  pages: 2,
  perPage: 1,
  nextPage: 2,
};

test('loads results, paginates and applies difficulty and player filters', async () => {
  vi.mocked(getHighscores).mockResolvedValue(collection);
  render(<HighscoresView />);
  await screen.findByText('Player');
  expect(getHighscores).toHaveBeenCalledWith({ difficulty: GameDifficulty.Medium, page: 1, player: '' });
  expect(screen.getByTitle<HTMLButtonElement>('Page 0').disabled).toBe(true);
  vi.mocked(getHighscores).mockResolvedValue({ ...collection, page: 2, nextPage: undefined, previousPage: 1 });
  fireEvent.click(screen.getByTitle('Page 2'));
  await screen.findByText('Page 2 of 2');
  expect(getHighscores).toHaveBeenLastCalledWith({ difficulty: GameDifficulty.Medium, page: 2, player: '' });
  fireEvent.input(screen.getByLabelText('Difficulty'), { target: { value: '2' } });
  await waitFor(() => {
    expect(getHighscores).toHaveBeenLastCalledWith({ difficulty: GameDifficulty.Hard, page: 2, player: '' });
  });
  fireEvent.input(screen.getByLabelText('Player'), { target: { value: 'P*' } });
  fireEvent.submit(screen.getByLabelText('Player').closest('form')!);
  await waitFor(() => {
    expect(getHighscores).toHaveBeenLastCalledWith({ difficulty: GameDifficulty.Hard, page: 2, player: 'P*' });
  });
  expect(screen.queryByRole('option', { name: 'Custom' })).toBeNull();
});

test('shows an empty result after an API failure', async () => {
  vi.mocked(getHighscores).mockRejectedValue(new Error('offline'));
  render(<HighscoresView />);
  expect(screen.getByText('Loading...')).toBeTruthy();
  expect(await screen.findByText('No entries found.')).toBeTruthy();
});
