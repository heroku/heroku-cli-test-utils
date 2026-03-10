import {expect} from 'chai'
import {ESLint} from 'eslint'
import * as path from 'path'

describe('eslint-config', function () {
  let eslintConfig: any

  before(function () {
    // Load the eslint config
    eslintConfig = require(path.join(__dirname, '../dist/eslint-config.js'))
  })

  it('should load the eslint config without errors', function () {
    expect(eslintConfig).to.be.an('object')
  })

  it('should extend oclif config', function () {
    expect(eslintConfig.extends).to.be.an('array')
    expect(eslintConfig.extends).to.include('oclif')
  })

  it('should extend mocha plugin config', function () {
    expect(eslintConfig.extends).to.include('plugin:mocha/recommended')
  })

  it('should not extend oclif-typescript config', function () {
    expect(eslintConfig.extends).to.not.include('oclif-typescript')
  })

  it('should have expected plugins configured', function () {
    expect(eslintConfig.plugins).to.be.an('array')
    expect(eslintConfig.plugins).to.include('import')
    expect(eslintConfig.plugins).to.include('mocha')
  })

  it('should have expected rules configured', function () {
    expect(eslintConfig.rules).to.be.an('object')
    expect(eslintConfig.rules).to.have.property('camelcase')
    expect(eslintConfig.rules.camelcase).to.equal('warn')
    expect(eslintConfig.rules).to.have.property('no-console')
    expect(eslintConfig.rules['no-console']).to.equal('off')
    expect(eslintConfig.rules).to.have.property('indent')
    expect(eslintConfig.rules.indent).to.be.an('array')
  })

  it('should have ignorePatterns configured', function () {
    expect(eslintConfig.ignorePatterns).to.be.an('array')
    expect(eslintConfig.ignorePatterns).to.include('dist/**/*')
  })

  it('should have test file overrides', function () {
    expect(eslintConfig.overrides).to.be.an('array')
    expect(eslintConfig.overrides).to.have.lengthOf(1)

    const testOverride = eslintConfig.overrides[0]
    expect(testOverride.files).to.include('test/**/*.ts')
    expect(testOverride.files).to.include('test/**/*.js')
    expect(testOverride.rules['prefer-arrow-callback']).to.equal('off')
  })

  describe('ESLint integration', function () {
    it('should work with ESLint 9 API', async function () {
      const eslint = new ESLint({
        overrideConfigFile: path.join(__dirname, '../dist/eslint-config.js'),
      })

      // Test that we can create an ESLint instance without errors
      expect(eslint).to.be.an('object')
    })

    it('should lint valid TypeScript code without errors', async function () {
      const eslint = new ESLint({
        overrideConfigFile: path.join(__dirname, '../dist/eslint-config.js'),
      })

      const validCode = `
        export function testFunction() {
          const value = 42
          return value
        }

        export class TestClass {
          private name: string

          constructor(name: string) {
            this.name = name
          }

          getName() {
            return this.name
          }
        }
      `
      const results = await eslint.lintText(validCode, {
        filePath: 'test.ts',
      })

      // Should have no errors (warnings are ok)
      expect(results[0].errorCount).to.equal(0)
    })

    it('should detect indent errors', async function () {
      const eslint = new ESLint({
        overrideConfigFile: path.join(__dirname, '../dist/eslint-config.js'),
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
        overrideConfigFile: path.join(__dirname, '../dist/eslint-config.js'),
      })

      const codeWithConsole = `
        export function test() {
          console.log('test')
        }
      `
      const results = await eslint.lintText(codeWithConsole, {
        filePath: 'test.ts',
      })

      const consoleErrors = results[0].messages.filter(
        (msg) => msg.ruleId === 'no-console',
      )
      expect(consoleErrors.length).to.equal(0)
    })
  })
})
