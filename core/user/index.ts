import { eq } from 'drizzle-orm'
import { db } from '../drizzle'
import { user as schema, userImage as imageSchema } from './sql'

export namespace User {
  export const update = async (
    id: string,
    partial: Partial<typeof schema.$inferInsert>,
  ) => {
    const user = await db.update(schema).set(partial).where(eq(schema.id, id)).returning()
    return user[0]
  }

  export const fromID = async (id: string) => {
    return db.query.user.findFirst({ where: eq(schema.id, id) })
  }

  export const fromCustomerID = async (customerID: string) => {
    return db.query.user.findFirst({
      where: eq(schema.customerId, customerID),
    })
  }

  export const fromUsername = async (username: string) => {
    return db.query.user.findFirst({
      where: eq(schema.username, username),
    })
  }

  export const image = async (id: string) => {
    return db.query.userImage.findFirst({ where: eq(imageSchema.userId, id) })
  }
}
