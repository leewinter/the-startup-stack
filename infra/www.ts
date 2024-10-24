import { domain } from './dns.ts'
import { secret } from './secret.ts'

export const www = new sst.aws.Remix('Remix', {
  domain: {
    name: domain,
    dns: sst.cloudflare.dns(),
  },
  environment: {
    NODE_ENV: $dev === true ? 'development' : 'production',
    HOST_URL: $dev === true ? 'http://localhost:5173' : `https://${domain}`,
  },
  link: [
    secret.SESSION_SECRET,
    secret.ENCRYPTION_SECRET,
    secret.DATABASE_URL,
    secret.RESEND_API_KEY,
    secret.STRIPE_PUBLIC_KEY,
    secret.STRIPE_SECRET_KEY,
    secret.HONEYPOT_ENCRYPTION_SEED,
  ],
})
