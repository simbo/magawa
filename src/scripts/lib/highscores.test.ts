import lzString from 'lz-string';

import { GameDifficulty } from './game-difficulty';
import { addHighscore } from './highscores';

test.each([200, 201])('saves a highscore from HTTP %s with a compressed payload', async status => {
  const highscore = { id: 'saved-score', rank: 3, player: 'Player', date: '2026-10-03T12:00:00Z', time: 12_345 };
  const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(Response.json(highscore, { status }));
  expect(await addHighscore(GameDifficulty.Easy, 'Player', 12_345)).toEqual(highscore);
  expect(fetch).toHaveBeenCalledOnce();
  const [url, options] = fetch.mock.calls[0];
  expect(url).toBe('https://example.com/api/highscores/0');
  expect(options).toMatchObject({ method: 'post', headers: { 'Content-Type': 'application/json;charset=utf-8' } });
  const payload = JSON.parse(options?.body as string) as { data: string };
  expect(JSON.parse(lzString.decompressFromUTF16(payload.data))).toEqual({ player: 'Player', time: 12_345 });
});
