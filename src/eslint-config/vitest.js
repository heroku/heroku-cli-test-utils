// Vitest overlay — applies @vitest/eslint-plugin's recommended rules to test files
// and disables every mocha-plugin rule globally.
//
// `eslint-config-oclif` loads `eslint-plugin-mocha` transitively, and ESLint flat
// config has no way to unregister a plugin. We harvest the plugin reference from
// the loaded oclif config (rather than importing it directly, since it lives in
// oclif's nested node_modules) and disable each rule by name.
//
// Requires `@vitest/eslint-plugin` to be installed in the consumer repo.

import vitest from '@vitest/eslint-plugin'
import oclifConfig from 'eslint-config-oclif'

function findMochaPlugin() {
  for (const entry of oclifConfig) {
    if (entry?.plugins?.mocha) return entry.plugins.mocha
  }

  return null
}

const mochaPlugin = findMochaPlugin()
const mochaRulesOff = mochaPlugin
  ? Object.fromEntries(Object.keys(mochaPlugin.rules).map(name => [`mocha/${name}`, 'off']))
  : {}

export default [
  {rules: mochaRulesOff},
  {
    files: ['test/**/*.ts', 'test/**/*.js'],
    languageOptions: {
      globals: vitest.environments.env.globals,
    },
    plugins: {vitest},
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
]
