import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {
  beforeEach, describe, expect, it,
} from 'vitest'

import {clearConfigCache, getConfig, getHerokuAPI} from '../src/test-instances.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testRoot = resolve(__dirname, '..')

describe('test-instances', function () {
  beforeEach(function () {
    clearConfigCache()
  })

  describe('getConfig', function () {
    it('should return a Config instance', async function () {
      const config = await getConfig({root: testRoot})
      expect(config).toBeInstanceOf(Config)
    })

    it('should use provided loadOpts', async function () {
      const config = await getConfig({root: testRoot})
      expect(config.root).toBe(testRoot)
    })

    it('should cache config by loadOpts', async function () {
      const config1 = await getConfig({root: testRoot})
      const config2 = await getConfig({root: testRoot})
      expect(config1).toBe(config2)
    })

    it('should return distinct configs for different loadOpts', async function () {
      const config1 = await getConfig({root: testRoot})
      const config2 = await getConfig({root: testRoot, version: '1.2.3'})
      expect(config1).not.toBe(config2)
    })

    it('should clear cache when clearConfigCache is called', async function () {
      const config1 = await getConfig({root: testRoot})
      clearConfigCache()
      const config2 = await getConfig({root: testRoot})
      expect(config1).not.toBe(config2)
    })

    it('should have loaded commands', async function () {
      const config = await getConfig({root: testRoot})
      expect(config.commands).toBeInstanceOf(Array)
    })
  })

  describe('getHerokuAPI', function () {
    it('should return an APIClient instance', async function () {
      const api = await getHerokuAPI({root: testRoot})
      expect(api).toBeInstanceOf(APIClient)
    })

    it('should use provided loadOpts', async function () {
      const api = await getHerokuAPI({root: testRoot})
      // Verify the API client was created successfully
      expect(api).toBeTypeOf('object')
      expect(api).toBeInstanceOf(APIClient)
    })
  })
})
