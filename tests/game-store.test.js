import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createJiti } from 'jiti';
import lzString from 'lz-string';

/**
 * Loads TypeScript source modules using the same runtime dependency as ESLint.
 */
const jiti = createJiti(import.meta.url);

/** In-memory browser storage seeded with a preference saved by the previous store. */
const savedPreferences = new Map([
  ['magawa_dataVersion', '"1"'],
  [
    'magawa_data',
    lzString.compressToUTF16(
      JSON.stringify({
        player: 'ExistingPlayer',
        difficulty: 1,
        difficultySettings: { tilesX: 16, tilesY: 16, minesCount: 40 },
      }),
    ),
  ],
]);
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: key => savedPreferences.get(key) ?? null,
    setItem: (key, value) => savedPreferences.set(key, value),
    removeItem: key => savedPreferences.delete(key),
  },
});
const { gameStore, gameWidth } = await jiti.import('../src/scripts/store/game/game-store.ts');
const { GameAction } = await jiti.import('../src/scripts/store/game/game-actions.ts');
const { GameDifficulty } = await jiti.import('../src/scripts/lib/game-difficulty.ts');
const { GameStatus, GameFinalStatus } = await jiti.import('../src/scripts/lib/game-status.ts');

test('restores compressed preferences without changing their storage format', () => {
  assert.equal(gameStore.state.peek().player, 'ExistingPlayer');
  assert.equal(gameStore.state.peek().minesCount, 40);
  assert.equal(gameWidth.value, 640);
});

test('persists custom settings, updates derived width and rejects invalid player names', () => {
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'CustomPlayer',
    difficulty: GameDifficulty.Custom,
    settings: { tilesX: 12, tilesY: 10, minesCount: 20 },
  });
  assert.equal(gameWidth.value, 480);
  const preferences = JSON.parse(lzString.decompressFromUTF16(savedPreferences.get('magawa_data')));
  assert.deepEqual(preferences.difficultySettings, { tilesX: 12, tilesY: 10, minesCount: 20 });
  const previousState = gameStore.state.peek();
  gameStore.dispatch(GameAction.SetSettings, {
    player: 'Invalid Name',
    difficulty: GameDifficulty.Easy,
    settings: { tilesX: 8, tilesY: 8, minesCount: 10 },
  });
  assert.equal(gameStore.state.peek(), previousState);
});

test('excludes paused time and freezes both winning and losing outcomes', context => {
  context.mock.timers.enable({ apis: ['Date'], now: 1000 });
  for (const finalStatus of [GameFinalStatus.Won, GameFinalStatus.Lost]) {
    gameStore.dispatch(GameAction.Start);
    assert.equal(gameStore.state.peek().startedAt, null);
    gameStore.dispatch(GameAction.FirstClick);
    context.mock.timers.tick(2000);
    gameStore.dispatch(GameAction.TogglePause);
    assert.equal(gameStore.state.peek().status, GameStatus.Paused);
    context.mock.timers.tick(5000);
    gameStore.dispatch(GameAction.TogglePause);
    assert.equal(gameStore.state.peek().pausedAt, null);
    context.mock.timers.tick(3000);
    gameStore.dispatch(GameAction.Finish, { finalStatus });
    const state = gameStore.state.peek();
    assert.equal(state.finishedAt - state.startedAt, 5000);
    assert.equal(state.finalStatus, finalStatus);
    gameStore.dispatch(GameAction.TogglePause);
    assert.equal(gameStore.state.peek(), state);
  }
});

test('resumes before the first click and resets every lifecycle field on restart', () => {
  gameStore.dispatch(GameAction.Start);
  gameStore.dispatch(GameAction.Pause);
  gameStore.dispatch(GameAction.Unpause);
  assert.equal(gameStore.state.peek().startedAt, null);
  gameStore.dispatch(GameAction.FirstClick);
  gameStore.dispatch(GameAction.SetFlagsCount, { flagsCount: 3 });
  gameStore.dispatch(GameAction.Restart);
  const state = gameStore.state.peek();
  assert.equal(state.status, GameStatus.Running);
  assert.equal(state.startedAt, null);
  assert.equal(state.pausedAt, null);
  assert.equal(state.finishedAt, null);
  assert.equal(state.finalStatus, null);
  assert.equal(state.flagsCount, 0);
});

test('delivers restart commands after state updates and cleans up listeners', () => {
  const events = [];
  const unsubscribe = gameStore.subscribeActions(event => events.push(event));
  gameStore.dispatch(GameAction.Restart);
  assert.equal(events.length, 1);
  assert.equal(events[0].name, GameAction.Restart);
  assert.equal(events[0].state, gameStore.state.peek());
  unsubscribe();
  gameStore.dispatch(GameAction.Close);
  gameStore.dispatch(GameAction.SetFlagsCount, { flagsCount: 10 });
  assert.equal(events.length, 1);
  assert.equal(gameStore.state.peek().status, GameStatus.Closed);
  assert.equal(gameStore.state.peek().flagsCount, 0);
});
