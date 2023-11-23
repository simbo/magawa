import { GameDifficulty } from './game-difficulty';

const difficultiesMap: { [key in GameDifficulty]: string } = Object.entries(GameDifficulty).reduce(
  (map, [key, value]) => ({ ...map, [value]: key }),
  {} as unknown as { [key in GameDifficulty]: string }
);

export function formatDifficulty(difficulty: GameDifficulty): string {
  return difficultiesMap[difficulty];
}
