//  => nunjucks uses `null` for error handling

import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve as resolvePath } from 'node:path';

import { Environment, type ConfigureOptions } from 'nunjucks';
import type { HmrContext, IndexHtmlTransformContext, IndexHtmlTransformResult, Plugin } from 'vite';

export interface NunjucksPluginOptions {
  options: Partial<ConfigureOptions>;
  locals: Record<string, unknown>; // nunjucks template variables
}

const nunjucksOptions: ConfigureOptions = {
  autoescape: true,
  lstripBlocks: true,
  noCache: true,
  throwOnUndefined: true,
  trimBlocks: true,
};

/**
 * Renders HTML templates and reloads pages when their template sources change.
 *
 * @param options - Template configuration and variables.
 * @returns The Nunjucks template plugin.
 */
export default function nunjucksPlugin(options: Partial<NunjucksPluginOptions> = {}): Plugin {
  const locals = options.locals ?? {};
  const sourcePaths: string[] = [];
  return {
    name: 'nunjucks',
    enforce: 'pre',
    handleHotUpdate: (context: HmrContext): undefined | [] => {
      if (!sourcePaths.includes(context.file)) return;
      context.server.ws.send({ type: 'full-reload' });
      return [];
    },
    transformIndexHtml: {
      order: 'pre',
      handler: async (html: string, context: IndexHtmlTransformContext): Promise<IndexHtmlTransformResult> =>
        new Promise((resolve, reject) => {
          const environment = new Environment(
            {
              async: true,
              getSource: (name, callback) => {
                const path = resolvePath(dirname(context.filename), name);
                sourcePaths.push(path);
                readFile(path)
                  .then(src => {
                    callback(null, { src: src.toString(), path, noCache: !!nunjucksOptions.noCache });
                  })
                  .catch((error: unknown) => {
                    callback(error instanceof Error ? error : new Error(String(error)), null);
                  });
              },
            },
            nunjucksOptions,
          );
          const pageLocals = locals[basename(context.path)];
          environment.renderString(
            html,
            { ...locals, ...(typeof pageLocals === 'object' && pageLocals) },
            (error, rendered) => {
              if (error) reject(error);
              else if (rendered === null) reject(new Error('Nunjucks returned no rendered HTML'));
              else resolve(rendered);
            },
          );
        }),
    },
  };
}
