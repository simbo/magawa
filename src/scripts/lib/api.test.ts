import { apiFetch, apiPost, apiUrl } from './api';
import { GameDifficulty } from './game-difficulty';
import { getHighscores } from './highscores';

test('joins API paths and encodes filters without losing the base directory', () => {
  expect(apiUrl(['highscores', '1'], { player: 'A *?', page: '2' })).toBe(
    'https://example.com/api/highscores/1?player=A+*%3F&page=2',
  );
  expect(apiUrl('health')).toBe('https://example.com/api/health');
});

test('forwards fetch options and serializes POST payloads', async () => {
  const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{"ok":true}'));
  expect(await apiPost(apiUrl('result'), { time: 123 })).toEqual({ ok: true });
  expect(fetch).toHaveBeenCalledWith(apiUrl('result'), {
    method: 'post',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: '{"time":123}',
  });
});

test('propagates network and malformed JSON errors', async () => {
  vi.spyOn(globalThis, 'fetch')
    .mockRejectedValueOnce(new Error('offline'))
    .mockResolvedValueOnce(new Response('invalid'));
  await expect(apiFetch(apiUrl('health'))).rejects.toThrow('offline');
  await expect(apiFetch(apiUrl('health'))).rejects.toThrow();
});

test('requests default pagination, custom player filters and rank lookup', async () => {
  const fetch = vi.spyOn(globalThis, 'fetch').mockImplementation(async () => new Response('{"items":[]}'));
  await getHighscores({ difficulty: GameDifficulty.Easy });
  expect(fetch.mock.calls[0][0]).toBe('https://example.com/api/highscores/0?page=1&perPage=10');
  await getHighscores({ difficulty: GameDifficulty.Hard, page: 2, perPage: 20, player: 'Player*' });
  expect(fetch.mock.calls[1][0]).toBe('https://example.com/api/highscores/2?page=2&perPage=20&player=Player*');
  await getHighscores({ difficulty: GameDifficulty.Medium, rank: 4, page: 2, player: 'ignored' });
  expect(fetch.mock.calls[2][0]).toBe('https://example.com/api/highscores/1?rank=4');
});
