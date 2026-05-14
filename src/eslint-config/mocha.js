// Mocha overlay (optional) — strengthens a few mocha-plugin defaults that ship
// via `eslint-config-oclif`. The base config is fully usable by mocha consumers
// without this overlay; importing it just bumps `mocha/no-exclusive-tests` from
// `warn` to `error` so a stray `it.only` fails CI.

export default [
  {
    files: ['test/**/*.ts', 'test/**/*.js'],
    rules: {
      'mocha/no-exclusive-tests': 'error',
    },
  },
]
