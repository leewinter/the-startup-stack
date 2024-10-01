import { defineConfig } from 'drizzle-kit'
import { Resource } from 'sst'

export default defineConfig({
  out: './db/migrations',
  schema: './db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: Resource.DATABASE_URL.value,
  },
})
