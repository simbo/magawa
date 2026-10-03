beforeEach(() => vi.resetModules());

/**
 * Triggers the browser image load or error callback without external requests.
 *
 * @param fail
 */
function images(fail = false) {
  const sources: string[] = [];
  vi.stubGlobal(
    'Image',
    class extends EventTarget {
      public set src(value: string) {
        sources.push(value);
        globalThis.queueMicrotask(() => this.dispatchEvent(new Event(fail ? 'error' : 'load')));
      }
    },
  );
  return sources;
}

test('preloads both resources and retrieves cached assets', async () => {
  const sources = images();
  const { getPaintAsset, PaintResourceName } = await import('./paint-assets');
  expect(sources).toHaveLength(2);
  expect(getPaintAsset(PaintResourceName.Boom).src).toContain('/icons/boom.png');
  expect(getPaintAsset(PaintResourceName.Flag).src).toContain('/icons/flag.png');
  expect(getPaintAsset(PaintResourceName.Flag)).toBe(getPaintAsset(PaintResourceName.Flag));
  expect(() => getPaintAsset('missing' as typeof PaintResourceName.Boom)).toThrow('not found');
});

test('rejects module loading when an image fails', async () => {
  images(true);
  await expect(import('./paint-assets')).rejects.toThrow('Failed to load image');
});
