import { domain } from './dns'

sst.Linkable.wrap(stripe.WebhookEndpoint, (endpoint) => {
  return {
    properties: {
      id: endpoint.id,
      secret: endpoint.secret,
    },
  }
})

export const webhook = new stripe.WebhookEndpoint('StripeWebhook', {
  url: $interpolate`https://api.${domain}/hook/stripe`,
  metadata: {
    stage: $app.stage,
  },
  enabledEvents: [
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted',
  ],
})
