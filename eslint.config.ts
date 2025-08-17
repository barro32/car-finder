import js from '@eslint/js';
import next from 'eslint-config-next';
const nextConfig = (next as any).configs.recommended;

import type { Linter } from 'eslint';

// Load eslint-plugin-react for flat config plugin registration
const reactPlugin = require('eslint-plugin-react');

const config: Linter.FlatConfig[] = [
  // ignore build and dependency folders using the flat config 'ignores' entry
  { ignores: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**'] },
  js.configs.recommended,
  nextConfig,
  {
    // register plugins for flat config
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'function-declaration',
          unnamedComponents: 'function-expression',
        },
      ],
    },
  },
];

export default config;
