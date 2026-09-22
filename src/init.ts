import nock from 'nock'
import path from 'node:path'

export function initCliTest(): void {
  process.env.TS_NODE_PROJECT = path.resolve('test/tsconfig.json');
  // eslint-disable-next-line unicorn/no-global-object-property-assignment -- intentionally set terminal width for tests
  (globalThis as {columns?: string}).columns = '120'
  nock.disableNetConnect()
  if (process.env.ENABLE_NET_CONNECT === 'true') {
    nock.enableNetConnect()
  }
}
