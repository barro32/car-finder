const js = require('@eslint/js');
const next = require('eslint-config-next');
const nextConfig = (next && next.configs && next.configs.recommended) || {};
const reactPlugin = require('eslint-plugin-react');

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  // ignore build and dependency folders using the flat config 'ignores' entry
  { ignores: ['.next/**', 'node_modules/**', 'dist/**', 'coverage/**'] },
  js.configs.recommended,
  nextConfig,
  {
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

module.exports = config;
