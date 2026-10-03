import { act, fireEvent, render, screen, waitFor } from '@testing-library/preact';

import { GameDifficulty } from '../lib/game-difficulty';
import { GameFinalStatus, GameStatus } from '../lib/game-status';
import { addHighscore, getHighscores, type Highscore } from '../lib/highscores';
import { GameAction } from '../store/game/game-actions';
import { gameStore, gameStoreContext } from '../store/game/game-store';

import { GameView } from './game-view';

vi.mock('./game-gfx', () => ({ GameGfx: () => <div>Board</div> }));
vi.mock('../lib/highscores', () => ({ addHighscore: vi.fn(), getHighscores: vi.fn() }));
const score: Highscore = { id: 'saved', rank: 2, player: 'Player', date: new Date(), time: 5000 };

/**
 * Mirrors the app's signal subscription so transitions update the context.
 */
function ConnectedGame() {
  return (
    <gameStoreContext.Provider value={gameStore.state.value}>
      <GameView />
    </gameStoreContext.Provider>
  );
}

beforeEach(() => {
  vi.mocked(addHighscore).mockReset().mockResolvedValue(score);
  vi.mocked(getHighscores)
    .mockReset()
    .mockResolvedValue({ items: [score], total: 1, perPage: 10, page: 1, pages: 1 });
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'Player',
    difficulty: GameDifficulty.Easy,
    settings: { tilesX: 8, tilesY: 8, minesCount: 10 },
  });
});

/**
 * Finishes the active game after five seconds of playing time.
 */
function win() {
  gameStore.dispatch(GameAction.FirstClick);
  vi.setSystemTime(Date.now() + 5000);
  gameStore.dispatch(GameAction.Finish, { finalStatus: GameFinalStatus.Won });
}

test('starts, pauses on blur and keyboard shortcuts, and removes listeners on unmount', () => {
  const view = render(<ConnectedGame />);
  expect(gameStore.state.peek().status).toBe(GameStatus.Running);
  globalThis.dispatchEvent(new Event('blur'));
  expect(gameStore.state.peek().status).toBe(GameStatus.Paused);
  fireEvent.keyDown(globalThis.document, { code: 'KeyP' });
  expect(gameStore.state.peek().status).toBe(GameStatus.Running);
  fireEvent.keyDown(globalThis.document, { code: 'Escape' });
  expect(gameStore.state.peek().status).toBe(GameStatus.Paused);
  view.unmount();
  expect(gameStore.state.peek().status).toBe(GameStatus.Closed);
  gameStore.dispatch(GameAction.Start);
  fireEvent.keyDown(globalThis.document, { code: 'KeyP' });
  globalThis.dispatchEvent(new Event('blur'));
  expect(gameStore.state.peek().status).toBe(GameStatus.Running);
});

test('submits a victory once and displays the saved rank and surrounding leaderboard', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  render(<ConnectedGame />);
  void act(win);
  expect(await screen.findByText('Congratulations!')).toBeTruthy();
  expect(addHighscore).toHaveBeenCalledExactlyOnceWith(GameDifficulty.Easy, 'Player', 5000);
  expect(getHighscores).toHaveBeenCalledWith({ difficulty: GameDifficulty.Easy, rank: 2 });
  expect(screen.getByText('Player')).toBeTruthy();
  void act(() => {
    gameStore.dispatch(GameAction.SetFlagsCount, { flagsCount: 1 });
  });
  expect(addHighscore).toHaveBeenCalledOnce();
  void act(() => {
    gameStore.dispatch(GameAction.Restart);
  });
  expect(screen.queryByText('Congratulations!')).toBeNull();
});

test('ignores a delayed highscore from a previous round', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  const { promise, resolve } = Promise.withResolvers<Highscore>();
  vi.mocked(addHighscore).mockReturnValue(promise);
  render(<ConnectedGame />);
  void act(win);
  void act(() => {
    gameStore.dispatch(GameAction.Restart);
  });
  await act(async () => {
    resolve(score);
    await Promise.resolve();
  });
  expect(screen.queryByText('Congratulations!')).toBeNull();
});

test('keeps a finished game usable after a submission error', async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.mocked(addHighscore).mockRejectedValue(new Error('offline'));
  render(<ConnectedGame />);
  void act(win);
  await waitFor(() => {
    expect(addHighscore).toHaveBeenCalledOnce();
  });
  expect(screen.getByTitle('Restart Game')).toBeTruthy();
  expect(getHighscores).not.toHaveBeenCalled();
});

test('does not submit custom-game victories', () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'Player',
    difficulty: GameDifficulty.Custom,
    settings: { tilesX: 8, tilesY: 8, minesCount: 10 },
  });
  render(<ConnectedGame />);
  void act(win);
  expect(addHighscore).not.toHaveBeenCalled();
});

test('returns direct game links without a player to home', () => {
  vi.spyOn(gameStore.state, 'peek').mockReturnValue({ ...gameStore.state.peek(), player: null });
  render(<ConnectedGame />);
  expect(globalThis.location.hash).toBe('#/');
});
