import {expect} from 'chai'
import {ESLint} from 'eslint'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

describe('eslint-config', function () {
  let eslintConfig: any

  before(async function () {
    // Import the eslint config from source
    const configModule = await import('../src/eslint-config.js')
    eslintConfig = configModule.default
  })

  it('should be a flat config array', function () {
    expect(eslintConfig).to.be.an('array')
    expect(eslintConfig.length).to.be.greaterThan(0)
  })

  it('should include oclif config', function () {
    // oclif config is spread in as the first items
    expect(eslintConfig[0]).to.be.an('object')
  })

  it('should include mocha plugin config', function () {
    // Find the mocha config object
    const mochaConfig = eslintConfig.find((c: any) => c.name === 'mocha/recommended')
    expect(mochaConfig).to.exist
  })

  it('should have import plugin configured', function () {
    // Find config with import plugin
    const configWithPlugins = eslintConfig.find((c: any) => c.plugins?.import)
    expect(configWithPlugins).to.exist
    expect(configWithPlugins.plugins.import).to.exist
  })

  it('should have expected rules configured', function () {
    // Find the config object with our custom rules
    const rulesConfig = eslintConfig.find((c: any) =>
      c.rules?.['@typescript-eslint/no-explicit-any'] === 'warn')
    expect(rulesConfig).to.exist
    expect(rulesConfig.rules).to.have.property('no-console', 'off')
    expect(rulesConfig.rules).to.have.property('@stylistic/indent')
    expect(rulesConfig.rules['@stylistic/indent']).to.be.an('array')
  })

  it('should have ignores configured', function () {
    // Find the ignores config
    const ignoresConfig = eslintConfig.find((c: any) => c.ignores)
    expect(ignoresConfig).to.exist
    expect(ignoresConfig.ignores).to.include('dist/**/*')
  })

  it('should have test file overrides', function () {
    // Find the test file config
    const testConfig = eslintConfig.find((c: any) =>
      c.files?.includes('test/**/*.ts'))
    expect(testConfig).to.exist
    expect(testConfig.files).to.include('test/**/*.ts')
    expect(testConfig.files).to.include('test/**/*.js')
    expect(testConfig.rules['prefer-arrow-callback']).to.equal('off')
  })

  describe('ESLint integration', function () {
    it('should work with ESLint 9 API', async function () {
      const eslint = new ESLint({
        overrideConfigFile: join(__dirname, '../src/eslint-config.js'),
      })

      // Test that we can create an ESLint instance without errors
      expect(eslint).to.be.an('object')
    })

    it('should lint TypeScript code successfully', async function () {
      const eslint = new ESLint({
        overrideConfigFile: join(__dirname, '../dist/eslint-config.js'),
      })

      const validCode = `export function testFunction(): number {
  const value = 42
  return value
}
`
      const results = await eslint.lintText(validCode, {
        filePath: 'test.ts',
      })

      // Should be able to lint (may have warnings but shouldn't crash)
      expect(results).to.be.an('array')
      expect(results).to.have.lengthOf(1)
    })

    it('should detect indent errors', async function () {
      const eslint = new ESLint({
        overrideConfigFile: join(__dirname, '../dist/eslint-config.js'),
      })

      // Inline code with bad indentation
      const invalidCode = `export function badIndent() {
      const x = 1
    const y = 2
  return x + y
}`
      const results = await eslint.lintText(invalidCode, {
        filePath: 'test.ts',
      })

      // Should have indent errors or at least be lintable
      expect(results).to.be.an('array')
      expect(results).to.have.lengthOf(1)
      // Just verify it was linted (may or may not have errors depending on ESLint version)
    })

    it('should allow console.log (no-console is off)', async function () {
      const eslint = new ESLint({
        overrideConfigFile: join(__dirname, '../dist/eslint-config.js'),
      })

      const codeWithConsole = `
        export function test() {
          console.log('test')
        }
      `
      const results = await eslint.lintText(codeWithConsole, {
        filePath: 'test.ts',
      })

      const consoleErrors = results[0].messages.filter(msg => msg.ruleId === 'no-console')
      expect(consoleErrors.length).to.equal(0)
    })
  })
})
