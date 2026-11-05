import {
  configDefaults,
  coverageConfigDefaults,
  type ViteUserConfig,
} from 'vitest/config'

/**
 * Shared vitest config for Heroku CLI repos, exposed as a factory so a repo can
 * override any individual option while inheriting the rest.
 *
 * Call it in a repo's `vitest.config.ts`, passing only the repo-specific bits
 * (test directory, timeout, coverage thresholds/reporter, or a different source
 * layout). Overrides win per key, and arrays REPLACE rather than concatenate, so
 * a repo can swap the default source layout outright. To instead EXTEND a shared
 * list, spread the exported `herokuCoverageExclude` / `herokuTestExclude`
 * constants into your override.
 *
 * See the "Vitest Configuration" section of the README for a full example.
 */

/** Files kept out of coverage measurement. Spread this to extend it. */
export const herokuCoverageExclude = [
  ...coverageConfigDefaults.exclude,
  '**/*.d.ts',
  '**/*.test.ts',
  '**/*.spec.ts',
]

/** Paths kept out of test discovery. Spread this to extend it. */
export const herokuTestExclude = [
  ...configDefaults.exclude,
  '**/dist/**',
  'workflows-repo/**',
]

// The shared base. Not exported directly — consumers get it (merged with their
// overrides) through the factory below.
const baseConfig: ViteUserConfig = {
  test: {
    coverage: {
      exclude: herokuCoverageExclude,
      // Measure the published source surface by default. A repo that ships from
      // elsewhere replaces this outright (arrays replace, they don't concatenate).
      include: ['src/**/*.ts'],
      // Requires `@vitest/coverage-v8` (declared as an optional peer dep).
      provider: 'v8',
    },

    // test-utils' `runCommand`/`captureOutput` (see run-command.ts) writes to
    // `process.stdout`/`stderr` directly; vitest's console interceptor sits in
    // front of that and would swallow the bytes before our wrapper sees them.
    // Every repo using `runCommand` needs this off, so default it here. Override
    // with `false` in a repo that relies on vitest's console capture.
    disableConsoleIntercept: true,

    // The release workflow (heroku/npm-release-workflows) checks itself out into
    // `./workflows-repo` *inside* the consumer workspace during release-validate.
    // vitest's default `include` globs the whole tree and would collect that
    // repo's specs (which then time out), failing the release. Excluding it here
    // means every repo that extends this config inherits the fix. `**/dist/**`
    // keeps compiled-test output out of discovery too. See `herokuTestExclude`.
    exclude: herokuTestExclude,
  },
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

// Deep-merge where `override` wins per key and arrays REPLACE (vitest's own
// `mergeConfig` concatenates arrays, which is what prevents replacing an option
// like `coverage.include` — hence this helper).
function mergeReplacingArrays(base: unknown, override: unknown): unknown {
  if (override === undefined) {
    return base
  }

  if (!isPlainObject(base) || !isPlainObject(override)) {
    return override
  }

  const merged: Record<string, unknown> = {...base}
  for (const [key, value] of Object.entries(override)) {
    merged[key] = mergeReplacingArrays(base[key], value)
  }

  return merged
}

/**
 * Build a vitest config from the shared Heroku base plus repo-specific
 * `overrides`. Any option in `overrides` wins — arrays replace, objects
 * deep-merge — so a repo can override an individual option (e.g.
 * `coverage.include`) without re-declaring the shared defaults.
 */
export default function defineHerokuVitestConfig(overrides: ViteUserConfig = {}): ViteUserConfig {
  return mergeReplacingArrays(baseConfig, overrides) as ViteUserConfig
}
