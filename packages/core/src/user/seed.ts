import { or, eq } from 'drizzle-orm'
import { db, schema } from '../drizzle'

export default async function seed() {
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
      .values(roles.map((role) => ({ roleId: role.id, userId: user!.id })))
  })
}
