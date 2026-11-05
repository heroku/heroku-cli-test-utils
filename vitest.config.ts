import defineHerokuVitestConfig from './src/vitest-config/index.js'

// Dogfood our shared config factory (published as
// `@heroku-cli/test-utils/vitest-config`), pointing at local source to avoid a
// build-order dependency. We pass only what's specific to this repo; the factory
// merges it over the shared defaults.
export default defineHerokuVitestConfig({
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
})
