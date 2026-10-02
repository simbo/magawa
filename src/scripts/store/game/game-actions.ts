import { differenceInMilliseconds, subMilliseconds } from 'date-fns';
import { Actions } from 'small-store';

import { GameDifficulty, gameDifficultySettings, GameDifficultySettings } from '../../lib/game-difficulty';
import { GameFinalStatus, GameStatus } from '../../lib/game-status';
import { storage } from '../../lib/storage';

import { GameState } from './game-state.interface';

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
  SetFlagsCount = 'setFlagsCount'
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
export const gameActions: Actions<GameState, GameAction, GameActionPayloads> = {
  /**
   * Validates the player and difficulty, selects board dimensions, and persists the preferences.
   */
  [GameAction.SetSettings]:
    ({ player, difficulty, settings }) =>
    state => {
      if (!/^\w+$/.test(player)) {
        return state;
      }
      difficulty = difficulty >= 0 && difficulty <= GameDifficulty.Custom ? difficulty : state.difficulty;
      const difficultySettings =
        difficulty === GameDifficulty.Custom
          ? settings || {
              tilesX: state.tilesX,
              tilesY: state.tilesY,
              minesCount: state.minesCount
            }
          : gameDifficultySettings[difficulty];
      const { tilesX, tilesY, minesCount } = difficultySettings;
      storage.set({ player, difficulty, difficultySettings });
      return { ...state, player, difficulty, tilesX, tilesY, minesCount };
    },

  /**
   * Resets lifecycle timestamps, outcome, and flags before the first click.
   */
  [GameAction.Start]: () => {
    return {
      status: GameStatus.Running,
      finalStatus: null,
      startedAt: null,
      pausedAt: null,
      finishedAt: null,
      flagsCount: 0
    };
  },

  /**
   * Starts the playing-time clock when the board is first interacted with.
   */
  [GameAction.FirstClick]: () => {
    return {
      startedAt: new Date(),
      pausedAt: null,
      finishedAt: null,
      flagsCount: 0
    };
  },

  /**
   * Records the pause timestamp only for a running game.
   */
  [GameAction.Pause]: () => state => {
    if (state.status !== GameStatus.Running) {
      return state;
    }
    return {
      ...state,
      status: GameStatus.Paused,
      pausedAt: new Date()
    };
  },

  /**
   * Resumes a paused game and shifts its start timestamp to exclude the pause duration.
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
    const startedAt = state.startedAt ? subMilliseconds(state.startedAt as Date, pauseDuration) : null;
    return {
      ...state,
      status: GameStatus.Running,
      startedAt,
      pausedAt: null
    };
  },

  /**
   * Records the outcome and finish timestamp only for a running game.
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
        finalStatus
      };
    },

  /**
   * Closes the game and clears the active timing timestamps.
   */
  [GameAction.Close]: () => {
    return {
      status: GameStatus.Closed,
      startedAt: null,
      pausedAt: null
    };
  },

  /**
   * Updates the flag count only while running and when the payload is numeric.
   */
  [GameAction.SetFlagsCount]:
    ({ flagsCount }) =>
    state => {
      if (state.status !== GameStatus.Running || typeof flagsCount !== 'number') {
        return state;
      }
      return { ...state, flagsCount };
    }
};
