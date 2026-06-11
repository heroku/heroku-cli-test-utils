import {APIClient} from '@heroku-cli/command'
import {Config, Interfaces} from '@oclif/core'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const defaultRoot = path.resolve(__dirname, '../..')

let cachedDefaultConfig: Config | undefined

/**
 * Returns a loaded oclif Config.
 *
 * Mutation contract:
 * - When called with no arguments, the returned Config is cached and shared
 *   across all callers in the process. Do not mutate it.
 * - When loadOpts are provided, a fresh Config is loaded on every call and
 *   is not cached.
 */
export const getConfig = async (loadOpts?: Interfaces.LoadOptions) => {
  if (loadOpts) {
    return Config.load(loadOpts)
  }

  if (!cachedDefaultConfig) {
    cachedDefaultConfig = await Config.load({root: defaultRoot})
  }

  return cachedDefaultConfig
}

export const clearConfigCache = () => {
  cachedDefaultConfig = undefined
}

export const getHerokuAPI = async (loadOpts?: Interfaces.LoadOptions) => {
  const conf = await getConfig(loadOpts)
  return new APIClient(conf)
}
