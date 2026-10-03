import { afterEach, expect, test, vi } from 'vitest';

const { normalizeHashPath } = await import('./hash-path');

test('recognizes app routes with trailing slashes and query parameters', () => {
  for (const path of ['/game', '/highscores', '/about']) {
    for (const suffix of ['', '/', '//', '?foo=bar', '/?foo=bar', '?next=/game/']) {
      expect(normalizeHashPath(`#${path}${suffix}`)).toBe(path);
    }
  }
});

test('defaults empty paths to home without turning unknown paths into known routes', () => {
  for (const hash of ['', '#', '#/', '#///', '#/?foo=bar', '#?foo=bar']) {
    expect(normalizeHashPath(hash)).toBe('/');
  }
  expect(normalizeHashPath('#/unknown/?foo=bar')).toBe('/unknown');
  expect(normalizeHashPath('#/about/more/')).toBe('/about/more');
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
