import {APIClient} from '@heroku-cli/command'
import {Config} from '@oclif/core'
import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest'

import {clearConfigCache, getConfig, getHerokuAPI} from '../src/test-instances.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const testRoot = resolve(__dirname, '..')

describe('test-instances', function () {
  beforeEach(function () {
    clearConfigCache()
  })

  afterEach(function () {
    vi.restoreAllMocks()
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

    it('should cache the default config across calls', async function () {
      const stub = await Config.load({root: testRoot})
      const loadSpy = vi.spyOn(Config, 'load').mockResolvedValue(stub)

      const config1 = await getConfig()
      const config2 = await getConfig()

      expect(config1).toBe(config2)
      expect(loadSpy).toHaveBeenCalledTimes(1)
    })

    it('should return a fresh config every call when loadOpts are provided', async function () {
      const config1 = await getConfig({root: testRoot})
      const config2 = await getConfig({root: testRoot})
      expect(config1).not.toBe(config2)
    })

    it('should clear the default cache when clearConfigCache is called', async function () {
      const stub = await Config.load({root: testRoot})
      const loadSpy = vi.spyOn(Config, 'load').mockResolvedValue(stub)

      await getConfig()
      await getConfig()
      expect(loadSpy).toHaveBeenCalledTimes(1)

      clearConfigCache()
      await getConfig()
      expect(loadSpy).toHaveBeenCalledTimes(2)
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
