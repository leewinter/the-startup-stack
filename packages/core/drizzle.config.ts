import { defineConfig } from 'drizzle-kit'
import { Resource } from 'sst'

export default defineConfig({
  out: './core/migrations',
  schema: './core/**/*sql',
  dialect: 'postgresql',
  dbCredentials: {
    url: Resource.DATABASE_URL.value,
  },
})
