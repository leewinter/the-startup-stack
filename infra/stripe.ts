import { PRICING_PLANS } from '#core/constants.ts'
import { domain } from './dns'

// -------------------------- FREE PLAN ------------------------------------

export const freeProduct = new stripe.Product(PRICING_PLANS.free.id, {
  name: PRICING_PLANS.free.name,
  description: PRICING_PLANS.free.description,
  active: true,
  metadata: {
    stage: $app.stage,
  },
})

export const freePriceUsdMonth = new stripe.Price(
  'free-usd-month',
  {
    product: $interpolate`${freeProduct.productId}`,
    currency: 'usd',
    unitAmount: -1,
    recurring: {
      interval: 'month',
      intervalCount: 1,
    },
    metadata: {
      stage: $app.stage,
    },
  },
  { dependsOn: freeProduct },
)

export const freePriceUsdYear = new stripe.Price(
  'free-usd-year',
  {
    product: $interpolate`${freeProduct.productId}`,
    currency: 'usd',
    unitAmount: -1,
    recurring: {
      interval: 'year',
      intervalCount: 1,
    },
    metadata: {
      stage: $app.stage,
    },
  },
  { dependsOn: freeProduct },
)

export const freePriceEurMonth = new stripe.Price(
  'free-eur-month',
  {
    product: $interpolate`${freeProduct.productId}`,
    currency: 'eur',
    unitAmount: -1,
    recurring: {
      interval: 'month',
      intervalCount: 1,
    },
    metadata: {
      stage: $app.stage,
    },
  },
  { dependsOn: freeProduct },
)

export const freePriceEurYear = new stripe.Price(
  'free-eur-year',
  {
    product: $interpolate`${freeProduct.productId}`,
    currency: 'eur',
    unitAmount: -1,
    recurring: {
      interval: 'year',
      intervalCount: 1,
    },
    metadata: {
      stage: $app.stage,
    },
  },
  { dependsOn: freeProduct },
)

// -------------------------- PRO PLAN ------------------------------------

export const proProduct = new stripe.Product(PRICING_PLANS.pro.id, {
  name: PRICING_PLANS.pro.name,
  description: PRICING_PLANS.pro.description,
  active: true,
  metadata: {
    stage: $app.stage,
  },
})

export const proPriceUsdMonth = new stripe.Price(
  'pro-usd-month',
  {
    product: $interpolate`${proProduct.productId}`,
    currency: 'usd',
    unitAmount: 1990,
    recurring: {
      interval: 'month',
      intervalCount: 1,
    },
    metadata: {
      stage: $app.stage,
    },
  },
  { dependsOn: proProduct },
)

export const proPriceUsdYear = new stripe.Price(
  'pro-usd-year',
  {
    product: $interpolate`${proProduct.productId}`,
    currency: 'usd',
    unitAmount: 19990,
    recurring: {
      interval: 'year',
      intervalCount: 1,
    },
    metadata: {
      stage: $app.stage,
    },
  },
  { dependsOn: proProduct },
)

export const proPriceEurMonth = new stripe.Price(
  'pro-eur-month',
  {
    product: $interpolate`${proProduct.productId}`,
    currency: 'eur',
    unitAmount: 1990,
    recurring: {
      interval: 'month',
      intervalCount: 1,
    },
    metadata: {
      stage: $app.stage,
    },
  },
  { dependsOn: proProduct },
)

export const proPriceEurYear = new stripe.Price(
  'pro-eur-year',
  {
    product: $interpolate`${proProduct.productId}`,
    currency: 'eur',
    unitAmount: 19990,
    recurring: {
      interval: 'year',
      intervalCount: 1,
    },
    metadata: {
      stage: $app.stage,
    },
  },
  { dependsOn: proProduct },
)

// -------------------------- CUSTOMER PORTAL ------------------------------------

export const portal = new stripe.PortalConfiguration(
  'Organization name',
  {
    businessProfile: {
      headline: 'Organization Name - Customer Portal',
    },
    features: {
      customerUpdate: {
        enabled: true,
        allowedUpdates: ['address', 'shipping', 'tax_id', 'email'],
      },
      invoiceHistory: { enabled: true },
      paymentMethodUpdate: { enabled: true },
      subscriptionCancel: { enabled: true },
      subscriptionUpdates: [
        {
          enabled: true,
          defaultAllowedUpdates: ['price'],
          prorationBehavior: 'always_invoice',
          products: [
            {
              product: $interpolate`${proProduct.productId}`,
              prices: [
                $interpolate`${proPriceUsdMonth.id}`,
                $interpolate`${proPriceUsdYear.id}`,
                $interpolate`${proPriceEurMonth.id}`,
                $interpolate`${proPriceEurYear.id}`,
              ],
            },
          ],
        },
      ],
    },
  },
  {
    dependsOn: [
      proProduct,
      proPriceUsdMonth,
      proPriceUsdYear,
      proPriceEurMonth,
      proPriceEurYear,
    ],
  },
)

// -------------------------- WEBHOOK ------------------------------------

sst.Linkable.wrap(stripe.WebhookEndpoint, (endpoint) => {
  return {
    properties: {
      id: endpoint.id,
      secret: endpoint.secret,
    },
  }
})

export const webhook = new stripe.WebhookEndpoint(
  'StripeWebhook',
  {
    url: $interpolate`https://api.${domain}/hook/stripe`,
    metadata: {
      stage: $app.stage,
    },
    enabledEvents: [
      'checkout.session.completed',
      'customer.subscription.updated',
      'customer.subscription.deleted',
    ],
  },
  { dependsOn: portal },
)
