import { db } from '@company/core/src/drizzle/index'
import { permission as schema } from './sql'

export namespace Permission {
  export const entities = ['user'] as const
  export const actions = ['create', 'read', 'update', 'delete'] as const
  export const accesses = ['own', 'any'] as const

  export const insert = async (partial: typeof schema.$inferInsert) => {
    return db.insert(schema).values(partial)
  }
}
