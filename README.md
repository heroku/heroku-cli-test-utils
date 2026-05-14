# @heroku-cli/test-utils

A collection of test utilities for the Heroku CLI, designed to make testing CLI
commands easier and more consistent. Built with ESM support and TypeScript.

## Overview

This package provides utilities to help test Heroku CLI commands, including:
- Command execution helpers with output capture
- Output expectation utilities
- Test initialization helpers
- Shared ESLint configuration

## Installation

```bash
npm install --save-dev @heroku-cli/test-utils
```

## Requirements

- Node.js >= 20
- TypeScript >= 5.4.0
- ESM (ES Modules) support
- A test runner of your choice (Mocha and Vitest are both supported)

## ESLint Configuration

This package provides a shareable ESLint 9 flat config that extends oclif's base configuration with Heroku-specific rules. The base config is test-framework-agnostic; layer on the `mocha` or `vitest` overlay depending on what your repo uses.

### Setup

1. Install the required peer dependencies:
```bash
npm install --save-dev eslint@^9 eslint-config-oclif@^6
# vitest repos also need:
npm install --save-dev eslint-plugin-vitest
```

2. Create `eslint.config.js` in your project root:

**Mocha repos:**
```javascript
import herokuConfig from '@heroku-cli/test-utils/eslint-config'
import mocha from '@heroku-cli/test-utils/eslint-config/mocha'

export default [
  ...herokuConfig,
  ...mocha,
  // Your additional config here
]
```

**Vitest repos:**
```javascript
import herokuConfig from '@heroku-cli/test-utils/eslint-config'
import vitest from '@heroku-cli/test-utils/eslint-config/vitest'

export default [
  ...herokuConfig,
  ...vitest,
  // Your additional config here
]
```

### What's Included

The base configuration includes:
- **oclif base rules** - TypeScript, Node.js, and CLI best practices
- **Import plugin** - Module import/export rules
- **Heroku-specific rules**:
  - `no-console: 'off'` - Allow console for CLI output
  - `@typescript-eslint/no-explicit-any: 'warn'`
  - Custom indent rules for readability
- **Ignore patterns** - Excludes `dist/`, `coverage/`, and `workflows-repo/`

The `mocha` overlay is optional — the base config already passes through oclif's mocha-plugin defaults. Importing it bumps `mocha/no-exclusive-tests` from `warn` to `error` so a stray `it.only` fails CI.

The `vitest` overlay adds `eslint-plugin-vitest`'s recommended rules and globals for test files, and globally disables every `mocha/*` rule. (The mocha plugin itself is loaded transitively via `eslint-config-oclif` and can't be unregistered in flat config — but the overlay neutralizes its rules so they produce zero diagnostics.)

## Usage

### Running Commands

The `runCommand` helper runs oclif commands and captures their output. It's framework-agnostic — use it with whatever assertion library and runner your project uses.

**Mocha + chai:**
```typescript
import { runCommand } from '@heroku-cli/test-utils'
import { expect } from 'chai'
import { MyCommand } from '../src/commands/my-command.js'

describe('MyCommand', () => {
  it('should run successfully', async () => {
    const { result, stdout } = await runCommand(
      MyCommand,
      ['--flag', 'value'],
      { root: __dirname }
    )

    expect(result).to.deep.equal({ success: true })
    expect(stdout).to.include('Expected output')
  })
})
```

**Vitest:**
```typescript
import { runCommand } from '@heroku-cli/test-utils'
import { describe, it, expect } from 'vitest'
import { MyCommand } from '../src/commands/my-command.js'

describe('MyCommand', () => {
  it('should run successfully', async () => {
    const { result, stdout } = await runCommand(
      MyCommand,
      ['--flag', 'value'],
      { root: import.meta.dirname }
    )

    expect(result).toEqual({ success: true })
    expect(stdout).toContain('Expected output')
  })
})
```

### Return Value

`runCommand` returns an object with:
- `result` - The command's return value (if successful)
- `error` - Error object (if command failed)
- `stdout` - Captured standard output
- `stderr` - Captured standard error

### Test Configuration

Use the test helper functions to set up your test environment:

```typescript
import { getConfig, getHerokuAPI } from '@heroku-cli/test-utils'

// Get oclif configuration
const config = await getConfig({ root: '/path/to/project' })

// Get Heroku API client
const api = await getHerokuAPI({ root: '/path/to/project' })
```

### Expecting Output

`expectOutput` compares two strings after normalizing trailing whitespace and indentation. It throws a `node:assert` `AssertionError` on mismatch, so it works with any test runner (mocha, vitest, node:test, etc.) without requiring chai.

```typescript
import { expectOutput } from '@heroku-cli/test-utils'

expectOutput(stdout, `
  expected
  multi-line
  output
`)
```

If you'd rather assert with your own matcher, use `normalizeOutput` to get the normalized strings:

```typescript
import { normalizeOutput } from '@heroku-cli/test-utils'
import { expect } from 'vitest'

const { actual, expected } = normalizeOutput(stdout, `expected output`)
expect(actual).toBe(expected)
```

### Initializing Tests

```typescript
import { initCliTest } from '@heroku-cli/test-utils'

// In your test setup file (mocha) or vitest setupFiles entry
initCliTest()
```

## Development

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Testing

```bash
npm test
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.
