import 'dotenv/config' // make sure to install dotenv package
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  out: './db/migrations',
  schema: './db/schema.ts',
  dbCredentials: {
    url: './.database/database.db',
  },
  // Print all statements
  verbose: true,
  // Always ask for confirmation
  strict: true,
})
