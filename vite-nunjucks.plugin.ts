import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve as resolvePath } from 'node:path';

import { ConfigureOptions, Environment } from 'nunjucks';
import { HmrContext, IndexHtmlTransformContext, IndexHtmlTransformResult, Plugin } from 'vite';

/**
 * Template-engine options and global or page-specific template variables.
 */
export interface NunjucksPluginOptions {
  options: Partial<ConfigureOptions>;
  locals: object; // nunjucks template variables
}

/**
 * Template defaults: escape output, trim template whitespace, avoid caching,
 * and fail when a template references an undefined variable.
 */
const nunjucksOptions: ConfigureOptions = {
  autoescape: true,
  lstripBlocks: true,
  noCache: true,
  throwOnUndefined: true,
  trimBlocks: true
};

/**
 * Creates a Vite plugin that renders HTML through Nunjucks and reloads pages when included templates change.
 *
 * @param options - Global and page-specific template variables and plugin options.
 * @returns The Nunjucks HTML-transform plugin.
 */
export default (options: Partial<NunjucksPluginOptions> = {}): Plugin => {
  const locals: object = options.locals ?? {};
  const sourcePaths: string[] = [];
  return {
    name: 'nunjucks',
    enforce: 'pre',
    /**
     * Reloads the entire page when an included template changes, suppressing normal module updates.
     */
    handleHotUpdate: (context: HmrContext): void | [] => {
      if (!sourcePaths.includes(context.file)) return;
      context.server.ws.send({ type: 'full-reload' });
      return [];
    },
    transformIndexHtml: {
      order: 'pre',
      /**
       * Renders the entry HTML with global locals and overrides for its basename.
       * Wraps Nunjucks' callback API in a promise for the Vite HTML transform hook.
       */
      handler: async (html: string, context: IndexHtmlTransformContext): Promise<IndexHtmlTransformResult | void> =>
        new Promise((resolve, reject) => {
          new Environment(
            {
              async: true,
              /**
               * Loads included templates relative to the entry HTML and tracks their paths
               * so later edits trigger full-page reloads.
               */
              getSource: (name, callback) => {
                const path = resolvePath(dirname(context.filename), name);
                sourcePaths.push(path);
                readFile(path)
                  .then(src => {
                    callback(undefined, { src: src.toString(), path, noCache: !!nunjucksOptions.noCache });
                  })
                  .catch(error => (callback as (error: Error) => void)(error));
              }
            },
            nunjucksOptions
          ).renderString(html, { ...locals, ...locals[basename(context.path)] }, (error, rendered) => {
            if (error) reject(error);
            else resolve(rendered as string);
          });
        })
    }
  };
};
