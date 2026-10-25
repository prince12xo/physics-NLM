const js = require('@eslint/js');
const globals = require('globals');

// Browser files are classic scripts that share one global scope, loaded in order by index.html.
const sharedGlobals = Object.fromEntries(
  [
    'PHYSICS',
    'TRAIL',
    'VECTOR_DISPLAY',
    'ROCK_LAYOUT',
    'SUN_LAYOUT',
    'PALETTE',
    'Rock',
    'resolveCollisions',
    'measureSystem',
    'emitTrail',
    'advanceParticles',
    'drawScenery',
    'drawParticles',
    'drawRock',
    'drawAimGuide',
    'Slingshot',
  ].map((name) => [name, 'readonly']),
);

module.exports = [
  js.configs.recommended,
  {
    files: ['js/**/*.js'],
    languageOptions: {
      sourceType: 'script',
      globals: { ...globals.browser, ...sharedGlobals },
    },
    rules: {
      'no-unused-vars': ['error', { vars: 'local' }],
      'no-redeclare': ['error', { builtinGlobals: false }],
    },
  },
  {
    files: ['eslint.config.js', 'tests/**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
];
