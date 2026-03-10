// ESLint 9 flat config for Heroku CLI projects
// Usage in other repos:
//
// import herokuEslintConfig from '@heroku-cli/test-utils/eslint-config'
//
// export default [
//   ...herokuEslintConfig,
//   // your additional config
// ]

// @ts-expect-error - no types available
import oclifConfig from 'eslint-config-oclif'

export default [
  // Base oclif config (already includes mocha, import plugins, etc.)
  ...oclifConfig,
  // Heroku-specific rules
  {
    rules: {
      camelcase: 'warn',
      'import/namespace': 'warn',
      indent: ['error', 2, {MemberExpression: 1}],
      'no-console': 'off',
      'unicorn/prefer-string-replace-all': 'warn',
    },
  },
  // Test file overrides
  {
    files: ['test/**/*.ts', 'test/**/*.js'],
    rules: {
      'prefer-arrow-callback': 'off',
    },
  },
  // Ignore patterns
  {
    ignores: ['dist/**/*'],
  },
]
