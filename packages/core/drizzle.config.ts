import { defineConfig } from 'drizzle-kit'
import { Resource } from 'sst'

export default defineConfig({
  out: './src/migrations',
  schema: './src/**/*sql',
  dialect: 'postgresql',
  dbCredentials: {
    url: Resource.DATABASE_URL.value,
  },
})
