import { GameDifficulty } from './game-difficulty';

/**
 * Builds difficulty labels from TypeScript's numeric enum entries.
 * Numeric enums expose both name-to-number and number-to-name entries; numeric keys
 * in this map provide the labels used by formatDifficulty.
 */
const difficultiesMap: Record<GameDifficulty, string> = Object.entries(GameDifficulty).reduce(
  (map, [key, value]) => ({ ...map, [value]: key }),
  {} as unknown as Record<GameDifficulty, string>,
);

/**
 * Returns the enum label for a difficulty identifier.
 *
 * @param difficulty - Difficulty to display.
 * @returns The corresponding difficulty label.
 */
export function formatDifficulty(difficulty: GameDifficulty): string {
  return difficultiesMap[difficulty];
}
