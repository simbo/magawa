import { fileURLToPath } from 'node:url';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import htmlMinifier from 'rollup-plugin-html-minifier';
import { defineConfig, Plugin, splitVendorChunkPlugin, UserConfig } from 'vite';

import packageJson from './package.json';
import nunjucksPlugin from './vite-nunjucks.plugin';

interface Locals {
  [key: string]: string | boolean | number;
}

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  const mode = command === 'build' ? 'production' : 'development';

  const port = 1234;

  const locals: Locals = {
    APP_IS_PROD: mode === 'production',
    APP_IS_DEV: mode === 'development',
    APP_VERSION: packageJson.version,
    APP_URI: mode === 'production' ? '//simbo.codes/magawa/' : `//localhost:${port}/magawa/`
  };

  const config: UserConfig = {
    base: '/magawa/',
    appType: 'mpa',
    root: 'src',
    publicDir: 'static',
    mode,

    server: { port },

    build: {
      assetsDir: 'assets',
      outDir: '../magawa',
      emptyOutDir: true,
      target: 'es2022',
      sourcemap: true,
      rollupOptions: {
        input: {
          index: fileURLToPath(new URL('src/index.html', import.meta.url))
        },
        plugins: [
          htmlMinifier({
            options: {
              collapseWhitespace: true,
              conservativeCollapse: true,
              preserveLineBreaks: true,
              removeComments: true
            }
          }) as unknown as Plugin
        ]
      }
    },

    plugins: [nunjucksPlugin({ locals }), splitVendorChunkPlugin()],

    define: Object.entries(locals).reduce((obj, [key, value]) => {
      if (['string', 'number', 'boolean'].includes(typeof value)) {
        obj[key] = JSON.stringify(value);
      }
      return obj;
    }, {} as Locals),

    css: {
      preprocessorOptions: {
        sass: {
          style: 'expanded',
          sourceMap: true
        }
      },
      transformer: 'postcss',
      postcss: {
        plugins: [autoprefixer({ remove: false }), cssnano({ preset: ['default', { zindex: false }] })]
      },
      devSourcemap: true
    }
  };

  return config;
});
