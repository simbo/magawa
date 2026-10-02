import { differenceInMilliseconds, subMilliseconds } from 'date-fns';

import { GameDifficulty, gameDifficultySettings, type GameDifficultySettings } from '../../lib/game-difficulty';
import { GameStatus, type GameFinalStatus } from '../../lib/game-status';
import { storage } from '../../lib/storage';

import type { GameState } from './game-state.interface';

/**
 * Action names dispatched to the game store.
 */
export enum GameAction {
  SetSettings = 'setSettings',
  Start = 'start',
  FirstClick = 'firstClick',
  Restart = 'restart',
  Pause = 'pause',
  Unpause = 'unpause',
  TogglePause = 'togglePause',
  Finish = 'finish',
  Close = 'close',
  SetFlagsCount = 'setFlagsCount',
}

/**
 * Payloads required by actions that change settings, outcomes, or flag counts.
 */
export interface GameActionPayloads {
  [GameAction.SetSettings]: {
    player: string;
    difficulty: GameDifficulty;
    settings: GameDifficultySettings;
  };
  [GameAction.Finish]: {
    finalStatus: GameFinalStatus;
  };
  [GameAction.SetFlagsCount]: {
    flagsCount: number;
  };
}

/**
 * State transitions for game actions; reducers return either partial updates or the current state.
 */
export type GameReducers = {
  [Action in GameAction]: (
    ...payload: Action extends keyof GameActionPayloads ? [GameActionPayloads[Action]] : []
  ) => Partial<GameState> | ((state: GameState) => GameState);
};

/**
 * Pure state transitions; restart and pause-toggle reuse existing transitions.
 */
export const gameActions: GameReducers = {
  /**
   * Validates the player and difficulty, selects board dimensions, and persists the preferences.
   *
   * @param root0 - Component props or action input.
   * @param root0.player - Player name associated with the game or query.
   * @param root0.difficulty - Selected game difficulty.
   * @param root0.settings - Board dimensions and mine count for custom difficulty.
   * @returns The resulting game state or partial state update.
   */
  [GameAction.SetSettings]:
    ({ player, difficulty, settings }) =>
    state => {
      if (!/^\w+$/.test(player)) {
        return state;
      }
      difficulty =
        difficulty >= GameDifficulty.Easy && difficulty <= GameDifficulty.Custom ? difficulty : state.difficulty;
      const difficultySettings = difficulty === GameDifficulty.Custom ? settings : gameDifficultySettings[difficulty];
      const { tilesX, tilesY, minesCount } = difficultySettings;
      storage.set({ player, difficulty, difficultySettings });
      return { ...state, player, difficulty, tilesX, tilesY, minesCount };
    },

  /**
   * Resets lifecycle timestamps, outcome, and flags before the first click.
   *
   * @returns The resulting game state or partial state update.
   */
  [GameAction.Restart]: () => gameActions[GameAction.Start](),

  /**
   * Chooses the pause transition from the current lifecycle state.
   *
   * @returns A reducer that pauses or resumes the game.
   */
  [GameAction.TogglePause]: () => state => {
    const action = state.status === GameStatus.Paused ? GameAction.Unpause : GameAction.Pause;
    const update = gameActions[action]();
    return typeof update === 'function' ? update(state) : { ...state, ...update };
  },

  /**
   * Resets the game before the first click.
   *
   * @returns The initial lifecycle fields.
   */
  [GameAction.Start]: () => ({
    status: GameStatus.Running,
    finalStatus: null,
    startedAt: null,
    pausedAt: null,
    finishedAt: null,
    flagsCount: 0,
  }),

  /**
   * Starts the playing-time clock when the board is first interacted with.
   *
   * @returns The resulting game state or partial state update.
   */
  [GameAction.FirstClick]: () => ({
    startedAt: new Date(),
    pausedAt: null,
    finishedAt: null,
    flagsCount: 0,
  }),

  /**
   * Records the pause timestamp only for a running game.
   *
   * @returns The resulting game state or partial state update.
   */
  [GameAction.Pause]: () => state => {
    if (state.status !== GameStatus.Running) {
      return state;
    }
    return {
      ...state,
      status: GameStatus.Paused,
      pausedAt: new Date(),
    };
  },

  /**
   * Resumes a paused game and shifts its start timestamp to exclude the pause duration.
   *
   * @returns The resulting game state or partial state update.
   */
  [GameAction.Unpause]: () => state => {
    if (state.status !== GameStatus.Paused) {
      return state;
    }

    /**
     * The difference is negative because the pause timestamp precedes now.
     * Subtracting it moves startedAt forward, excluding paused time from the elapsed duration.
     */
    const pauseDuration = differenceInMilliseconds(state.pausedAt as Date, new Date());
    const startedAt = state.startedAt ? subMilliseconds(state.startedAt, pauseDuration) : null;
    return {
      ...state,
      status: GameStatus.Running,
      startedAt,
      pausedAt: null,
    };
  },

  /**
   * Records the outcome and finish timestamp only for a running game.
   *
   * @param root0 - Component props or action input.
   * @param root0.finalStatus - Winning or losing game outcome.
   * @returns The resulting game state or partial state update.
   */
  [GameAction.Finish]:
    ({ finalStatus }) =>
    state => {
      if (state.status !== GameStatus.Running) {
        return state;
      }
      return {
        ...state,
        finishedAt: new Date(),
        status: GameStatus.Finished,
        finalStatus,
      };
    },

  /**
   * Closes the game and clears the active timing timestamps.
   *
   * @returns The resulting game state or partial state update.
   */
  [GameAction.Close]: () => ({
    status: GameStatus.Closed,
    startedAt: null,
    pausedAt: null,
  }),

  /**
   * Updates the flag count only while running and when the payload is numeric.
   *
   * @param root0 - Component props or action input.
   * @param root0.flagsCount - Current number of placed flags.
   * @returns The resulting game state or partial state update.
   */
  [GameAction.SetFlagsCount]:
    ({ flagsCount }) =>
    state =>
      state.status !== GameStatus.Running || typeof flagsCount !== 'number' ? state : { ...state, flagsCount },
};
