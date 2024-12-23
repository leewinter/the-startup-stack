import { Stripe } from '@company/core/src/stripe'
import { db, schema } from '../drizzle'

export default async function seed() {
  const prices = await Stripe.client.prices.list()
  const products = await Stripe.client.products.list()

  for (const { id, name, description } of products.data.filter((p) => p.active)) {
    await db.transaction(async (tx) => {
      const [plan] = await tx
        .insert(schema.plan)
        .values({ id, name, description })
        .returning()

      await tx.insert(schema.price).values(
        prices.data
          .filter((price) => price.product === id)
          .map((price) => ({
            id: price.id,
            planId: plan!.id,
            amount: price.unit_amount ?? 0,
            currency: price.currency,
            interval: price.recurring?.interval ?? 'month',
          })),
      )
    })
  }
}
