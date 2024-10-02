import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core'

import { primaryId, timestamps } from './drizzle/types'
import { role } from './role.sql'

export const permission = pgTable('permission', {
  id: primaryId(),
  // TODO: use enums?
  entity: text('entity').notNull(),
  action: text('action').notNull(),
  access: text('access').notNull(),
  description: text('description').default('').notNull(),
  ...timestamps,
})

export const permissionRelations = relations(permission, ({ many }) => ({
  permissionToRoles: many(permissionToRole),
}))

export const permissionToRole = pgTable(
  'permission_to_role',
  {
    permissionId: text('permission_id')
      .notNull()
      .references(() => permission.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ...timestamps,
  },
  (t) => ({
    pk: primaryKey({ columns: [t.permissionId, t.roleId] }),
  }),
)

export const permissionToRoleRelations = relations(permissionToRole, ({ one }) => ({
  role: one(role, {
    fields: [permissionToRole.roleId],
    references: [role.id],
  }),
  permission: one(permission, {
    fields: [permissionToRole.permissionId],
    references: [permission.id],
  }),
}))
