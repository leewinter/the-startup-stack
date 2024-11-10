import { drizzle } from 'drizzle-orm/neon-serverless'
import { neonConfig, Pool } from '@neondatabase/serverless'
import { Resource } from 'sst'
import ws from 'ws'

import {
  permission,
  permissionRelations,
  permissionToRole,
  permissionToRoleRelations,
} from '../permission.sql'
import { plan, planRelations } from '../plan.sql'
import { price, priceRelations } from '../price.sql'
import { role, roleRelations, roleToUser, roleToUserRelations } from '../role.sql'
import { subscription, subscriptionRelations } from '../subscription/sql.ts'
import { user, userRelations, userImage, userImageRelations } from '../user/sql.ts'

export const schema = {
  user,
  userRelations,
  userImage,
  userImageRelations,
  role,
  roleRelations,
  permission,
  permissionRelations,
  plan,
  planRelations,
  price,
  priceRelations,
  subscription,
  subscriptionRelations,
  roleToUser,
  roleToUserRelations,
  permissionToRole,
  permissionToRoleRelations,
}

// WebSocket is not globally defined on AWS
neonConfig.webSocketConstructor = ws

export const connection = new Pool({
  connectionString: Resource.DATABASE_URL.value,
  max: process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : undefined,
})

export const db = drizzle(connection, {
  schema,
})

export type db = typeof db
