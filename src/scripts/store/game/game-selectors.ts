import { Selectors } from 'small-store';

import { GameFinalStatus, GameStatus } from '../../lib/game-status';

import { GameState } from './game-state.interface';

export const gameSelectors: Selectors<GameState> = {
  player: ({ player }): string | null => {
    return player;
  },

  isRunning: ({ status }): boolean => {
    return status === GameStatus.Running;
  },

  isPaused: ({ status }): boolean => {
    return status === GameStatus.Paused;
  },

  isFinished: ({ status }): boolean => {
    return status === GameStatus.Finished;
  },

  isClosed: ({ status }): boolean => {
    return status === GameStatus.Closed;
  },

  isWon: ({ finalStatus }): boolean => {
    return finalStatus === GameFinalStatus.Won;
  },

  width: ({ tileSize, tilesX }): number => {
    return tileSize * tilesX;
  }
};
