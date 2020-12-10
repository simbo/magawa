import { GameFinalStatus, GameStatus } from '../../lib/game-status.enum';
import { Selectors } from '../store';
import { GameState } from './game-state.interface';

export enum GameSelector {
  Player = 'player',
  IsRunning = 'isRunning',
  IsPaused = 'isPaused',
  IsFinished = 'isFinished',
  IsClosed = 'isClosed',
  IsWon = 'isWon',
  Width = 'width'
}

export const gameSelectors: Selectors<GameState, GameSelector> = {
  [GameSelector.Player]: ({ player }): string | null => {
    return player;
  },

  [GameSelector.IsRunning]: ({ status }): boolean => {
    return status === GameStatus.Running;
  },

  [GameSelector.IsPaused]: ({ status }): boolean => {
    return status === GameStatus.Paused;
  },

  [GameSelector.IsFinished]: ({ status }): boolean => {
    return status === GameStatus.Finished;
  },

  [GameSelector.IsClosed]: ({ status }): boolean => {
    return status === GameStatus.Closed;
  },

  [GameSelector.IsWon]: ({ finalStatus }): boolean => {
    return finalStatus === GameFinalStatus.Won;
  },

  [GameSelector.Width]: ({ tileSize, tilesX }): number => {
    return tileSize * tilesX;
  }
};
