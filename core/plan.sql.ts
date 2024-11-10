import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'

import { primaryId, timestamps } from './drizzle/types'
import { price } from './price.sql'
import { subscription } from './subscription/sql.ts'

export const plan = pgTable('plan', {
  id: primaryId(),
  name: text('name').notNull(),
  description: text('description'),
  ...timestamps,
})

export const planRelations = relations(plan, ({ many }) => ({
  prices: many(price),
  subscriptions: many(subscription),
}))
