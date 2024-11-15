import { db } from '#core/drizzle'
import { permission as schema } from './sql'

export namespace Permission {
  export const insert = async (partial: typeof schema.$inferInsert) => {
    return db.insert(schema).values(partial)
  }
}
