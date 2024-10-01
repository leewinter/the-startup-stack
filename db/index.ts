import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'
import { Resource } from 'sst'

import { schema } from './schema'

const pool = new Pool({ connectionString: Resource.DATABASE_URL.value })

export const db = drizzle(pool, { schema })

export { schema } from './schema'
