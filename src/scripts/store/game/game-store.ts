import { gameDifficultySettings } from '../../lib/game-difficulty-settings';
import { GameDifficulty } from '../../lib/game-difficulty.enum';
import { GameStatus } from '../../lib/game-status.enum';
import { Store } from '../store';
import { GameState } from './game-state';

const difficulty = GameDifficulty.Medium;
const { tilesX, tilesY, minesCount } = gameDifficultySettings[difficulty];

const initialState: GameState = {
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

export const gameStore = new Store<GameState>(initialState);
