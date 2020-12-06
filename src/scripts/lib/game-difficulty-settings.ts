import { GameDifficultySettings } from './game-difficulty-settings.interface';
import { GameDifficulty } from './game-difficulty.enum';

export type GameDifficultySettingsMap = {
  [key in GameDifficulty]: GameDifficultySettings;
};

export const gameDifficultySettings: GameDifficultySettingsMap = {
  [GameDifficulty.Easy]: {
    tilesX: 8,
    tilesY: 8,
    minesCount: 10
  },
  [GameDifficulty.Medium]: {
    tilesX: 16,
    tilesY: 16,
    minesCount: 40
  },
  [GameDifficulty.Hard]: {
    tilesX: 30,
    tilesY: 16,
    minesCount: 99
  },
  [GameDifficulty.Custom]: {
    tilesX: 30,
    tilesY: 24,
    minesCount: 668
  }
};
