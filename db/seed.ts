import 'dotenv/config'
import type { Interval } from '#app/modules/stripe/plans'
import { stripe } from '#app/modules/stripe/stripe.server'
import { PRICING_PLANS } from '#app/modules/stripe/plans'
import { db, schema } from '#db/index.js'
import { eq, or } from 'drizzle-orm'

async function seed() {
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

  console.info(`🎭 User roles and permissions has been successfully created.`)

  const prices = await stripe.prices.list()

  if (prices.data.length > 0) {
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

  /**
   * Stripe Products.
   */
  const products = await stripe.products.list({
    limit: 3,
  })
  if (products?.data?.length) {
    console.info('🏃‍♂️ Skipping Stripe products creation and seeding.')
    return true
  }

  const seedProducts = Object.values(PRICING_PLANS).map(
    async ({ id, name, description, prices }) => {
      // Format prices to match Stripe's API.
      const pricesByInterval = Object.entries(prices).flatMap(([interval, price]) => {
        return Object.entries(price).map(([currency, amount]) => ({
          interval,
          currency,
          amount,
        }))
      })

      // Create Stripe product.
      await stripe.products.create({
        id,
        name,
        description: description || undefined,
      })

      // Create Stripe price for the current product.
      const stripePrices = await Promise.all(
        pricesByInterval.map((price) => {
          return stripe.prices.create({
            product: id,
            currency: price.currency ?? 'usd',
            unit_amount: price.amount ?? 0,
            tax_behavior: 'inclusive',
            recurring: {
              interval: (price.interval as Interval) ?? 'month',
            },
          })
        }),
      )

      // Return product ID and prices.
      // Used to configure the Customer Portal.
      return {
        product: id,
        prices: stripePrices.map((price) => price.id),
      }
    },
  )

  // Create Stripe products and stores them into database.
  const seededProducts = await Promise.all(seedProducts)
  console.info(`📦 Stripe Products has been successfully created.`)

  // Configure Customer Portal.
  await stripe.billingPortal.configurations.create({
    business_profile: {
      headline: 'Organization Name - Customer Portal',
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ['address', 'shipping', 'tax_id', 'email'],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price'],
        proration_behavior: 'always_invoice',
        products: seededProducts.filter(({ product }) => product !== 'free'),
      },
    },
  })

  console.info(`👒 Stripe Customer Portal has been successfully configured.`)
  console.info(
    '🎉 Visit: https://dashboard.stripe.com/test/products to see your products.',
  )
}

seed().catch((err: unknown) => {
  console.error(err)
  process.exit(1)
})
