// JS shim to load the TypeScript ESLint flat config for CLI compatibility
const { default: config } = require('./eslint.config.ts');
module.exports = config;
