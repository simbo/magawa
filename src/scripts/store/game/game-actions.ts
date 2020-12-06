import { differenceInMilliseconds, subMilliseconds } from 'date-fns';

import { gameDifficultySettings } from '../../lib/game-difficulty-settings';
import { GameDifficultySettings } from '../../lib/game-difficulty-settings.interface';
import { GameDifficulty } from '../../lib/game-difficulty.enum';
import { GameFinalStatus, GameStatus } from '../../lib/game-status.enum';
import { Action } from '../store';
import { GameReducers } from './game-reducers';
import { GameState } from './game-state';
import { gameStore } from './game-store';

export enum GameAction {
  Start = 'START',
  Restart = 'RESTART',
  Pause = 'PAUSE',
  Unpause = 'UNPAUSE',
  TogglePause = 'TOGGLE PAUSE',
  Finish = 'FINISH',
  Close = 'CLOSE',
  SetFlagsCount = 'SET FLAGS COUNT'
}

export class GameActions {
  public static start(
    difficulty?: GameDifficulty,
    settings?: GameDifficultySettings
  ): void {
    gameStore.push(new GameStartAction(difficulty, settings));
  }

  public static restart(): void {
    gameStore.push(new GameRestartAction());
  }

  public static pause(): void {
    gameStore.push(new GamePauseAction());
  }

  public static unpause(): void {
    gameStore.push(new GameUnpauseAction());
  }

  public static togglePause(): void {
    gameStore.push(new GameTogglePauseAction());
  }

  public static finish(finalStatus: GameFinalStatus): void {
    gameStore.push(new GameFinishAction(finalStatus));
  }

  public static close(): void {
    gameStore.push(new GameCloseAction());
  }

  public static setFlagsCount(flagsCount: number): void {
    gameStore.push(new GameSetFlagsCountAction(flagsCount));
  }
}

class GameStartAction implements Action<GameState> {
  public readonly type = GameAction.Start;

  constructor(
    private readonly difficulty?: GameDifficulty,
    private readonly settings?: GameDifficultySettings
  ) {}

  public map(state: GameState): Partial<GameState> {
    const difficulty = this.difficulty || state.difficulty;
    const { tilesX, tilesY, minesCount } =
      difficulty === GameDifficulty.Custom
        ? this.settings || {
            tilesX: state.tilesX,
            tilesY: state.tilesY,
            minesCount: state.minesCount
          }
        : gameDifficultySettings[difficulty];
    return {
      status: GameStatus.Running,
      finalStatus: null,
      startedAt: new Date(),
      pausedAt: null,
      finishedAt: null,
      difficulty,
      tilesX,
      tilesY,
      minesCount,
      flagsCount: 0
    };
  }
}

class GameRestartAction implements Action<GameState> {
  public readonly type = GameAction.Restart;

  public map(): void {
    GameActions.start();
  }
}

class GamePauseAction implements Action<GameState> {
  public readonly type = GameAction.Pause;

  public map(state: GameState): Partial<GameState> | void {
    if (!GameReducers.isRunning(state)) {
      return;
    }
    return { status: GameStatus.Paused, pausedAt: new Date() };
  }
}

class GameUnpauseAction implements Action<GameState> {
  public readonly type = GameAction.Unpause;

  public map(state: GameState): Partial<GameState> | void {
    if (!GameReducers.isPaused(state)) {
      return;
    }
    const pauseDuration = differenceInMilliseconds(
      state.pausedAt as Date,
      new Date()
    );
    return {
      status: GameStatus.Running,
      startedAt: subMilliseconds(state.startedAt as Date, pauseDuration),
      pausedAt: null
    };
  }
}

class GameTogglePauseAction implements Action<GameState> {
  public readonly type = GameAction.TogglePause;

  public map(state: GameState): void {
    if (GameReducers.isPaused(state)) {
      GameActions.unpause();
    } else if (GameReducers.isRunning(state)) {
      GameActions.pause();
    }
  }
}

class GameFinishAction implements Action<GameState> {
  public readonly type = GameAction.Finish;

  constructor(public readonly finalStatus: GameFinalStatus) {}

  public map(state: GameState): Partial<GameState> | void {
    if (!GameReducers.isRunning(state)) {
      return;
    }
    return { status: GameStatus.Finished, finalStatus: this.finalStatus };
  }
}

class GameCloseAction implements Action<GameState> {
  public readonly type = GameAction.Close;

  public map(): Partial<GameState> {
    return { status: GameStatus.Closed, startedAt: null, pausedAt: null };
  }
}

class GameSetFlagsCountAction implements Action<GameState> {
  public readonly type = GameAction.SetFlagsCount;

  constructor(private readonly flagsCount: number) {}

  public map(state: GameState): Partial<GameState> | void {
    if (!GameReducers.isRunning(state)) {
      return;
    }
    return { flagsCount: this.flagsCount };
  }
}
