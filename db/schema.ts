import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core'
import {
  sqliteTable,
  text,
  numeric,
  integer,
  blob,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
import type { InferSelectModel } from 'drizzle-orm'
import { sql } from 'drizzle-orm'
import { relations } from 'drizzle-orm/relations'
import { v4 as uuid } from 'uuid'

const primaryId = (name: string = 'id') =>
  text(name)
    .primaryKey()
    .notNull()
    // TODO: use cuuid
    .$defaultFn(() => uuid())

const shared = {
  createdAt: numeric('createdAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: numeric('updatedAt')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
}

const boolean = (name: string) => integer(name, { mode: 'boolean' })

export const user = sqliteTable('user', {
  ...shared,
  id: primaryId(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  customerId: text('customerId').unique(),
})

export const userRelations = relations(user, ({ many, one }) => ({
  image: one(userImage),
  subscription: one(subscription),
  roles: many(roleToUser),
}))

export type User = InferSelectModel<typeof schema.user> & {
  image: Pick<InferSelectModel<typeof schema.userImage>, 'id'> | null
  roles: { role: Pick<InferSelectModel<typeof schema.role>, 'name'> }[]
}

export const userImage = sqliteTable('userImage', {
  ...shared,
  id: primaryId(),
  altText: text('altText'),
  contentType: text('contentType').notNull(),
  blob: blob('blob').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .unique(),
})

export const userImageRelations = relations(userImage, ({ one }) => ({
  user: one(user, {
    fields: [userImage.userId],
    references: [user.id],
  }),
}))

export const role = sqliteTable('role', {
  ...shared,
  id: primaryId(),
  name: text('name').notNull().unique(),
  description: text('description').default('').notNull(),
})

export const roleRelations = relations(role, ({ many }) => ({
  roleToUser: many(roleToUser),
  permissionToRole: many(permissionToRole),
}))

export const permission = sqliteTable('permission', {
  ...shared,
  id: primaryId(),
  entity: text('entity').notNull(),
  action: text('action').notNull(),
  access: text('access').notNull(),
  description: text('description').default('').notNull(),
})

export const permissionRelations = relations(permission, ({ many }) => ({
  permissionToRoles: many(permissionToRole),
}))

export const plan = sqliteTable('plan', {
  ...shared,
  id: primaryId(),
  name: text('name').notNull(),
  description: text('description'),
})

export const planRelations = relations(plan, ({ many }) => ({
  prices: many(price),
  subscriptions: many(subscription),
}))

export const price = sqliteTable('price', {
  ...shared,
  id: primaryId(),
  planId: text('planId')
    .notNull()
    .references(() => plan.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  interval: text('interval').notNull(),
})

export const priceRelations = relations(price, ({ one, many }) => ({
  plan: one(plan, {
    fields: [price.planId],
    references: [plan.id],
  }),
  subscriptions: many(subscription),
}))

export const subscription = sqliteTable('subscription', {
  ...shared,
  id: primaryId(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .unique(),
  planId: text('planId')
    .notNull()
    .references(() => plan.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  priceId: text('priceId')
    .notNull()
    .references(() => price.id, { onDelete: 'restrict', onUpdate: 'cascade' }),
  interval: text('interval').notNull(),
  status: text('status').notNull(),
  currentPeriodStart: integer('currentPeriodStart').notNull(),
  currentPeriodEnd: integer('currentPeriodEnd').notNull(),
  cancelAtPeriodEnd: boolean('cancelAtPeriodEnd').default(false),
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

export const roleToUser = sqliteTable(
  'roleToUser',
  {
    ...shared,
    roleId: text('role')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: text('user')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
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

export const permissionToRole = sqliteTable(
  'permissionToRole',
  {
    ...shared,
    permissionId: text('permission')
      .notNull()
      .references(() => permission.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    roleId: text('role')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
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

export const schema = {
  user,
  userRelations,
  userImage,
  userImageRelations,
  role,
  roleRelations,
  permission,
  permissionRelations,
  plan,
  planRelations,
  price,
  priceRelations,
  subscription,
  subscriptionRelations,
  roleToUser,
  roleToUserRelations,
  permissionToRole,
  permissionToRoleRelations,
}

export default schema

export type DB = BaseSQLiteDatabase<'async' | 'sync', unknown, typeof schema>
