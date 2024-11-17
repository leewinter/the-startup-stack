import { relations } from 'drizzle-orm'
import { pgTable, integer, text } from 'drizzle-orm/pg-core'

import { primaryId, timestamps } from '../drizzle/types'
import { subscription } from '../subscription/sql'
import { plan } from '../plan/sql'

export const price = pgTable('price', {
  id: primaryId(),
  planId: text('plan_id')
    .notNull()
    .references(() => plan.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  interval: text('interval').notNull(),
  ...timestamps,
})

export const priceRelations = relations(price, ({ one, many }) => ({
  plan: one(plan, {
    fields: [price.planId],
    references: [plan.id],
  }),
  subscriptions: many(subscription),
}))
