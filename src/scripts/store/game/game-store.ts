import { createContext } from 'preact';
import { Store } from 'small-store';

import { DEFAULT_GAME_DIFFICULTY, gameDifficultySettings } from '../../lib/game-difficulty';
import { GameStatus } from '../../lib/game-status';
import { storage } from '../../lib/storage';

import { GameAction, GameActionPayloads, gameActions } from './game-actions';
import { gameEffects } from './game-effects';
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

export const gameStore = new Store<GameState, GameAction, GameActionPayloads>(initialState, gameActions, gameEffects);

export const gameStoreContext = createContext(initialState);
