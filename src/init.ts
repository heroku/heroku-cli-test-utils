import nock from 'nock'
import {resolve} from 'node:path'

export function initCliTest(): void {
  process.env.TS_NODE_PROJECT = resolve('test/tsconfig.json');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).columns = '120'
  nock.disableNetConnect()
  if (process.env.ENABLE_NET_CONNECT === 'true') {
    nock.enableNetConnect()
  }
}
