import { compressToUTF16 } from 'lz-string';

import { apiFetch, apiPost, apiUrl } from './api';
import { GameDifficulty } from './game-difficulty';

export type HighscoreGameDifficulty = GameDifficulty.Easy | GameDifficulty.Medium | GameDifficulty.Hard;

export interface HighscoresCollection {
  items: Highscore[];
  total: number;
  perPage: number;
  page: number;
  pages: number;
  previousPage?: number;
  nextPage?: number;
}

export interface Highscore {
  id: string;
  rank: number;
  player: string;
  date: Date;
  time: number;
}

interface HighscoreOptions {
  difficulty: HighscoreGameDifficulty;
  page?: number;
  player?: string;
  perPage?: number;
  rank?: number;
}

export async function getHighscores(options: HighscoreOptions): Promise<HighscoresCollection> {
  const { difficulty, player, page, perPage, rank } = { perPage: 10, ...options };
  const pathParams = ['highscores', `${difficulty}`];
  const queryParams: { [key: string]: string } = { page: `${page}`, perPage: `${perPage}` };
  if (player) {
    queryParams.player = `${player}`;
  }
  const collection = await apiFetch<HighscoresCollection>(apiUrl(pathParams, rank ? { rank: `${rank}` } : queryParams));
  return collection;
}

export async function addHighscore(
  difficulty: HighscoreGameDifficulty,
  player: string,
  time: number
): Promise<Highscore> {
  const data = compressToUTF16(JSON.stringify({ player, time }));
  const highscore = await apiPost<{ data: string }, Highscore>(apiUrl(['highscores', `${difficulty}`]), { data });
  return highscore;
}
