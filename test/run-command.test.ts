import {Command} from '@heroku-cli/command'
import {expect} from 'chai'

import {getConfig, getHerokuAPI, runCommand} from '../src/run-command'

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
    const result = await runCommand(TestCommand)
    expect(result).to.deep.equal({success: true})
  })

  it('should handle command errors', async function () {
    try {
      await runCommand(ErrorCommand)
      expect.fail('should have thrown an error')
    } catch (error: unknown) {
      expect(error).to.be.an('Error')
      if (error instanceof Error) {
        expect(error.message).to.equal('test error')
      } else {
        expect.fail('error should be an instance of Error')
      }
    }
  })

  it('should load config successfully', async function () {
    const config = await getConfig()
    expect(config).to.be.an('object')
    expect(config.root).to.be.a('string')
  })

  it('should create Heroku API client', async function () {
    const api = await getHerokuAPI()
    expect(api).to.be.an('object')
    // Add more specific API client checks if needed
  })

  it('should pass command arguments', async function () {
    const args = ['--flag', 'value']
    const result = await runCommand(TestCommand, args)
    expect(result).to.deep.equal({success: true})
  })

  it('should handle printStd option', async function () {
    // This test is more about ensuring it doesn't throw
    // The actual output behavior is hard to test due to stdout-stderr mocking
    await runCommand(TestCommand, [], true)
  })
})
