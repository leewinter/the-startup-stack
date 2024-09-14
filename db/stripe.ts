import type { Interval } from '#app/modules/stripe/plans'
import { stripe } from '#app/modules/stripe/stripe.server'
import { PRICING_PLANS } from '#app/modules/stripe/plans'

init()

async function init() {
  /**
   * Stripe Products.
   */
  const products = await stripe.products.list({
    limit: 3,
  })
  if (products?.data?.length) {
    console.info('🏃‍♂️ Skipping Stripe products creation and seeding.')
    return true
  }

  const seedProducts = Object.values(PRICING_PLANS).map(
    async ({ id, name, description, prices }) => {
      // Format prices to match Stripe's API.
      const pricesByInterval = Object.entries(prices).flatMap(([interval, price]) => {
        return Object.entries(price).map(([currency, amount]) => ({
          interval,
          currency,
          amount,
        }))
      })

      // Create Stripe product.
      await stripe.products.create({
        id,
        name,
        description: description || undefined,
      })

      // Create Stripe price for the current product.
      const stripePrices = await Promise.all(
        pricesByInterval.map((price) => {
          return stripe.prices.create({
            product: id,
            currency: price.currency ?? 'usd',
            unit_amount: price.amount ?? 0,
            tax_behavior: 'inclusive',
            recurring: {
              interval: (price.interval as Interval) ?? 'month',
            },
          })
        }),
      )

      // Return product ID and prices.
      // Used to configure the Customer Portal.
      return {
        product: id,
        prices: stripePrices.map((price) => price.id),
      }
    },
  )

  // Create Stripe products and stores them into database.
  const seededProducts = await Promise.all(seedProducts)
  console.info(`📦 Stripe Products has been successfully created.`)

  // Configure Customer Portal.
  await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: 'Organization Name - Customer Portal',
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ['address', 'shipping', 'tax_id', 'email'],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price'],
        proration_behavior: 'always_invoice',
        products: seededProducts.filter(({ product }) => product !== 'free'),
      },
    },
  })

  console.info(`👒 Stripe Customer Portal has been successfully configured.`)
  console.info(
    '🎉 Visit: https://dashboard.stripe.com/test/products to see your products.',
  )
}
