import { configs, globals } from '@simbo/eslint-config';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['**/dist/', '**/coverage/', '**/docs/', '**/magawa/']),
  {
    files: ['*.ts'],
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        project: ['./tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [configs.node.recommended],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Null is part of the persisted preferences and game lifecycle contract.
      'unicorn/no-null': 'off',
      // Drawing proportions, durations, and board presets use literal numeric values.
      '@typescript-eslint/no-magic-numbers': 'off',
      // Preserve the existing board algorithms until their dedicated migration.
      'unicorn/prefer-early-return': 'off',
      'unicorn/prefer-simple-condition-first': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/prefer-literal-enum-member': 'off',
      // Cached module state implements the developer-mode keyboard sequence.
      'unicorn/no-top-level-assignment-in-function': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        project: ['./tsconfig.browser.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [configs.browser.recommended],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Null is part of the persisted preferences and game lifecycle contract.
      'unicorn/no-null': 'off',
      // Drawing proportions, durations, and board presets use literal numeric values.
      '@typescript-eslint/no-magic-numbers': 'off',
      // Preserve the existing board algorithms until their dedicated migration.
      'unicorn/prefer-early-return': 'off',
      'unicorn/prefer-simple-condition-first': 'off',
      '@typescript-eslint/prefer-for-of': 'off',
      '@typescript-eslint/prefer-literal-enum-member': 'off',
      // Cached module state implements the developer-mode keyboard sequence.
      'unicorn/no-top-level-assignment-in-function': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, ...globals.vitest },
      parserOptions: {
        project: ['./tsconfig.tests.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    extends: [configs.browser.recommended],
    rules: {
      // Test fixtures intentionally use literal values, nullable lifecycle fields and assertions.
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      // Mock exports retain production names; spies are asserted without invoking methods.
      '@typescript-eslint/naming-convention': 'off',
      '@typescript-eslint/unbound-method': 'off',
      // Helpers infer their types; tests also exercise deliberately invalid enum inputs.
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unsafe-enum-assignment': 'off',
      'unicorn/max-nested-calls': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-param-description': 'off',
      'unicorn/no-null': 'off',
    },
  },
]);
