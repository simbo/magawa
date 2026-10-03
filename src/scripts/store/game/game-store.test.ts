import lzString from 'lz-string';

import { GameDifficulty } from '../../lib/game-difficulty';
import { GameFinalStatus, GameStatus } from '../../lib/game-status';

import { GameAction } from './game-actions';
import { gameSelectors } from './game-selectors';

beforeEach(() => {
  vi.resetModules();
  globalThis.localStorage.setItem('magawa_dataVersion', '"1"');
  globalThis.localStorage.setItem(
    'magawa_data',
    lzString.compressToUTF16(
      JSON.stringify({
        player: 'ExistingPlayer',
        difficulty: 1,
        difficultySettings: { tilesX: 16, tilesY: 16, minesCount: 40 },
      }),
    ),
  );
});

test('restores compressed settings, persists custom values and updates derived width', async () => {
  const { gameStore, gameWidth } = await import('./game-store');
  expect(gameStore.state.peek().player).toBe('ExistingPlayer');
  expect(gameWidth.value).toBe(640);
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'CustomPlayer',
    difficulty: GameDifficulty.Custom,
    settings: { tilesX: 12, tilesY: 10, minesCount: 20 },
  });
  expect(gameWidth.value).toBe(480);
  expect(
    (
      JSON.parse(lzString.decompressFromUTF16(globalThis.localStorage.getItem('magawa_data')!)) as {
        difficultySettings: unknown;
      }
    ).difficultySettings,
  ).toEqual({ tilesX: 12, tilesY: 10, minesCount: 20 });
  const previous = gameStore.state.peek();
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'Invalid Name',
    difficulty: GameDifficulty.Easy,
    settings: { tilesX: 8, tilesY: 8, minesCount: 10 },
  });
  expect(gameStore.state.peek()).toBe(previous);
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'Player',
    difficulty: -1 as GameDifficulty,
    settings: { tilesX: 1, tilesY: 1, minesCount: 1 },
  });
  expect(gameStore.state.peek().difficulty).toBe(GameDifficulty.Custom);
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'Player',
    difficulty: GameDifficulty.Easy,
    settings: { tilesX: 1, tilesY: 1, minesCount: 1 },
  });
  expect(gameStore.state.peek().minesCount).toBe(10);
});

test.each([GameFinalStatus.Won, GameFinalStatus.Lost])(
  'excludes paused time and freezes finished outcome %s',
  async finalStatus => {
    const { gameStore } = await import('./game-store');
    vi.useFakeTimers();
    vi.setSystemTime(1000);
    gameStore.dispatch(GameAction.Start);
    expect(gameStore.state.peek().startedAt).toBeNull();
    gameStore.dispatch(GameAction.FirstClick);
    vi.advanceTimersByTime(2000);
    gameStore.dispatch(GameAction.TogglePause);
    expect(gameSelectors.isPaused(gameStore.state.peek())).toBe(true);
    vi.advanceTimersByTime(5000);
    gameStore.dispatch(GameAction.TogglePause);
    vi.advanceTimersByTime(3000);
    gameStore.dispatch(GameAction.Finish, { finalStatus });
    const state = gameStore.state.peek();
    expect(state.finishedAt!.getTime() - state.startedAt!.getTime()).toBe(5000);
    expect(gameSelectors.isFinished(state)).toBe(true);
    expect(gameSelectors.isWon(state)).toBe(finalStatus === GameFinalStatus.Won);
    gameStore.dispatch(GameAction.TogglePause);
    gameStore.dispatch(GameAction.Unpause);
    gameStore.dispatch(GameAction.Finish, { finalStatus });
    expect(gameStore.state.peek()).toBe(state);
  },
);

test('resumes before the first click and resets lifecycle fields on restart', async () => {
  const { gameStore } = await import('./game-store');
  gameStore.dispatch(GameAction.Start);
  gameStore.dispatch(GameAction.Pause);
  gameStore.dispatch(GameAction.Unpause);
  expect(gameStore.state.peek().startedAt).toBeNull();
  gameStore.dispatch(GameAction.FirstClick);
  gameStore.dispatch(GameAction.SetFlagsCount, { flagsCount: 3 });
  expect(gameStore.state.peek().flagsCount).toBe(3);
  gameStore.dispatch(GameAction.Restart);
  expect(gameStore.state.peek()).toMatchObject({
    status: GameStatus.Running,
    startedAt: null,
    pausedAt: null,
    finishedAt: null,
    finalStatus: null,
    flagsCount: 0,
  });
});

test('notifies listeners after updates, cleans subscriptions and ignores closed-game changes', async () => {
  const { gameStore } = await import('./game-store');
  const listener = vi.fn();
  const unsubscribe = gameStore.subscribeActions(listener);
  gameStore.dispatch(GameAction.Restart);
  expect(listener).toHaveBeenCalledExactlyOnceWith({
    name: GameAction.Restart,
    payload: undefined,
    state: gameStore.state.peek(),
  });
  unsubscribe();
  gameStore.dispatch(GameAction.Close);
  const closed = gameStore.state.peek();
  gameStore.dispatch(GameAction.SetFlagsCount, { flagsCount: 10 });
  gameStore.dispatch(GameAction.Pause);
  gameStore.dispatch(GameAction.Unpause);
  gameStore.dispatch(GameAction.Finish, { finalStatus: GameFinalStatus.Won });
  expect(gameStore.state.peek()).toBe(closed);
  expect(listener).toHaveBeenCalledOnce();
  expect(gameSelectors.isClosed(closed)).toBe(true);
  expect(gameSelectors.isRunning(closed)).toBe(false);
  expect(gameSelectors.player(closed)).toBe('ExistingPlayer');
});
