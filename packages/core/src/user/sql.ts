import { relations } from 'drizzle-orm'
import { pgTable, text } from 'drizzle-orm/pg-core'

import { bytea, primaryId, timestamps } from '../drizzle/types'
import { roleToUser } from '../role/sql'
import { subscription } from '../subscription/sql'

export const user = pgTable('user', {
  id: primaryId(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  customerId: text('customer_id').unique(),
  ...timestamps,
})

export const userRelations = relations(user, ({ many, one }) => ({
  image: one(userImage),
  subscription: one(subscription),
  roles: many(roleToUser),
}))

export const userImage = pgTable('user_image', {
  id: primaryId(),
  altText: text('alt_text'),
  contentType: text('content_type').notNull(),
  blob: bytea('blob').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .unique(),
  ...timestamps,
})

export const userImageRelations = relations(userImage, ({ one }) => ({
  user: one(user, {
    fields: [userImage.userId],
    references: [user.id],
  }),
}))
