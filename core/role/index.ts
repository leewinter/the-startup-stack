import { eq } from 'drizzle-orm'
import { schema, db } from '../drizzle'

export namespace Role {
  export const roles = ['user', 'admin'] as const

  export const insert = async (
    name: (typeof roles)[number],
    description: string,
    access: (typeof schema.permission.$inferInsert)['access'],
  ) => {
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
}
