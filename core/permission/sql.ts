import { relations } from 'drizzle-orm'
import { pgTable, primaryKey, text, pgEnum } from 'drizzle-orm/pg-core'

import { primaryId, timestamps } from '../drizzle/types'
import { role } from '../role/sql.ts'

export const entityEnum = pgEnum('entity', ['user'])
export const actionEnum = pgEnum('action', ['create', 'read', 'update', 'delete'])
export const accessEnum = pgEnum('access', ['own', 'any'])

export const permission = pgTable('permission', {
  id: primaryId(),
  entity: entityEnum('entity').notNull(),
  action: actionEnum('action').notNull(),
  access: accessEnum('access').notNull(),
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
