import lzString from 'lz-string';

beforeEach(() => {
  vi.resetModules();
  globalThis.localStorage.clear();
});

test('merges preferences with defaults and preserves unrelated fields on disk', async () => {
  const { storage } = await import('./storage');
  expect(storage.get({ player: 'Default', devMode: false })).toEqual({ player: 'Default', devMode: false });
  storage.set({ player: 'Player' });
  storage.set({ devMode: true });
  expect(storage.get({ player: 'Default' })).toEqual({ player: 'Player', devMode: true });
  expect(JSON.parse(lzString.decompressFromUTF16(globalThis.localStorage.getItem('magawa_data')!))).toEqual({
    player: 'Player',
    devMode: true,
  });
  expect(globalThis.localStorage.getItem('magawa_dataVersion')).toBe('"1"');
  vi.resetModules();
  expect((await import('./storage')).storage.get({})).toEqual({ player: 'Player', devMode: true });
});

test.each(['"0"', '"2"'])('invalidates incompatible data version %s', async version => {
  globalThis.localStorage.setItem('magawa_dataVersion', version);
  globalThis.localStorage.setItem('magawa_data', lzString.compressToUTF16('{"player":"Old"}'));
  expect((await import('./storage')).storage.get({ player: null })).toEqual({ player: null });
  expect(globalThis.localStorage.getItem('magawa_data')).toBeNull();
});

test.each(['', 'not compressed', lzString.compressToUTF16('invalid JSON')])(
  'recovers from missing or corrupt data %s',
  async data => {
    globalThis.localStorage.setItem('magawa_data', data);
    globalThis.localStorage.setItem('magawa_dataVersion', 'invalid JSON');
    expect((await import('./storage')).storage.get({ devMode: false })).toEqual({ devMode: false });
  },
);
