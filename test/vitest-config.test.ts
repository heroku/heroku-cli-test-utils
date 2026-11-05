import type {ViteUserConfig} from 'vitest/config'

import {
  beforeAll,
  describe,
  expect,
  it,
} from 'vitest'

// Mirrors eslint-config.test.ts: imports the shared config from source and pins
// the defaults that are easy to regress silently (the dogfooded root config
// overrides `include`, so it never exercises these on its own).
describe('vitest-config', function () {
  let test: NonNullable<ViteUserConfig['test']>

  beforeAll(async function () {
    const mod = await import('../src/vitest-config/index.js')
    const config: ViteUserConfig = mod.default
    test = config.test!
  })

  it('exports a config object with a `test` block', function () {
    expect(test).toBeTypeOf('object')
  })

  it('sets the v8 coverage provider over the src surface', function () {
    expect(test.coverage?.provider).toBe('v8')
    expect(test.coverage?.include).toContain('src/**/*.ts')
  })

  it('keeps tests and type decls out of coverage', function () {
    expect(test.coverage?.exclude).toEqual(
      expect.arrayContaining(['**/*.d.ts', '**/*.test.ts', '**/*.spec.ts']),
    )
  })

  it('disables vitest console interception (required by runCommand/captureOutput)', function () {
    expect(test.disableConsoleIntercept).toBe(true)
  })

  it('excludes the release workflow checkout and build output from discovery', function () {
    expect(test.exclude).toContain('workflows-repo/**')
    expect(test.exclude).toContain('**/dist/**')
  })
})
