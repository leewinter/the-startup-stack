import { Resource } from 'sst'
import StripeClient from 'stripe'
import { ERRORS } from '#app/utils/constants/errors.ts'
import { plan as planSchema } from './plan.sql.ts'
import { eq } from 'drizzle-orm'
import { db } from './drizzle/index.ts'
import { HOST_URL } from '#app/utils/misc.server.ts'

const stripe = new StripeClient(Resource.STRIPE_SECRET_KEY.value, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export namespace Stripe {
  export const client = stripe

  export const createCustomer = async (email: string, name: string | undefined) => {
    const customer = await client.customers
      .create({ email, name })
      .catch((err) => console.error(err))

    if (!customer) throw new Error(ERRORS.STRIPE_CUSTOMER_NOT_CREATED)
    return customer
  }

  export const createSubscription = async (
    customerId: string,
    planId: string,
    currency: string,
  ) => {
    const plan = await db.query.plan.findFirst({
      where: eq(planSchema.id, planId),
      with: { prices: true },
    })

    const yearlyPrice = plan?.prices.find(
      (price) => price.interval === 'year' && price.currency === currency,
    )

    if (!yearlyPrice) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

    const subscription = await client.subscriptions.create({
      customer: customerId,
      items: [{ price: yearlyPrice.id }],
    })

    if (!subscription) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    return subscription
  }

  export const checkout = async (customerID: string, priceID: string) => {
    const checkout = await client.checkout.sessions.create({
      customer: customerID,
      line_items: [{ price: priceID, quantity: 1 }],
      mode: 'subscription',
      payment_method_types: ['card'],
      success_url: `${HOST_URL}/dashboard/checkout`,
      cancel_url: `${HOST_URL}/dashboard/settings/billing`,
    })
    if (!checkout) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    return checkout
  }

  export const customerPortal = async (customerID: string) => {
    const portal = client.billingPortal.sessions.create({
      customer: customerID,
      return_url: `${HOST_URL}/dashboard/settings/billing`,
    })
    if (!portal) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)
    return portal
  }

  export const createEvent = async (payload: string, sig: string) => {
    return client.webhooks.constructEventAsync(
      payload,
      sig,
      Resource.StripeWebhook.secret,
    )
  }

  export const listSubscriptions = async (customerId: string) => {
    return client.subscriptions.list({ customer: customerId })
  }

  export const getSubscription = async (subscriptionId: string) => {
    return client.subscriptions.retrieve(subscriptionId)
  }

  export const cancelSubscription = async (subscriptionId: string) => {
    return client.subscriptions.cancel(subscriptionId)
  }
}
