import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    APP_API_URL: JSON.stringify('https://example.com/api/'),
    APP_VERSION: JSON.stringify('test'),
    APP_IS_DEV: false,
    APP_IS_PROD: false,
    'import.meta.env.DEV': 'false',
  },
  oxc: { jsx: { runtime: 'automatic', importSource: 'preact' } },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}', '*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'html', 'lcov'],
      thresholds: { statements: 95, branches: 90, functions: 95, lines: 95 },
      include: ['src/scripts/**/*.{ts,tsx}', 'vite-*.plugin.ts'],
      exclude: [
        '**/*.test.{ts,tsx}',
        'src/scripts/**/*.{type,types,interface,interfaces,enum}.ts',
        'src/scripts/main.tsx',
      ],
    },
  },
});
