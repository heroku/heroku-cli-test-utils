import base from './src/eslint-config/index.js'
import vitest from './src/eslint-config/vitest.js'

const config = [...base, ...vitest]

export default config
