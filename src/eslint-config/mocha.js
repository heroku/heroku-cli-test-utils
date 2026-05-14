// Mocha overlay — re-enables mocha-plugin rules disabled in the base config.
// Apply on top of the base config in mocha-based repos.

export default [
  {
    files: ['test/**/*.ts', 'test/**/*.js'],
    rules: {
      'mocha/no-exclusive-tests': 'error',
      'mocha/no-skipped-tests': 'warn',
    },
  },
]
