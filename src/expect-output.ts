import {strict as assert} from 'node:assert'

function stripIndents(str: string) {
  str = str.trim().replaceAll(/\s+$/gmv, '')

  const indent = ((/^\s+[^$]/mv.exec(str)) ?? [''])[0].length - 1
  const regexp = new RegExp(`^s{${indent}}`, 'mgv')
  return str.replace(regexp, '')
}

export function normalizeOutput(actual: string, expected: string) {
  return {
    actual: actual.trim().replaceAll(/\s+$/gmv, ''),
    expected: stripIndents(expected),
  }
}

const expectOutput = function (actual: string, expected: string) {
  // it can be helpful to strip all hyphens & spaces when migrating tests before perfecting
  // use `.replace(/[\s─]/g, '')` on both actual & expected until tests pass, then remove, and paste actual into expected
  const normalized = normalizeOutput(actual, expected)
  assert.equal(normalized.actual, normalized.expected)
}

export default expectOutput
