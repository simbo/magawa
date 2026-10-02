import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createJiti } from 'jiti';

/** Loads the route parser independently of JSX and browser rendering. */
const jiti = createJiti(import.meta.url);
const { normalizeHashPath } = await jiti.import('../src/scripts/lib/hash-path.ts');

test('recognizes app routes with trailing slashes and query parameters', () => {
  for (const path of ['/game', '/highscores', '/about']) {
    for (const suffix of ['', '/', '//', '?foo=bar', '/?foo=bar', '?next=/game/']) {
      assert.equal(normalizeHashPath(`#${path}${suffix}`), path);
    }
  }
});

test('defaults empty paths to home without turning unknown paths into known routes', () => {
  for (const hash of ['', '#', '#/', '#///', '#/?foo=bar', '#?foo=bar']) {
    assert.equal(normalizeHashPath(hash), '/');
  }
  assert.equal(normalizeHashPath('#/unknown/?foo=bar'), '/unknown');
  assert.equal(normalizeHashPath('#/about/more/'), '/about/more');
});
