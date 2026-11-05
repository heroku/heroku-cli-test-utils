import {
  configDefaults,
  coverageConfigDefaults,
  defineConfig,
  type ViteUserConfig,
} from 'vitest/config'

/**
 * Shared vitest base config for Heroku CLI repos.
 *
 * Compose it in a repo's `vitest.config.ts` with vitest's `mergeConfig`, and
 * wrap the repo's own overrides in `defineConfig(...)` so they stay type-checked:
 *
 *   mergeConfig(herokuVitestConfig, defineConfig({test: {...}}))
 *
 * See the "Vitest Configuration" section of the README for a full example.
 *
 * Note: `mergeConfig` replaces scalars but *concatenates* arrays — a repo adds
 * to the shared `exclude`/coverage lists, it cannot replace or remove entries.
 *
 * Deliberately left to each repo (no consensus across our repos): `include`
 * (test location varies — `test/`, `src/`, `tests/`), `testTimeout`,
 * `coverage.thresholds`, `coverage.reporter`, `setupFiles`, and `globals`.
 */
// Annotate with vitest/config's `ViteUserConfig` (a declared peer) so the
// emitted .d.ts doesn't reference `vite` directly, which isn't a dependency.
const config: ViteUserConfig = defineConfig({
  test: {
    coverage: {
      // Spread vitest's own coverage defaults, then keep tests and type decls
      // out of the measured set. (dist/coverage/node_modules can't match the
      // `src/**/*.ts` include below, so they don't need listing here.)
      exclude: [...coverageConfigDefaults.exclude, '**/*.d.ts', '**/*.test.ts', '**/*.spec.ts'],
      // Measure the published surface. Additive: a repo that ships from
      // elsewhere (e.g. `lib/**`) adds to this list — it can't replace it.
      include: ['src/**/*.ts'],
      // Requires `@vitest/coverage-v8` (declared as an optional peer dep).
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

export default config
