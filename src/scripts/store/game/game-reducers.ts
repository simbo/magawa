import { GameFinalStatus, GameStatus } from '../../lib/game-status.enum';
import { GameState } from './game-state';

export class GameReducers {
  public static isRunning({ status }: GameState): boolean {
    return status === GameStatus.Running;
  }

  public static isPaused({ status }: GameState): boolean {
    return status === GameStatus.Paused;
  }

  public static isFinished({ status }: GameState): boolean {
    return status === GameStatus.Finished;
  }

  public static isClosed({ status }: GameState): boolean {
    return status === GameStatus.Closed;
  }

  public static isWon({ finalStatus }: GameState): boolean {
    return finalStatus === GameFinalStatus.Won;
  }
}
