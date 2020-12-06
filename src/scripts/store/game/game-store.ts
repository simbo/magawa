import { GameDifficulty } from '../../lib/game-difficulty.enum';
import { GameStatus } from '../../lib/game-status.enum';
import { Store } from '../store';
import { GameState } from './game-state';

const initialState: GameState = {
  status: GameStatus.Closed,
  finalStatus: null,
  startedAt: null,
  pausedAt: null,
  finishedAt: null,
  difficulty: GameDifficulty.Easy,
  tileSize: 40,
  tilesX: 8,
  tilesY: 8,
  minesCount: 10,
  flagsCount: 0
};

export const gameStore = new Store<GameState>(initialState);
