import {expect} from 'chai'

function stripIndents(str: string) {
  str = str.trim().replaceAll(/\s+$/gm, '')

  const indent = (str.match(/^\s+[^$]/m) || [''])[0].length - 1
  const regexp = new RegExp(`^s{${indent}}`, 'mg')
  return str.replace(regexp, '')
}

const expectOutput = function (actual: string, expected: string) {
  // it can be helpful to strip all hyphens & spaces when migrating tests before perfecting
  // use `.replace(/[\s─]/g, '')` on both actual & expected until tests pass, then remove, and paste actual into expected
  return expect(actual.trim().replaceAll(/\s+$/gm, ''))
    .to.equal(stripIndents(expected))
}

export default expectOutput
