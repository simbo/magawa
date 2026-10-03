import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createJiti } from 'jiti';
import lzString from 'lz-string';

/** Loads the highscore client without browser rendering. */
const jiti = createJiti(import.meta.url);
const { addHighscore } = await jiti.import('../src/scripts/lib/highscores.ts');
const { GameDifficulty } = await jiti.import('../src/scripts/lib/game-difficulty.ts');

Object.defineProperty(globalThis, 'APP_API_URL', { value: 'https://example.com/api/' });

for (const status of [200, 201]) {
  test(`saves a highscore from an HTTP ${status} response`, async context => {
    const highscore = { id: 'saved-score', rank: 3, player: 'Player', date: '2026-10-03T12:00:00Z', time: 12345 };
    const fetch = context.mock.method(
      globalThis,
      'fetch',
      async () => new Response(JSON.stringify(highscore), { status }),
    );

    assert.deepEqual(await addHighscore(GameDifficulty.Easy, 'Player', 12345), highscore);
    assert.equal(fetch.mock.callCount(), 1);
    const [url, options] = fetch.mock.calls[0].arguments;
    assert.equal(url, `https://example.com/api/highscores/${GameDifficulty.Easy}`);
    assert.equal(options.method, 'post');
    assert.equal(options.headers['Content-Type'], 'application/json;charset=utf-8');
    assert.deepEqual(JSON.parse(lzString.decompressFromUTF16(JSON.parse(options.body).data)), {
      player: 'Player',
      time: 12345,
    });
  });
}
