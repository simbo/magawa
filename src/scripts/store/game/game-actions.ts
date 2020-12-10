import { differenceInMilliseconds, subMilliseconds } from 'date-fns';

import { gameDifficultySettings } from '../../lib/game-difficulty-settings';
import { GameDifficultySettings } from '../../lib/game-difficulty-settings.interface';
import { GameDifficulty } from '../../lib/game-difficulty.enum';
import { GameFinalStatus, GameStatus } from '../../lib/game-status.enum';
import { storage } from '../../lib/storage';
import { Actions } from '../store';
import { gameSelectors } from './game-selectors';
import { GameState } from './game-state.interface';

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

export interface GameActionPayload {
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

export const gameActions: Actions<GameState, GameAction, GameActionPayload> = {
  [GameAction.SetSettings]: (state, { player, difficulty, settings }) => {
    if (!/^\w+$/.test(player)) {
      return;
    }
    difficulty =
      difficulty >= 0 && difficulty <= GameDifficulty.Custom
        ? difficulty
        : state.difficulty;
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
    return { player, difficulty, tilesX, tilesY, minesCount };
  },

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

  [GameAction.FirstClick]: () => {
    return {
      startedAt: new Date(),
      pausedAt: null,
      finishedAt: null,
      flagsCount: 0
    };
  },

  [GameAction.Restart]: (state, payload, dispatch) => {
    dispatch(GameAction.Start);
    return;
  },

  [GameAction.Pause]: state => {
    if (state.status !== GameStatus.Running) {
      return;
    }
    return {
      status: GameStatus.Paused,
      pausedAt: new Date()
    };
  },

  [GameAction.Unpause]: state => {
    if (state.status !== GameStatus.Paused) {
      return;
    }
    const pauseDuration = differenceInMilliseconds(
      state.pausedAt as Date,
      new Date()
    );
    const startedAt = state.startedAt
      ? subMilliseconds(state.startedAt as Date, pauseDuration)
      : null;
    return {
      status: GameStatus.Running,
      startedAt,
      pausedAt: null
    };
  },

  [GameAction.TogglePause]: (state, payload, dispatch) => {
    if (gameSelectors.isPaused(state)) {
      dispatch(GameAction.Unpause);
    } else {
      dispatch(GameAction.Pause);
    }
  },

  [GameAction.Finish]: (state, { finalStatus }) => {
    if (state.status !== GameStatus.Running) {
      return;
    }
    return {
      finishedAt: new Date(),
      status: GameStatus.Finished,
      finalStatus
    };
  },

  [GameAction.Close]: () => {
    return {
      status: GameStatus.Closed,
      startedAt: null,
      pausedAt: null
    };
  },

  [GameAction.SetFlagsCount]: (state, { flagsCount }) => {
    if (state.status !== GameStatus.Running || isNaN(flagsCount)) {
      return;
    }
    return { flagsCount };
  }
};
