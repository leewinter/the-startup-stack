import { domain } from './dns'
import { secret } from './secret'
import { webhook } from './stripe'

export const api = new sst.aws.Function('Api', {
  url: true,
  handler: 'functions/api/index.handler',
  link: [secret.DATABASE_URL, secret.RESEND_API_KEY, secret.STRIPE_SECRET_KEY, webhook],
})

new sst.aws.Router('ApiRouter', {
  domain: {
    name: `api.${domain}`,
    dns: sst.cloudflare.dns(),
  },
  routes: { '/*': api.url },
})
