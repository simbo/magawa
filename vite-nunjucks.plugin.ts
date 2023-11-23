import { readFile } from 'node:fs/promises';
import { basename, dirname, resolve as resolvePath } from 'node:path';

import { ConfigureOptions, Environment } from 'nunjucks';
import { HmrContext, IndexHtmlTransformContext, IndexHtmlTransformResult, Plugin } from 'vite';

export interface NunjucksPluginOptions {
  options: Partial<ConfigureOptions>;
  locals: object; // nunjucks template variables
}

const nunjucksOptions: ConfigureOptions = {
  autoescape: true,
  lstripBlocks: true,
  noCache: true,
  throwOnUndefined: true,
  trimBlocks: true
};

export default (options: Partial<NunjucksPluginOptions> = {}): Plugin => {
  const locals: object = options.locals ?? {};

  const sourcePaths: string[] = [];

  return {
    name: 'nunjucks',
    enforce: 'pre',
    handleHotUpdate: (context: HmrContext): void | [] => {
      console.log('HMR', context.file);
      if (sourcePaths.indexOf(context.file)) return;
      context.server.ws.send({ type: 'full-reload' });
      console.log('FULL RELOAD');
      return [];
    },
    transformIndexHtml: {
      order: 'pre',
      handler: async (html: string, context: IndexHtmlTransformContext): Promise<IndexHtmlTransformResult | void> =>
        new Promise((resolve, reject) => {
          new Environment(
            {
              async: true,
              getSource: (name, callback) => {
                const path = resolvePath(dirname(context.filename), name);
                readFile(path)
                  .then(src => {
                    console.log(path);
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
