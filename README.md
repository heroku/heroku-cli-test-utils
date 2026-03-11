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
- Testing frameworks: Mocha, Chai, and Sinon

## ESLint Configuration

This package provides a shareable ESLint 9 flat config that extends oclif's base configuration with Heroku-specific rules.

### Setup

1. Install the required peer dependencies:
```bash
npm install --save-dev eslint@^9 eslint-config-oclif@^6
```

2. Create `eslint.config.js` in your project root:
```javascript
import herokuConfig from '@heroku-cli/test-utils/eslint-config'

export default [
  ...herokuConfig,
  // Your additional config here
]
```

### What's Included

The configuration includes:
- **oclif base rules** - TypeScript, Node.js, and CLI best practices
- **Mocha support** - Test framework rules
- **Import plugin** - Module import/export rules
- **Heroku-specific rules**:
  - `camelcase: 'warn'` - Allow snake_case for API compatibility
  - `no-console: 'off'` - Allow console for CLI output
  - Custom indent rules for readability
- **Test file overrides** - Special rules for test files
- **Ignore patterns** - Excludes `dist/` directory

## Usage

### Running Commands

The `runCommand` helper runs oclif commands and captures their output:

```typescript
import { runCommand } from '@heroku-cli/test-utils'
import { MyCommand } from '../src/commands/my-command.js'

describe('MyCommand', () => {
  it('should run successfully', async () => {
    const { result, stdout, stderr } = await runCommand(
      MyCommand,
      ['--flag', 'value'],
      { root: __dirname }
    )

    expect(result).to.deep.equal({ success: true })
    expect(stdout).to.include('Expected output')
  })

  it('should handle errors', async () => {
    const { error } = await runCommand(MyCommand, ['--invalid'])
    expect(error).to.exist
    expect(error.message).to.include('Invalid flag')
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

```typescript
import expectOutput from '@heroku-cli/test-utils'

// Validate command output patterns
expectOutput(stdout, /Expected pattern/)
```

### Initializing Tests

```typescript
import { setupTest } from '@heroku-cli/test-utils'

beforeEach(() => {
  setupTest()
})
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
