import {Command} from '@heroku-cli/command'
import {expect} from 'chai'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

import {runCommand} from '../src/run-command.js'
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
})
