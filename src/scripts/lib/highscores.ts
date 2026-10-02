import { compressToUTF16 } from 'lz-string';

import { apiFetch, apiPost, apiUrl } from './api';
import type { GameDifficulty } from './game-difficulty';

/**
 * Preset difficulties accepted by the leaderboard; custom boards are excluded.
 */
export type HighscoreGameDifficulty = GameDifficulty.Easy | GameDifficulty.Medium | GameDifficulty.Hard;

/**
 * Leaderboard entries and pagination metadata returned by the API.
 */
export interface HighscoresCollection {
  items: Highscore[];
  total: number;
  perPage: number;
  page: number;
  pages: number;
  previousPage?: number;
  nextPage?: number;
}

/**
 * One ranked result; time is measured in milliseconds and date may arrive as JSON text.
 */
export interface Highscore {
  id: string;
  rank: number;
  player: string;
  date: Date;
  time: number;
}

/**
 * Difficulty, pagination, player filter, or target rank for a leaderboard request.
 */
interface HighscoreOptions {
  difficulty: HighscoreGameDifficulty;
  page?: number;
  player?: string;
  perPage?: number;
  rank?: number;
}

/**
 * Requests leaderboard entries using pagination and player filters or a target rank.
 * A truthy rank selects the rank query instead of pagination and player parameters.
 *
 * @param options - Difficulty and filters for the leaderboard request.
 * @returns Entries and pagination metadata.
 */
export async function getHighscores(options: HighscoreOptions): Promise<HighscoresCollection> {
  const { difficulty, player, page, perPage, rank } = { perPage: 10, ...options };
  const pathParams = ['highscores', String(difficulty)];
  const queryParams: Record<string, string> = { page: String(page ?? 1), perPage: String(perPage) };
  if (player) {
    queryParams.player = player;
  }
  const collection = await apiFetch<HighscoresCollection>(
    apiUrl(pathParams, rank ? { rank: String(rank) } : queryParams),
  );
  return collection;
}

/**
 * Submits a result as compressed JSON in the API's data field.
 *
 * @param difficulty - Preset difficulty of the completed game.
 * @param player - Player name associated with the result.
 * @param time - Playing time in milliseconds, excluding pauses.
 * @returns The saved ranked result.
 */
export async function addHighscore(
  difficulty: HighscoreGameDifficulty,
  player: string,
  time: number,
): Promise<Highscore> {
  const data = compressToUTF16(JSON.stringify({ player, time }));
  const highscore = await apiPost<Highscore>(apiUrl(['highscores', String(difficulty)]), { data });
  return highscore;
}
