import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        '**/*.d.ts',
        '**/*.test.ts',
        'test/**/*',
        'dist/**/*',
        'coverage/**',
        'bin/**/*',
        'scripts/**/*',
        'tmp/**/*',
        '**/*.mjs',
      ],
      include: ['src/**/*.ts'],
      provider: 'v8',
      reporter: ['text-summary', 'html', 'lcov'],
      thresholds: {
        branches: 65,
        functions: 80,
        lines: 65,
        statements: 65,
      },
    },
    // captureOutput in src/run-command.ts replaces process.stdout/stderr.write
    // directly; vitest's interceptor sits in front of it and would swallow the
    // bytes before they reach our wrapper.
    disableConsoleIntercept: true,
    include: ['test/**/*.test.ts'],
    testTimeout: 360_000,
  },
})
