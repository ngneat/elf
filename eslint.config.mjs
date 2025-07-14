import nx from '@nx/eslint-plugin';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['**/dist', '**/node_modules']),
  {
    plugins: {
      '@nx': nx,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': ['off'],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [nx.configs['flat/typescript']],
    rules: {
      '@typescript-eslint/no-explicit-any': ['off'],
      '@typescript-eslint/no-non-null-assertion': ['off'],
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    extends: [nx.configs['flat/javascript']],
    rules: {},
  },
]);
