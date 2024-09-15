import {
  pgTable,
  timestamp,
  text,
  boolean,
  primaryKey,
  integer,
  customType,
} from 'drizzle-orm/pg-core'
import type { InferSelectModel } from 'drizzle-orm'
import { relations } from 'drizzle-orm/relations'
import { ulid } from 'ulid'

const primaryId = (name: string = 'id') =>
  text(name)
    .primaryKey()
    .$defaultFn(() => ulid())

export const bytea = customType<{ data: Buffer }>({
  dataType() {
    return 'bytea'
  },
  toDriver(value): Buffer {
    return value
  },
  fromDriver(value): Buffer {
    return value as Buffer
  },
})

const shared = {
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}

export const user = pgTable('user', {
  id: primaryId(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  customerId: text('customer_id').unique(),
  ...shared,
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

// TODO: get rid of userImage
export const userImage = pgTable('user_image', {
  id: primaryId(),
  altText: text('alt_text'),
  contentType: text('content_type').notNull(),
  blob: bytea('blob').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' })
    .unique(),
  ...shared,
})

export const userImageRelations = relations(userImage, ({ one }) => ({
  user: one(user, {
    fields: [userImage.userId],
    references: [user.id],
  }),
}))

export const role = pgTable('role', {
  id: primaryId(),
  name: text('name').notNull().unique(),
  description: text('description').default('').notNull(),
  ...shared,
})

export const roleRelations = relations(role, ({ many }) => ({
  roleToUser: many(roleToUser),
  permissionToRole: many(permissionToRole),
}))

export const permission = pgTable('permission', {
  id: primaryId(),
  // TODO: use enums?
  entity: text('entity').notNull(),
  action: text('action').notNull(),
  access: text('access').notNull(),
  description: text('description').default('').notNull(),
  ...shared,
})

export const permissionRelations = relations(permission, ({ many }) => ({
  permissionToRoles: many(permissionToRole),
}))

export const plan = pgTable('plan', {
  id: primaryId(),
  name: text('name').notNull(),
  description: text('description'),
  ...shared,
})

export const planRelations = relations(plan, ({ many }) => ({
  prices: many(price),
  subscriptions: many(subscription),
}))

export const price = pgTable('price', {
  id: primaryId(),
  planId: text('plan_id')
    .notNull()
    .references(() => plan.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  amount: integer('amount').notNull(),
  currency: text('currency').notNull(),
  interval: text('interval').notNull(),
  ...shared,
})

export const priceRelations = relations(price, ({ one, many }) => ({
  plan: one(plan, {
    fields: [price.planId],
    references: [plan.id],
  }),
  subscriptions: many(subscription),
}))

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
  // TODO: use enum?
  status: text('status').notNull(),
  currentPeriodStart: timestamp('current_period_start').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  ...shared,
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

export const roleToUser = pgTable(
  'role_to_user',
  {
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ...shared,
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

export const permissionToRole = pgTable(
  'permission_to_role',
  {
    permissionId: text('permission_id')
      .notNull()
      .references(() => permission.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    ...shared,
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
