import path from 'node:path'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'

import { schema } from './schema'

const dbDir = process.env.DB_PATH
  ? path.resolve(process.env.DB_PATH)
  : path.resolve('./.database')

const sqlite = new Database(path.resolve(dbDir, 'database.db'))

export const db = drizzle(sqlite, { schema })

export { schema } from './schema'
