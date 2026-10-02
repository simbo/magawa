import { Selectors } from 'small-store';

import { GameFinalStatus, GameStatus } from '../../lib/game-status';

import { GameState } from './game-state.interface';

/**
 * Read-only projections of the shared game state used by the views.
 */
export const gameSelectors: Selectors<GameState> = {
  /**
   * Returns the current player name or null when none is selected.
   */
  player: ({ player }): string | null => {
    return player;
  },

  /**
   * Reports whether the game is in its running lifecycle state.
   */
  isRunning: ({ status }): boolean => {
    return status === GameStatus.Running;
  },

  /**
   * Reports whether the game is paused.
   */
  isPaused: ({ status }): boolean => {
    return status === GameStatus.Paused;
  },

  /**
   * Reports whether the game has finished.
   */
  isFinished: ({ status }): boolean => {
    return status === GameStatus.Finished;
  },

  /**
   * Reports whether the game view is closed.
   */
  isClosed: ({ status }): boolean => {
    return status === GameStatus.Closed;
  },

  /**
   * Reports whether the last outcome was a victory.
   */
  isWon: ({ finalStatus }): boolean => {
    return finalStatus === GameFinalStatus.Won;
  },

  /**
   * Returns the logical board width in pixels.
   */
  width: ({ tileSize, tilesX }): number => {
    return tileSize * tilesX;
  }
};
