/**
 * Numeric identifiers for preset and custom board difficulties.
 */
export enum GameDifficulty {
  Easy,
  Medium,
  Hard,
  Custom
}
/**
 * Board width and height in tiles and the total number of mines.
 */
export interface GameDifficultySettings {
  tilesX: number;
  tilesY: number;
  minesCount: number;
}

/**
 * Difficulty selected when no preference has been saved.
 */
export const DEFAULT_GAME_DIFFICULTY = GameDifficulty.Medium;

/**
 * Board settings indexed by every supported difficulty.
 */
export type GameDifficultySettingsMap = {
  [key in GameDifficulty]: GameDifficultySettings;
};

/**
 * Preset board sizes; the custom entry also supplies the form's upper limits.
 */
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
