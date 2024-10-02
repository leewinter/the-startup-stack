import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'
import { Resource } from 'sst'

import {
  permission,
  permissionRelations,
  permissionToRole,
  permissionToRoleRelations,
} from '../permission.sql'
import { plan, planRelations } from '../plan.sql'
import { price, priceRelations } from '../price.sql'
import { role, roleRelations, roleToUser, roleToUserRelations } from '../role.sql'
import { subscription, subscriptionRelations } from '../subscription.sql'
import { user, userRelations, userImage, userImageRelations } from '../user.sql'

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

export const connection = new Pool({
  connectionString: Resource.DATABASE_URL.value,
  max: process.env.DB_MIGRATING || process.env.DB_SEEDING ? 1 : undefined,
})

export const db = drizzle(connection, {
  schema,
})

export type db = typeof db
