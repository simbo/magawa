export enum GameDifficulty {
  Easy,
  Medium,
  Hard,
  Custom
}
export interface GameDifficultySettings {
  tilesX: number;
  tilesY: number;
  minesCount: number;
}

export const DEFAULT_GAME_DIFFICULTY = GameDifficulty.Medium;

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
