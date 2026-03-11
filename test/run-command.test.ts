import {Command} from '@heroku-cli/command'
import {expect} from 'chai'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

import {captureOutput, runCommand} from '../src/run-command.js'
import {getConfig, getHerokuAPI} from '../src/test-instances.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testRoot = resolve(__dirname, '..')

describe('run-command', function () {
  // Mock command for testing
  class TestCommand extends Command {
    async run() {
      this.log('test output')
      return {success: true}
    }
  }

  class StderrCommand extends Command {
    async run() {
      this.logToStderr('error output')
      return {success: true}
    }
  }

  class ErrorCommand extends Command {
    async run() {
      throw new Error('test error')
    }
  }

  it('should run a command successfully', async function () {
    const {result} = await runCommand(TestCommand, [], {root: testRoot})
    expect(result).to.deep.equal({success: true})
  })

  it('should handle command errors', async function () {
    const {error} = await runCommand(ErrorCommand, [], {root: testRoot})
    expect(error).to.be.an('Error')
    if (error) {
      expect(error.message).to.equal('test error')
    }
  })

  it('should load config successfully', async function () {
    const config = await getConfig({root: testRoot})
    expect(config).to.be.an('object')
    expect(config.root).to.equal(testRoot)
  })

  it('should create Heroku API client', async function () {
    const api = await getHerokuAPI({root: testRoot})
    expect(api).to.be.an('object')
    // Add more specific API client checks if needed
  })

  it('should pass command arguments', async function () {
    const args = ['--flag', 'value']
    const {result} = await runCommand(TestCommand, args, {root: testRoot})
    expect(result).to.deep.equal({success: true})
  })

  it('should handle printStd option', async function () {
    // This test is more about ensuring it doesn't throw
    // The actual output behavior is hard to test due to stdout-stderr mocking
    await runCommand(TestCommand, [], {root: testRoot}, {print: true})
  })

  it('should capture stderr output', async function () {
    const {stderr} = await runCommand(StderrCommand, [], {root: testRoot})
    expect(stderr).to.include('error output')
  })

  it('should handle string arguments', async function () {
    const {result} = await runCommand(TestCommand, '--flag value', {root: testRoot})
    expect(result).to.deep.equal({success: true})
  })

  it('should strip ANSI codes by default', async function () {
    const {stdout} = await runCommand(TestCommand, [], {root: testRoot})
    // ANSI codes should be stripped from output
    expect(stdout).to.not.match(/\x1b\[/)
  })

  it('should not strip ANSI codes when stripAnsi is false', async function () {
    const {stdout} = await runCommand(TestCommand, [], {root: testRoot}, {stripAnsi: false})
    // Output should exist (whether or not it has ANSI codes depends on the command)
    expect(stdout).to.be.a('string')
  })

  describe('captureOutput', function () {
    it('should capture stdout from a function', async function () {
      const {stdout} = await captureOutput(() => {
        process.stdout.write('test output\n')
      })
      expect(stdout).to.include('test output')
    })

    it('should capture stderr from a function', async function () {
      const {stderr} = await captureOutput(() => {
        process.stderr.write('error output\n')
      })
      expect(stderr).to.include('error output')
    })

    it('should work with async functions', async function () {
      const {stdout} = await captureOutput(async () => {
        await Promise.resolve()
        process.stdout.write('async output\n')
      })
      expect(stdout).to.include('async output')
    })

    it('should strip ANSI codes', async function () {
      const {stdout} = await captureOutput(() => {
        process.stdout.write('\x1b[31mred text\x1b[0m\n')
      })
      expect(stdout).to.not.match(/\x1b\[/)
      expect(stdout).to.include('red text')
    })
  })
})
