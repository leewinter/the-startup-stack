import { timestamp, text, customType } from 'drizzle-orm/pg-core'
import { ulid } from 'ulid'

export const primaryId = (name = 'id') =>
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

export const timestamps = {
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}
