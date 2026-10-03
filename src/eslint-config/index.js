// ESLint 10 flat config for Heroku CLI projects (test-framework-agnostic base)
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

const herokuEslintConfig = [
  // Base oclif config (already includes mocha, import plugins, etc.)
  ...oclifConfig,
  // Heroku-specific rules
  {
    rules: {
      '@stylistic/indent': ['error', 2, {MemberExpression: 1}],
      '@stylistic/indent-binary-ops': 'off', // Conflicts with no-mixed-spaces-and-tabs
      '@typescript-eslint/no-explicit-any': 'warn',
      'import-x/namespace': 'warn',
      'no-console': 'off',
      // Conflicts with perfectionist/sort-classes (also enabled by eslint-config-oclif),
      // which orders public methods before private ones -- the opposite of this rule's
      // private-before-public default. The two can't both be satisfied for a class with
      // both a public and a private method; perfectionist is the more specifically
      // configured of the pair (explicit `groups`) and matches the idiomatic oclif layout
      // (public run() first, private helpers beneath), so this rule gives way. Latent until
      // the eslint-config-oclif@7 bump installs, which is when unicorn enables this rule.
      'unicorn/consistent-class-member-order': 'off',
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
  // Ignore patterns. Use 'dir/**' (not 'dir/**/*') so ESLint prunes the whole
  // directory from traversal. Under ESLint 10, 'dir/**/*' matches files but
  // doesn't prune the dir, so `eslint .` still descends into it — and for
  // workflows-repo (the heroku/npm-release-workflows checkout the release
  // workflow injects) that means importing its eslint.config.js (whose
  // @eslint/js dep isn't installed in the consumer), failing release validate.
  {
    ignores: ['dist/**', 'coverage/**', 'workflows-repo/**'],
  },
]

export default herokuEslintConfig
