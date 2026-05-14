// ESLint 9 flat config for Heroku CLI projects (test-framework-agnostic base)
// Usage in other repos:
//
// import herokuEslintConfig from '@heroku-cli/test-utils/eslint-config'
// import mochaOverlay from '@heroku-cli/test-utils/eslint-config/mocha'
// // or: import vitestOverlay from '@heroku-cli/test-utils/eslint-config/vitest'
//
// export default [
//   ...herokuEslintConfig,
//   ...mochaOverlay,
// ]

import oclifConfig from 'eslint-config-oclif'

export default [
  // Base oclif config (already includes mocha, import plugins, etc.)
  ...oclifConfig,
  // Heroku-specific rules
  {
    rules: {
      '@stylistic/indent': ['error', 2, {MemberExpression: 1}],
      '@stylistic/indent-binary-ops': 'off', // Conflicts with no-mixed-spaces-and-tabs
      '@typescript-eslint/no-explicit-any': 'warn',
      'import/namespace': 'warn',
      'no-console': 'off',
      'unicorn/prefer-string-replace-all': 'warn',
    },
  },
  // Neutralize mocha-plugin rules from oclif base so vitest consumers aren't punished.
  // Re-enable them by importing the /mocha overlay.
  {
    files: ['test/**/*.ts', 'test/**/*.js'],
    rules: {
      'mocha/no-exclusive-tests': 'off',
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-skipped-tests': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
  // Ignore patterns
  {
    ignores: ['dist/**/*', 'coverage/**/*', 'workflows-repo/**/*'],
  },
]
