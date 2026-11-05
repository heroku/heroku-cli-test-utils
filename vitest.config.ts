import {mergeConfig} from 'vitest/config'

import herokuVitestConfig from './src/vitest-config/index.js'

// Dogfood our shared base config (published as `@heroku-cli/test-utils/vitest-config`),
// pointing at local source to avoid a build-order dependency. Below adds only
// what's specific to this repo.
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
