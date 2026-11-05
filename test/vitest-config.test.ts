import {
  describe,
  expect,
  it,
} from 'vitest'

import defineHerokuVitestConfig, {
  herokuCoverageExclude,
  herokuTestExclude,
} from '../src/vitest-config/index.js'

// Mirrors eslint-config.test.ts: imports the shared config from source and pins
// the defaults that are easy to regress silently, plus the override contract the
// factory promises (W-24800351: override any individual option).
describe('vitest-config', function () {
  it('applies the shared defaults when called with no overrides', function () {
    const {test} = defineHerokuVitestConfig()
    expect(test?.coverage?.provider).toBe('v8')
    expect(test?.coverage?.include).toEqual(['src/**/*.ts'])
    expect(test?.coverage?.exclude).toEqual(
      expect.arrayContaining(['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts']),
    )
    expect(test?.disableConsoleIntercept).toBe(true)
    expect(test?.exclude).toEqual(
      expect.arrayContaining(['workflows-repo/**', '**/dist/**']),
    )
  })

  it('replaces an array option (coverage.include) instead of concatenating', function () {
    const {test} = defineHerokuVitestConfig({
      test: {coverage: {include: ['lib/**/*.ts']}},
    })
    // The override replaces the default source layout outright...
    expect(test?.coverage?.include).toEqual(['lib/**/*.ts'])
    // ...while the other shared defaults are preserved.
    expect(test?.coverage?.provider).toBe('v8')
    expect(test?.coverage?.exclude).toEqual(expect.arrayContaining(['**/*.d.ts']))
    expect(test?.disableConsoleIntercept).toBe(true)
  })

  it('extends a shared list when the exported constant is spread in', function () {
    const {test} = defineHerokuVitestConfig({
      test: {coverage: {exclude: [...herokuCoverageExclude, 'fixtures/**']}},
    })
    expect(test?.coverage?.exclude).toEqual(
      expect.arrayContaining([...herokuCoverageExclude, 'fixtures/**']),
    )
  })

  it('exposes the shared exclude constants for extension', function () {
    expect(herokuTestExclude).toEqual(
      expect.arrayContaining(['workflows-repo/**', '**/dist/**']),
    )
  })
})
