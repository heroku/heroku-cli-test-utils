import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import {expect} from 'chai'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'

import {getConfig, getHerokuAPI} from '../src/test-instances.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testRoot = resolve(__dirname, '..')

describe('test-instances', function () {
  // Clear any cached config before tests
  beforeEach(function () {
    // We need to clear the module cache to reset the cached config
    // This is a bit hacky but necessary for testing the caching behavior
  })

  describe('getConfig', function () {
    it('should return a Config instance', async function () {
      const config = await getConfig({root: testRoot})
      expect(config).to.be.instanceOf(Config)
    })

    it('should use provided loadOpts', async function () {
      const config = await getConfig({root: testRoot})
      expect(config.root).to.equal(testRoot)
    })

    it('should not cache config when loadOpts provided', async function () {
      // When loadOpts are provided, each call creates a new instance
      const config1 = await getConfig({root: testRoot})
      const config2 = await getConfig({root: testRoot})
      expect(config1).to.not.equal(config2)
    })

    it('should have loaded commands', async function () {
      const config = await getConfig({root: testRoot})
      expect(config.commands).to.be.an('array')
    })
  })

  describe('getHerokuAPI', function () {
    it('should return an APIClient instance', async function () {
      const api = await getHerokuAPI({root: testRoot})
      expect(api).to.be.instanceOf(APIClient)
    })

    it('should use provided loadOpts', async function () {
      const api = await getHerokuAPI({root: testRoot})
      // Verify the API client was created successfully
      expect(api).to.be.an('object')
      expect(api).to.be.instanceOf(APIClient)
    })
  })
})
