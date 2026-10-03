// @vitest-environment node
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { HmrContext, IndexHtmlTransformContext, Plugin } from 'vite';
import { expect, test, vi } from 'vitest';

import { htmlMinifierPlugin } from './vite-html-minifier.plugin.ts';
import nunjucksPlugin from './vite-nunjucks.plugin.ts';

/**
 * Retrieves the configured HTML transform without requiring a running Vite server.
 *
 * @param plugin
 */
function transform(plugin: Plugin) {
  const hook = plugin.transformIndexHtml as {
    handler: (html: string, context: IndexHtmlTransformContext) => Promise<string>;
  };
  return hook.handler;
}

test('renders globals and page-specific locals, escapes markup and rejects undefined variables', async () => {
  const render = transform(nunjucksPlugin({ locals: { title: 'Global', 'index.html': { title: '<Page>' } } }));
  const context = { path: '/index.html', filename: '/tmp/index.html' } as IndexHtmlTransformContext;
  expect(await render('<h1>{{ title }}</h1>', context)).toBe('<h1>&lt;Page&gt;</h1>');
  await expect(render('{{ missing }}', context)).rejects.toThrow();
});

test('loads relative template includes, reloads watched sources and reports missing files', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'magawa-test-'));
  try {
    await writeFile(join(directory, 'partial.html'), '<p>{{ message }}</p>');
    const plugin = nunjucksPlugin({ locals: { message: 'Included' } });
    const context = { path: '/index.html', filename: join(directory, 'index.html') } as IndexHtmlTransformContext;
    expect(await transform(plugin)('{% include "partial.html" %}', context)).toBe('<p>Included</p>');
    const send = vi.fn();
    const hotUpdate = plugin.handleHotUpdate as (context: HmrContext) => unknown;
    expect(
      hotUpdate({ file: join(directory, 'other.html'), server: { ws: { send } } } as unknown as HmrContext),
    ).toBeUndefined();
    expect(send).not.toHaveBeenCalled();
    expect(
      hotUpdate({ file: join(directory, 'partial.html'), server: { ws: { send } } } as unknown as HmrContext),
    ).toEqual([]);
    expect(send).toHaveBeenCalledWith({ type: 'full-reload' });
    await expect(transform(plugin)('{% include "missing.html" %}', context)).rejects.toThrow();
  } finally {
    await rm(directory, { recursive: true });
  }
});

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
