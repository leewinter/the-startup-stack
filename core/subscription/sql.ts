import { relations } from 'drizzle-orm'
import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from '../user/sql.ts'
import { timestamps } from '../drizzle/types.ts'
import { plan } from '../plan/sql.ts'
import { price } from '../price/sql.ts'

export const subscription = pgTable('subscription', {
  id: text('id').primaryKey().notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .unique(),
  planId: text('plan_id')
    .notNull()
    .references(() => plan.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  priceId: text('price_id')
    .notNull()
    .references(() => price.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  interval: text('interval').notNull(),
  status: text('status').notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  ...timestamps,
})

export const subscriptionRelations = relations(subscription, ({ one }) => ({
  price: one(price, {
    fields: [subscription.priceId],
    references: [price.id],
  }),
  plan: one(plan, {
    fields: [subscription.planId],
    references: [plan.id],
  }),
  user: one(user, {
    fields: [subscription.userId],
    references: [user.id],
  }),
}))
