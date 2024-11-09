export const secret = {
  SESSION_SECRET: new sst.Secret('SESSION_SECRET'),
  ENCRYPTION_SECRET: new sst.Secret('ENCRYPTION_SECRET'),
  DATABASE_URL: new sst.Secret('DATABASE_URL'),
  STRIPE_PUBLIC_KEY: new sst.Secret('STRIPE_PUBLIC_KEY'),
  STRIPE_SECRET_KEY: new sst.Secret('STRIPE_SECRET_KEY'),
  // GitHubClientId: new sst.Secret('GitHubClientId'),
  // GitHubClientSecret: new sst.Secret('GitHubClientSecret'),
  HONEYPOT_ENCRYPTION_SEED: new sst.Secret('HONEYPOT_ENCRYPTION_SEED'),
}
