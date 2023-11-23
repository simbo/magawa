import { GameDifficulty } from '../../lib/game-difficulty';
import { GameFinalStatus, GameStatus } from '../../lib/game-status';

export interface GameState {
  player: string | null;
  status: GameStatus;
  finalStatus: GameFinalStatus | null;
  startedAt: Date | null;
  pausedAt: Date | null;
  finishedAt: Date | null;
  difficulty: GameDifficulty;
  tileSize: number;
  tilesX: number;
  tilesY: number;
  minesCount: number;
  flagsCount: number;
}
