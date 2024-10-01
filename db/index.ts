import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'
import { Resource } from 'sst'

import { schema } from './schema'

export const connection = new Pool({
  connectionString: Resource.DATABASE_URL.value,
  max: process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : undefined,
})

export const db = drizzle(connection, {
  schema,
})

export type db = typeof db

export { schema } from './schema'
