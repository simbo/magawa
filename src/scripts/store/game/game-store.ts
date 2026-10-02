import { computed, signal } from '@preact/signals';
import { createContext } from 'preact';

import {
  DEFAULT_GAME_DIFFICULTY,
  gameDifficultySettings,
  type GameDifficulty,
  type GameDifficultySettings,
} from '../../lib/game-difficulty';
import { GameStatus } from '../../lib/game-status';
import { storage } from '../../lib/storage';

import { gameActions, type GameAction, type GameActionPayloads } from './game-actions';
import { gameSelectors } from './game-selectors';
import type { GameState } from './game-state.interface';

/**
 * Restores saved settings over explicit defaults before constructing the initial state.
 * The assertion describes the fields guaranteed by those defaults.
 */
const {
  player,
  difficulty,
  difficultySettings: { tilesX, tilesY, minesCount },
} = storage.get({
  player: null,
  difficulty: DEFAULT_GAME_DIFFICULTY,
  difficultySettings: gameDifficultySettings[DEFAULT_GAME_DIFFICULTY],
}) as { player: string | null; difficulty: GameDifficulty; difficultySettings: GameDifficultySettings };

const initialState: GameState = {
  player,
  status: GameStatus.Closed,
  finalStatus: null,
  startedAt: null,
  pausedAt: null,
  finishedAt: null,
  difficulty,
  tileSize: 40,
  tilesX,
  tilesY,
  minesCount,
  flagsCount: 0,
};

/**
 * Immutable game snapshots held in a signal; callers update them through dispatch.
 */
const stateSignal = signal(initialState);

/**
 * Derived board width shared by the game layout.
 */
export const gameWidth = computed(() => gameSelectors.width(stateSignal.value));

/**
 * Action notification delivered after its state transition has completed.
 */
export interface GameActionEvent {
  name: GameAction;
  payload: GameActionPayloads[keyof GameActionPayloads] | undefined;
  state: GameState;
}

/**
 * Canvas commands must run even when the lifecycle value does not change,
 * for example when restarting an already running game.
 */
const actionListeners = new Set<(event: GameActionEvent) => void>();

/**
 * Applies a typed action and notifies canvas listeners synchronously.
 *
 * @param name - State transition to apply.
 * @param payload - Required input for actions that accept a payload.
 */
function dispatch<Action extends GameAction>(
  name: Action,
  ...payload: Action extends keyof GameActionPayloads ? [GameActionPayloads[Action]] : []
): void {
  const update = gameActions[name](...payload);
  const previousState = stateSignal.peek();
  stateSignal.value = typeof update === 'function' ? update(previousState) : { ...previousState, ...update };
  const event: GameActionEvent = { name, payload: payload[0], state: stateSignal.peek() };

  /**
   * Development builds trace every completed action, even before a view mounts.
   * Optional env access also allows the store to run in the Node regression tests.
   */
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Vite's env object is absent in Node tests.
  if (import.meta.env?.DEV) {
    // eslint-disable-next-line no-console -- Development-only action tracing.
    console.log('Action:', event.name, '\nPayload:', event.payload, '\nState:', event.state);
  }
  for (const listener of actionListeners) listener(event);
}

/**
 * Registers canvas commands and returns a cleanup function for component unmount.
 *
 * @param listener - Receives completed state transitions.
 * @returns A function that removes the listener.
 */
function subscribeActions(listener: (event: GameActionEvent) => void): () => void {
  actionListeners.add(listener);
  return () => {
    actionListeners.delete(listener);
  };
}

/**
 * Signals-based store with typed transitions and explicit canvas command listeners.
 */
export const gameStore = {
  state: computed(() => stateSignal.value),
  dispatch,
  subscribeActions,
};

/**
 * Context adapter for the existing class components, updated by the root subscription.
 */
export const gameStoreContext = createContext(initialState);
