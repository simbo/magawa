import { createContext } from 'preact';

import {
  DEFAULT_GAME_DIFFICULTY,
  gameDifficultySettings
} from '../../lib/game-difficulty-settings';
import { GameStatus } from '../../lib/game-status.enum';
import { storage } from '../../lib/storage';
import { Store } from '../store';
import { GameAction, GameActionPayload, gameActions } from './game-actions';
import { GameState } from './game-state.interface';

const {
  player,
  difficulty,
  difficultySettings: { tilesX, tilesY, minesCount }
} = storage.get({
  player: null,
  difficulty: DEFAULT_GAME_DIFFICULTY,
  difficultySettings: gameDifficultySettings[DEFAULT_GAME_DIFFICULTY]
});

const initialState: GameState = {
  player,
  status: GameStatus.Closed,
  finalStatus: null,
  startedAt: null,
  pausedAt: null,
  finishedAt: null,
  difficulty,
  tileSize: 40,
  tilesX,
  tilesY,
  minesCount,
  flagsCount: 0
};

export const gameStore = new Store<GameState, GameAction, GameActionPayload>(
  initialState,
  gameActions
);

export const GameStoreContext = createContext(initialState);
