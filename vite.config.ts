import { fileURLToPath } from 'node:url';

import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import { defineConfig, type UserConfig } from 'vite';

import packageJson from './package.json' with { type: 'json' };
import { htmlMinifierPlugin } from './vite-html-minifier.plugin.ts';
import nunjucksPlugin from './vite-nunjucks.plugin.ts';

/**
 * Primitive template variables also exposed as compile-time app constants.
 */
type Locals = Record<string, string | boolean | number>;

// https://vitejs.dev/config/

/**
 * Builds the development or production Vite configuration, template variables, and CSS processing pipeline.
 */
export default defineConfig(({ command }) => {
  const mode = command === 'build' ? 'production' : 'development';

  const port = 1234;

  const locals: Locals = {
    APP_IS_PROD: mode === 'production',
    APP_IS_DEV: mode === 'development',
    APP_VERSION: packageJson.version,
    APP_URI: mode === 'production' ? '//simbo.de/magawa/' : `//localhost:${port}/magawa/`,
    APP_API_URL: mode === 'production' ? 'https://api.srvkist.net/magawa' : 'http://localhost:3000/magawa',
  };

  const config: UserConfig = {
    base: '/magawa/',
    appType: 'mpa',
    root: 'src',
    publicDir: 'static',
    mode,

    server: { port },

    resolve: {
      alias: {
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        react: 'preact/compat',
      },
    },

    build: {
      assetsDir: 'assets',
      outDir: '../magawa',
      emptyOutDir: true,
      target: 'es2022',
      sourcemap: true,
      rolldownOptions: {
        input: {
          index: fileURLToPath(new URL('src/index.html', import.meta.url)),
        },
      },
    },

    plugins: [nunjucksPlugin({ locals }), htmlMinifierPlugin()],

    /**
     * Serializes primitive locals as JavaScript literals for compile-time replacement.
     * The same values are supplied to the HTML template plugin.
     */
    define: Object.entries(locals).reduce<Locals>((obj, [key, value]) => {
      if (['string', 'number', 'boolean'].includes(typeof value)) {
        obj[key] = JSON.stringify(value);
      }
      return obj;
    }, {}),

    css: {
      preprocessorOptions: {
        scss: {
          style: 'expanded',
        },
      },
      transformer: 'postcss',
      postcss: {
        plugins: [autoprefixer({ remove: false }), cssnano({ preset: ['default', { zindex: false }] })],
      },
      devSourcemap: true,
    },
  };

  return config;
});
