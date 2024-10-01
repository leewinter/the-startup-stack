import ws from 'ws'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { schema } from './schema'
import { Resource } from 'sst'

config({ path: '.env' }) // or .env.local

neonConfig.webSocketConstructor = ws
const pool = new Pool({ connectionString: Resource.DATABASE_URL.value })

export const db = drizzle(pool, { schema })
export { schema } from './schema'
