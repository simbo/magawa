import { createContext } from 'preact';
import { Store } from 'small-store';

import {
  DEFAULT_GAME_DIFFICULTY,
  GameDifficulty,
  GameDifficultySettings,
  gameDifficultySettings
} from '../../lib/game-difficulty';
import { GameStatus } from '../../lib/game-status';
import { storage } from '../../lib/storage';

import { GameAction, GameActionPayloads, gameActions } from './game-actions';
import { gameEffects } from './game-effects';
import { GameState } from './game-state.interface';

/**
 * Restores saved settings over explicit defaults before constructing the initial state.
 * The assertion describes the fields guaranteed by those defaults.
 */
const {
  player,
  difficulty,
  difficultySettings: { tilesX, tilesY, minesCount }
} = storage.get({
  player: null,
  difficulty: DEFAULT_GAME_DIFFICULTY,
  difficultySettings: gameDifficultySettings[DEFAULT_GAME_DIFFICULTY]
}) as { player: string | null; difficulty: GameDifficulty; difficultySettings: GameDifficultySettings };

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

/**
 * Shared store combining initial preferences, state transitions, and follow-up effects.
 */
export const gameStore = new Store<GameState, GameAction, GameActionPayloads>(initialState, gameActions, gameEffects);

/**
 * Preact context through which components read the latest game state.
 */
export const gameStoreContext = createContext(initialState);
