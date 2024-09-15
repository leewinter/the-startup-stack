import ws from 'ws'
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool, neonConfig } from '@neondatabase/serverless'
import { config } from 'dotenv'
import { schema } from './schema'

config({ path: '.env' }) // or .env.local

neonConfig.webSocketConstructor = ws
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export const db = drizzle(pool, { schema })
export { schema } from './schema'
