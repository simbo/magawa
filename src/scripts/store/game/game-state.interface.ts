import type { GameDifficulty } from '../../lib/game-difficulty';
import type { GameFinalStatus, GameStatus } from '../../lib/game-status';

/**
 * Shared game settings, lifecycle timestamps, and flag count. Timestamps are nullable before use.
 */
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
