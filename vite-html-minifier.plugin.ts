import { minify as minifyHtml } from 'html-minifier-terser';
import type { Plugin } from 'vite';

/**
 * Minifies generated HTML while preserving the site's whitespace behavior.
 *
 * @returns The build-only HTML minifier plugin.
 */
export function htmlMinifierPlugin(): Plugin {
  return {
    name: 'html-minifier',
    apply: 'build',
    enforce: 'post',
    async generateBundle(_outputOptions, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type === 'asset' && file.fileName.endsWith('.html')) {
          file.source = await minifyHtml(file.source.toString(), {
            collapseWhitespace: true,
            conservativeCollapse: true,
            preserveLineBreaks: true,
            removeComments: true,
          });
        }
      }
    },
  };
}
