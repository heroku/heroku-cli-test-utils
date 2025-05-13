# @heroku-cli/test-utils

A collection of test utilities for the Heroku CLI, designed to make testing CLI 
commands easier and more consistent.

## Overview

This package provides a set of utilities to help test Heroku CLI commands, including:
- Command execution helpers
- Output expectation utilities
- Output stubbing capabilities
- Test initialization helpers

## Installation

```bash
npm install --save-dev @heroku-cli/test-utils
```

## Requirements

- Node.js >= 20
- TypeScript >= 5.4.0
- Testing frameworks: Chai and Sinon

## ESLint Configuration

This package includes a pre-configured ESLint setup that extends the OCLIF and TypeScript configurations. To use it in your project:

1. Install the required peer dependencies:
```bash
npm install --save-dev eslint eslint-config-oclif eslint-config-oclif-typescript eslint-plugin-import eslint-plugin-mocha
```

2. Create or update your `.eslintrc.js`:
```javascript
module.exports = require('@heroku-cli/test-utils/src/eslint-config')
```

The configuration includes:
- OCLIF base rules
- TypeScript support
- Mocha test framework rules
- Import plugin rules
- Custom rules for CLI development

## Usage

### Running Commands

```typescript
import { runCommand } from '@heroku-cli/test-utils'

// Run a command and get its output
const { stdout, stderr } = await runCommand('heroku apps:list')
```

### Expecting Output

```typescript
import { expectOutput } from '@heroku-cli/test-utils'

// Test command output
await expectOutput('heroku apps:list', '=== My Apps')
```

### Stubbing Output

```typescript
import { stubOutput } from '@heroku-cli/test-utils'

// Stub command output for testing
const { stdout, stderr } = await stubOutput('heroku apps:list', {
  stdout: '=== My Apps\nmy-app-1\nmy-app-2',
  stderr: ''
})
```

### Initializing Tests

```typescript
import { init } from '@heroku-cli/test-utils'

// Initialize test environment
beforeEach(() => {
  init()
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
