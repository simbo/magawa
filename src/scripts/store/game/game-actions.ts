import { differenceInMilliseconds, subMilliseconds } from 'date-fns';
import { Actions } from 'small-store';

import { gameDifficultySettings } from '../../lib/game-difficulty-settings';
import { GameDifficultySettings } from '../../lib/game-difficulty-settings.interface';
import { GameDifficulty } from '../../lib/game-difficulty.enum';
import { GameFinalStatus, GameStatus } from '../../lib/game-status.enum';
import { storage } from '../../lib/storage';
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

export const gameActions: Actions<GameState, GameAction, GameActionPayloads> = {
  [GameAction.SetSettings]: ({ player, difficulty, settings }) => state => {
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

  [GameAction.Unpause]: () => state => {
    if (state.status !== GameStatus.Paused) {
      return state;
    }
    const pauseDuration = differenceInMilliseconds(state.pausedAt as Date, new Date());
    const startedAt = state.startedAt ? subMilliseconds(state.startedAt as Date, pauseDuration) : null;
    return {
      ...state,
      status: GameStatus.Running,
      startedAt,
      pausedAt: null
    };
  },

  [GameAction.Finish]: ({ finalStatus }) => state => {
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

  [GameAction.Close]: () => {
    return {
      status: GameStatus.Closed,
      startedAt: null,
      pausedAt: null
    };
  },

  [GameAction.SetFlagsCount]: ({ flagsCount }) => state => {
    if (state.status !== GameStatus.Running || isNaN(flagsCount)) {
      return state;
    }
    return { ...state, flagsCount };
  }
};
