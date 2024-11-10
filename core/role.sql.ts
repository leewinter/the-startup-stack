import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { primaryId, timestamps } from './drizzle/types'
import { user } from './user/sql.ts'
import { permissionToRole } from './permission.sql'

export const roleEnum = pgEnum('name', ['user', 'admin'])

export const role = pgTable('role', {
  id: primaryId(),
  name: roleEnum('name').notNull().unique(),
  description: text('description').default('').notNull(),
  ...timestamps,
})

export const roleRelations = relations(role, ({ many }) => ({
  roleToUser: many(roleToUser),
  permissionToRole: many(permissionToRole),
}))

export const roleToUser = pgTable(
  'role_to_user',
  {
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ...timestamps,
  },
  (t) => ({
    pk: primaryKey({ columns: [t.roleId, t.userId] }),
  }),
)

export const roleToUserRelations = relations(roleToUser, ({ one }) => ({
  user: one(user, {
    fields: [roleToUser.userId],
    references: [user.id],
  }),
  role: one(role, {
    fields: [roleToUser.roleId],
    references: [role.id],
  }),
}))
