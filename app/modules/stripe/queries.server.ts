import { PLANS } from '#app/modules/stripe/plans'
import { stripe } from '#app/modules/stripe/stripe.server'
import { getLocaleCurrency, HOST_URL } from '#app/utils/misc.server'
import { ERRORS } from '#app/utils/constants/errors'
import { db, schema } from '#core/drizzle'
import { eq } from 'drizzle-orm'

/**
 * Creates a Stripe customer for a user.
 */
export async function createCustomer({ userId }: { userId: string }) {
  const user = await db.query.user.findFirst({ where: eq(schema.user.id, userId) })
  if (!user || user.customerId) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED)

  const email = user.email ?? undefined
  const name = user.username ?? undefined
  const customer = await stripe.customers
    .create({ email, name })
    .catch((err) => console.error(err))
  if (!customer) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED)

  await db
    .update(schema.user)
    .set({ customerId: customer.id })
    .where(eq(schema.user.id, user.id))
  return true
}

/**
 * Creates a Stripe free tier subscription for a user.
 */
export async function createFreeSubscription({
  userId,
  request,
}: {
  userId: string
  request: Request
}) {
  const user = await db.query.user.findFirst({ where: eq(schema.user.id, userId) })
  if (!user || !user.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  const subscription = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, user.id),
  })
  if (subscription) return false

  const currency = getLocaleCurrency(request)
  const plan = await db.query.plan.findFirst({
    where: eq(schema.plan.id, PLANS.FREE),
    with: { prices: true },
  })
  const yearlyPrice = plan?.prices.find(
    (price) => price.interval === 'year' && price.currency === currency,
  )
  if (!yearlyPrice) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  const stripeSubscription = await stripe.subscriptions.create({
    customer: String(user.customerId),
    items: [{ price: yearlyPrice.id }],
  })
  if (!stripeSubscription) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  await db.insert(schema.subscription).values({
    id: stripeSubscription.id,
    userId: user.id,
    planId: String(stripeSubscription.items.data[0].plan.product),
    priceId: String(stripeSubscription.items.data[0].price.id),
    interval: String(stripeSubscription.items.data[0].plan.interval),
    status: stripeSubscription.status,
    currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
    currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
    cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
  })

  return true
}

/**
 * Creates a Stripe checkout session for a user.
 */
export async function createSubscriptionCheckout({
  userId,
  planId,
  planInterval,
  request,
}: {
  userId: string
  planId: string
  planInterval: string
  request: Request
}) {
  const user = await db.query.user.findFirst({ where: eq(schema.user.id, userId) })
  if (!user || !user.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  const subscription = await db.query.subscription.findFirst({
    where: eq(schema.subscription.userId, user.id),
  })
  if (subscription?.planId !== PLANS.FREE) return

  const currency = getLocaleCurrency(request)
  const plan = await db.query.plan.findFirst({
    where: eq(schema.plan.id, planId),
    with: { prices: true },
  })

  const price = plan?.prices.find(
    (price) => price.interval === planInterval && price.currency === currency,
  )
  if (!price) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  const checkout = await stripe.checkout.sessions.create({
    customer: user.customerId,
    line_items: [{ price: price.id, quantity: 1 }],
    mode: 'subscription',
    payment_method_types: ['card'],
    success_url: `${HOST_URL}/dashboard/checkout`,
    cancel_url: `${HOST_URL}/dashboard/settings/billing`,
  })
  if (!checkout) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
  return checkout.url
}

/**
 * Creates a Stripe customer portal for a user.
 */
export async function createCustomerPortal({ userId }: { userId: string }) {
  const user = await db.query.user.findFirst({ where: eq(schema.user.id, userId) })
  if (!user || !user.customerId) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

  const customerPortal = await stripe.billingPortal.sessions.create({
    customer: user.customerId,
    return_url: `${HOST_URL}/dashboard/settings/billing`,
  })
  if (!customerPortal) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
  return customerPortal.url
}
