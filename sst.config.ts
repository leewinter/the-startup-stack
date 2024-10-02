/// <reference path="./.sst/platform/config.d.ts" />
import { readdirSync } from 'node:fs'

export default $config({
  app(input) {
    return {
      name: 'the-startup-stack',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        aws: {
          version: '6.52.0',
          region: 'eu-central-1',
        },
      },
    }
  },
  async run() {
    const outputs = {}
    for (const value of readdirSync('./infra/')) {
      const result = await import(`./infra/${value}`)
      if (result.outputs) Object.assign(outputs, result.outputs)
    }
    return outputs
  },
})
