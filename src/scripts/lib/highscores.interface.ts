import { GameDifficulty } from './game-difficulty';

export type HighscoreGameDifficulty = GameDifficulty.Easy | GameDifficulty.Medium | GameDifficulty.Hard;

export interface HighscoresEntry {
  rank?: number;
  id: string;
  player: string;
  date: Date;
  time: number;
  difficulty: HighscoreGameDifficulty;
}
export type HighscoresList = HighscoresEntry[];

export type HighscoresCompressed = [string];

export type HighscoresByDifficulty = {
  [key in HighscoreGameDifficulty]: HighscoresList;
};

export type Highscores = HighscoresByDifficulty & { updated: Date };

export interface HighscoresForDifficulty {
  list: HighscoresList;
  updated: Date;
}
