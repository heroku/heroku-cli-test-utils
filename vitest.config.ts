import {defineConfig, mergeConfig} from 'vitest/config'

import herokuVitestConfig from './src/vitest-config/index.js'

// Dogfood our shared base config (published as `@heroku-cli/test-utils/vitest-config`),
// pointing at local source to avoid a build-order dependency. Below adds only
// what's specific to this repo. The override is wrapped in `defineConfig` so it
// stays type-checked — `mergeConfig`'s second arg is otherwise `any`.
export default mergeConfig(
  herokuVitestConfig,
  defineConfig({
    test: {
      coverage: {
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
  }),
)
