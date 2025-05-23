import { Resource } from 'sst'
import StripeClient from 'stripe'

const stripe = new StripeClient(Resource.STRIPE_SECRET_KEY.value, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export namespace Stripe {
  export const client = stripe

  export const errors = {
    MISSING_SIGNATURE: 'Unable to verify webhook signature.',
    MISSING_ENDPOINT_SECRET: 'Unable to verify webhook endpoint.',
    CUSTOMER_NOT_CREATED: 'Unable to create customer.',
    SOMETHING_WENT_WRONG: 'Something went wrong while trying to handle Stripe API.',
  }

  export const createCustomer = async (email: string, name: string | undefined) => {
    const customer = await client.customers
      .create({ email, name })
      .catch((err) => console.error(err))

    if (!customer) throw new Error(errors.CUSTOMER_NOT_CREATED)
    return customer
  }

  export const createSubscription = async (customerId: string, priceID: string) => {
    const subscription = await client.subscriptions.create({
      customer: customerId,
      items: [{ price: priceID }],
    })

    if (!subscription) throw new Error(errors.SOMETHING_WENT_WRONG)
    return subscription
  }

  export const checkout = async (customerID: string, priceID: string) => {
    const checkout = await client.checkout.sessions.create({
      customer: customerID,
      line_items: [{ price: priceID, quantity: 1 }],
      mode: 'subscription',
      payment_method_types: ['card'],
      success_url: `${process.env.HOST_URL}/dashboard/checkout`,
      cancel_url: `${process.env.HOST_URL}/dashboard/settings/billing`,
    })
    if (!checkout) throw new Error(errors.SOMETHING_WENT_WRONG)
    return checkout
  }

  export const customerPortal = async (customerID: string) => {
    const portal = client.billingPortal.sessions.create({
      customer: customerID,
      return_url: `${process.env.HOST_URL}/dashboard/settings/billing`,
    })
    if (!portal) throw new Error(errors.SOMETHING_WENT_WRONG)
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
