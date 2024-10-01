import { secret } from './secret.ts'

export const www = new sst.aws.Remix('Remix', {
  link: [
    secret.SESSION_SECRET,
    secret.ENCRYPTION_SECRET,
    secret.DATABASE_URL,
    secret.RESEND_API_KEY,
    secret.STRIPE_PUBLIC_KEY,
    secret.STRIPE_SECRET_KEY,
    secret.StripeWebhookEndpoint,
    secret.HONEYPOT_ENCRYPTION_SEED,
  ],
})

export const outputs = {
  www: www.url,
}
