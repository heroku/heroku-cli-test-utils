import {expect} from 'chai'

import {
  restoreStdoutStderr,
  setupStdoutStderr,
  stderr,
  stdout,
} from '../src/stub-output'

describe('stub-output', function () {
  beforeEach(function () {
    // Ensure we start with a clean slate
    restoreStdoutStderr()
  })

  afterEach(function () {
    // Clean up after each test
    restoreStdoutStderr()
  })

  it('should capture stdout output', function () {
    setupStdoutStderr()
    process.stdout.write('test stdout')
    expect(stdout()).to.equal('test stdout')
  })

  it('should capture stderr output', function () {
    setupStdoutStderr()
    process.stderr.write('test stderr')
    expect(stderr()).to.equal('test stderr')
  })

  it('should handle multiple writes to stdout', function () {
    setupStdoutStderr()
    process.stdout.write('first ')
    process.stdout.write('second ')
    process.stdout.write('third')
    expect(stdout()).to.equal('first second third')
  })

  it('should handle multiple writes to stderr', function () {
    setupStdoutStderr()
    process.stderr.write('error1 ')
    process.stderr.write('error2 ')
    process.stderr.write('error3')
    expect(stderr()).to.equal('error1 error2 error3')
  })

  it('should handle Uint8Array input', function () {
    setupStdoutStderr()
    const buffer = new Uint8Array([116, 101, 115, 116]) // 'test' in ASCII
    process.stdout.write(buffer)
    expect(stdout()).to.equal('test')
  })

  it('should clear output after restoration', function () {
    setupStdoutStderr()
    process.stdout.write('test stdout')
    process.stderr.write('test stderr')
    restoreStdoutStderr()
    expect(stdout()).to.equal('')
    expect(stderr()).to.equal('')
  })

  it('should restore original stdout/stderr after restoration', function () {
    const originalStdoutWrite = process.stdout.write
    const originalStderrWrite = process.stderr.write

    setupStdoutStderr()
    expect(process.stdout.write).to.not.equal(originalStdoutWrite)
    expect(process.stderr.write).to.not.equal(originalStderrWrite)

    restoreStdoutStderr()
    expect(process.stdout.write).to.equal(originalStdoutWrite)
    expect(process.stderr.write).to.equal(originalStderrWrite)
  })
})
