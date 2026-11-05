import {mergeConfig} from 'vitest/config'

import herokuVitestConfig from './src/vitest-config/index.js'

// Dogfood our own shared base config. Downstream repos import it as
// `@heroku-cli/test-utils/vitest-config`; here we point at the local source so
// there's no build-order dependency. The base supplies coverage
// provider/include/exclude, `disableConsoleIntercept`, and the
// `workflows-repo/**` discovery exclude; below we add only what's specific to
// this repo.
export default mergeConfig(herokuVitestConfig, {
  test: {
    coverage: {
      // Extra non-shipped dirs to keep out of coverage (concatenated onto the
      // base exclude list by mergeConfig).
      exclude: ['test/**/*', 'bin/**/*', 'scripts/**/*', 'tmp/**/*', '**/*.mjs'],
      reporter: ['text-summary', 'html', 'lcov'],
      thresholds: {
        branches: 65,
        functions: 80,
        lines: 65,
        statements: 65,
      },
    },
    include: ['test/**/*.test.ts'],
    testTimeout: 360_000,
  },
})
