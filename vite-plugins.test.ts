// @vitest-environment node
import { expect, test } from 'vitest';

import { htmlMinifierPlugin } from './vite-html-minifier.plugin.ts';

test('minifies only HTML assets and leaves other bundle entries untouched', async () => {
  const plugin = htmlMinifierPlugin();
  const html = { type: 'asset', fileName: 'index.html', source: '<!-- remove --><div>   Text   </div>' };
  const css = { type: 'asset', fileName: 'main.css', source: '/* keep */' };
  const chunk = { type: 'chunk', fileName: 'main.js', code: '// keep' };
  const generate = plugin.generateBundle as (options: object, bundle: object) => Promise<void>;
  await generate({}, { html, css, chunk });
  expect(html.source).not.toContain('remove');
  expect(html.source).toContain('Text');
  expect(css.source).toBe('/* keep */');
  expect(chunk.code).toBe('// keep');
});
