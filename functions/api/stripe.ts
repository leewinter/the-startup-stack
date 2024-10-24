import { z } from 'zod'
import { stripe } from '#app/modules/stripe/stripe.server'
import { PLANS } from '#app/modules/stripe/plans'
import {
  sendSubscriptionSuccessEmail,
  sendSubscriptionErrorEmail,
} from '#app/modules/email/templates/subscription-email'
import { ERRORS } from '#app/utils/constants/errors'
import { db, schema } from '#core/drizzle'
import { eq } from 'drizzle-orm'
import { Resource } from 'sst'
import { Hono } from 'hono'

export const route = new Hono().post('/', async (ctx) => {
  const sig = ctx.req.header('stripe-signature')

  if (!sig) throw new Error(ERRORS.STRIPE_MISSING_SIGNATURE)

  console.log({
    sig,
    secret: Resource.StripeWebhook.secret,
    id: Resource.StripeWebhook.id,
  })

  const event = await stripe.webhooks.constructEventAsync(
    await ctx.req.text(),
    sig,
    Resource.StripeWebhook.secret,
  )

  try {
    switch (event.type) {
      /**
       * Occurs when a Checkout Session has been successfully completed.
       */
      case 'checkout.session.completed': {
        const session = event.data.object

        const { customer: customerId, subscription: subscriptionId } = z
          .object({ customer: z.string(), subscription: z.string() })
          .parse(session)

        const user = await db.query.user.findFirst({
          where: eq(schema.user.customerId, customerId),
        })
        if (!user) throw new Error(ERRORS.SOMETHING_WENT_WRONG)

        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        await db
          .update(schema.subscription)
          .set({
            id: subscription.id,
            userId: user.id,
            planId: String(subscription.items.data[0].plan.product),
            priceId: String(subscription.items.data[0].price.id),
            interval: String(subscription.items.data[0].plan.interval),
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start),
            currentPeriodEnd: new Date(subscription.current_period_end),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          })
          .where(eq(schema.subscription.userId, user.id))

        await sendSubscriptionSuccessEmail({ email: user.email, subscriptionId })

        // Cancel free subscription. — User upgraded to a paid plan.
        // Not required, but it's a good practice to keep just a single active plan.
        const subscriptions = (
          await stripe.subscriptions.list({ customer: customerId })
        ).data.map((sub) => sub.items)

        if (subscriptions.length > 1) {
          const freeSubscription = subscriptions.find((sub) =>
            sub.data.some((item) => item.price.product === PLANS.FREE),
          )
          if (freeSubscription) {
            await stripe.subscriptions.cancel(freeSubscription?.data[0].subscription)
          }
        }

        return ctx.json({})
      }

      /**
       * Occurs when a Stripe subscription has been updated.
       * E.g. when a user upgrades or downgrades their plan.
       */
      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const { customer: customerId } = z
          .object({ customer: z.string() })
          .parse(subscription)

        const user = await db.query.user.findFirst({
          where: eq(schema.user.customerId, customerId),
        })
        if (!user) throw new Error(ERRORS.SOMETHING_WENT_WRONG)

        await db
          .update(schema.subscription)
          .set({
            id: subscription.id,
            userId: user.id,
            planId: String(subscription.items.data[0].plan.product),
            priceId: String(subscription.items.data[0].price.id),
            interval: String(subscription.items.data[0].plan.interval),
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start),
            currentPeriodEnd: new Date(subscription.current_period_end),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          })
          .where(eq(schema.subscription.userId, user.id))

        return ctx.json({})
      }

      /**
       * Occurs whenever a customer’s subscription ends.
       */
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        const { id } = z.object({ id: z.string() }).parse(subscription)

        const dbSubscription = await db.query.subscription.findFirst({
          where: eq(schema.subscription.id, id),
        })
        if (dbSubscription)
          await db
            .delete(schema.subscription)
            .where(eq(schema.subscription.id, dbSubscription.id))

        return ctx.json({})
      }
    }
  } catch (err: unknown) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object

        const { customer: customerId, subscription: subscriptionId } = z
          .object({ customer: z.string(), subscription: z.string() })
          .parse(session)

        const user = await db.query.user.findFirst({
          where: eq(schema.user.customerId, customerId),
        })
        if (!user) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

        await sendSubscriptionErrorEmail({ email: user.email, subscriptionId })
        return ctx.json({})
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object

        const { id: subscriptionId, customer: customerId } = z
          .object({ id: z.string(), customer: z.string() })
          .parse(subscription)

        const user = await db.query.user.findFirst({
          where: eq(schema.user.customerId, customerId),
        })
        if (!user) throw new Error(ERRORS.STRIPE_SOMETHING_WENT_WRONG)

        await sendSubscriptionErrorEmail({ email: user.email, subscriptionId })
        return ctx.json({})
      }
    }

    throw err
  }

  return ctx.json({})
})
