import {configDefaults, defineConfig} from 'vitest/config'

/**
 * Shared vitest base config for Heroku CLI repos.
 *
 * Compose it in a repo's `vitest.config.ts` with vitest's `mergeConfig` so the
 * repo can override individual options without losing the shared defaults:
 *
 * ```ts
 * import {mergeConfig} from 'vitest/config'
 * import herokuVitestConfig from '@heroku-cli/test-utils/vitest-config'
 *
 * export default mergeConfig(herokuVitestConfig, {
 *   test: {
 *     include: ['test/ **\/*.test.ts'], // this repo's test location
 *     testTimeout: 60_000,
 *     coverage: {thresholds: {lines: 80}},
 *   },
 * })
 * ```
 *
 * `mergeConfig` replaces scalars and concatenates arrays, so a repo *adds to*
 * (rather than clobbers) the shared `exclude`/coverage lists. Mirrors the
 * `@heroku-cli/test-utils/eslint-config` export.
 *
 * Deliberately left to each repo (no consensus across our repos): `include`
 * (test location varies — `test/`, `src/`, `tests/`), `testTimeout`,
 * `coverage.thresholds`, `coverage.reporter`, `setupFiles`, and `globals`.
 */
export default defineConfig({
  test: {
    coverage: {
      // Don't count tests, type decls, or build output against coverage.
      exclude: [
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        'dist/**',
        'coverage/**',
        'node_modules/**',
      ],
      // Measure the published surface; override if the repo ships from
      // elsewhere (e.g. `lib/**`).
      include: ['src/**/*.ts'],
      // v8 is what essentially every Heroku repo uses.
      provider: 'v8',
    },

    // test-utils' `runCommand`/`captureOutput` (see run-command.ts) writes to
    // `process.stdout`/`stderr` directly; vitest's console interceptor sits in
    // front of that and would swallow the bytes before our wrapper sees them.
    // Every repo using `runCommand` needs this off, so default it here. Set it
    // back to `false` in a repo that relies on vitest's console capture.
    disableConsoleIntercept: true,

    // The release workflow (heroku/npm-release-workflows) checks itself out
    // into `./workflows-repo` *inside* the consumer workspace during
    // release-validate. vitest's default `include` globs the whole tree and
    // would collect that repo's specs (which then time out), failing the
    // release. Excluding it here means every repo that extends this config
    // inherits the fix without a per-repo `include` hack — and it's
    // location-agnostic, so it works whether tests live in `test/`, `src/`, or
    // `tests/`. Mirrors the `workflows-repo/**` ignore in the shared ESLint
    // config. `dist/**` keeps compiled-test output out of discovery too.
    exclude: [...configDefaults.exclude, '**/dist/**', 'workflows-repo/**'],
  },
})
