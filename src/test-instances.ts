import {APIClient} from '@heroku-cli/command'
import {Config, Interfaces} from '@oclif/core'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const configCache = new Map<string, Config>()

export const getConfig = async (loadOpts?: Interfaces.LoadOptions) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const defaultRoot = path.resolve(__dirname, '../..')

  const opts = loadOpts ?? {root: defaultRoot}
  const key = JSON.stringify(opts)
  let conf = configCache.get(key)
  if (!conf) {
    conf = await Config.load(opts)
    configCache.set(key, conf)
  }

  return conf
}

export const clearConfigCache = () => {
  configCache.clear()
}

export const getHerokuAPI = async (loadOpts?: Interfaces.LoadOptions) => {
  const conf = await getConfig(loadOpts)
  return new APIClient(conf)
}
