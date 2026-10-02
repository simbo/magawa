import { GameFinalStatus, GameStatus } from '../../lib/game-status';

import type { GameState } from './game-state.interface';

/**
 * Read-only projections of the shared game state used by the views.
 */
export const gameSelectors = {
  /**
   * Returns the current player name or null when none is selected.
   *
   * @param root0 - Component props or action input.
   * @param root0.player - Player name associated with the game or query.
   * @returns The player name or null when none is selected.
   */
  player: ({ player }): string | null => player,

  /**
   * Reports whether the game is in its running lifecycle state.
   *
   * @param root0 - Component props or action input.
   * @param root0.status - Current game lifecycle state.
   * @returns Whether the game matches this lifecycle state or outcome.
   */
  isRunning: ({ status }): boolean => status === GameStatus.Running,

  /**
   * Reports whether the game is paused.
   *
   * @param root0 - Component props or action input.
   * @param root0.status - Current game lifecycle state.
   * @returns Whether the game matches this lifecycle state or outcome.
   */
  isPaused: ({ status }): boolean => status === GameStatus.Paused,

  /**
   * Reports whether the game has finished.
   *
   * @param root0 - Component props or action input.
   * @param root0.status - Current game lifecycle state.
   * @returns Whether the game matches this lifecycle state or outcome.
   */
  isFinished: ({ status }): boolean => status === GameStatus.Finished,

  /**
   * Reports whether the game view is closed.
   *
   * @param root0 - Component props or action input.
   * @param root0.status - Current game lifecycle state.
   * @returns Whether the game matches this lifecycle state or outcome.
   */
  isClosed: ({ status }): boolean => status === GameStatus.Closed,

  /**
   * Reports whether the last outcome was a victory.
   *
   * @param root0 - Component props or action input.
   * @param root0.finalStatus - Winning or losing game outcome.
   * @returns Whether the game matches this lifecycle state or outcome.
   */
  isWon: ({ finalStatus }): boolean => finalStatus === GameFinalStatus.Won,

  /**
   * Returns the logical board width in pixels.
   *
   * @param root0 - Component props or action input.
   * @param root0.tileSize - Tile edge length in logical pixels.
   * @param root0.tilesX - Number of board columns.
   * @returns Board width in logical pixels.
   */
  width: ({ tileSize, tilesX }): number => tileSize * tilesX,
} satisfies Record<string, (state: GameState) => unknown>;
