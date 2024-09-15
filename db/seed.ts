import 'dotenv/config'
import { stripe } from '#app/modules/stripe/stripe.server'
import { PRICING_PLANS } from '#app/modules/stripe/plans'
import { db, schema } from '#db/index.js'
import { eq, getTableName, or, sql } from 'drizzle-orm'

for (const table of [
  schema.permissionToRole,
  schema.roleToUser,
  schema.subscription,
  schema.price,
  schema.userImage,
  schema.user,
  schema.role,
  schema.permission,
  schema.plan,
]) {
  // await db.delete(table) // clear tables without truncating / resetting ids
  db.execute(sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`))
}

/**
 * Users, Roles and Permissions.
 */
const entities = ['user']
const actions = ['create', 'read', 'update', 'delete']
const accesses = ['own', 'any'] as const
for (const entity of entities) {
  for (const action of actions) {
    for (const access of accesses) {
      await db.insert(schema.permission).values({ entity, action, access })
    }
  }
}

async function createRoleWithPermissions(
  name: string,
  description: string,
  access: (typeof accesses)[number],
) {
  await db.transaction(async (tx) => {
    const [newRole] = await tx
      .insert(schema.role)
      .values({ name, description })
      .returning()

    const permissions = await tx
      .select({ id: schema.permission.id })
      .from(schema.permission)
      .where(eq(schema.permission.access, access))

    // Create permission-to-role associations
    await tx.insert(schema.permissionToRole).values(
      permissions.map((perm) => ({
        roleId: newRole.id,
        permissionId: perm.id,
      })),
    )
  })
}

await createRoleWithPermissions('admin', 'Administrator role', 'any')
await createRoleWithPermissions('user', 'User role', 'own')

await db.transaction(async (tx) => {
  const [user] = await tx
    .insert(schema.user)
    .values({ email: 'admin@admin.com', username: 'admin' })
    .returning()

  const roles = await tx
    .select({ id: schema.role.id })
    .from(schema.role)
    .where(or(eq(schema.role.name, 'admin'), eq(schema.role.name, 'user')))

  await tx
    .insert(schema.roleToUser)
    .values(roles.map((role) => ({ roleId: role.id, userId: user.id })))
})

console.info('🎭 User roles and permissions has been successfully created.')

const prices = await stripe.prices.list()

if (prices.data.length > 0) {
  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.values(PRICING_PLANS).forEach(async ({ id, name, description }) => {
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
            planId: plan.id,
            amount: price.unit_amount ?? 0,
            currency: price.currency,
            interval: price.recurring?.interval ?? 'month',
          })),
      )
    })
  })
}
