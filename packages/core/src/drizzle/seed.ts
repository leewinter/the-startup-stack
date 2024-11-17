import { db, schema } from '@company/core/src/drizzle/index'
import permissionSeed from '../permission/seed'
import roleSeed from '../role/seed'
import userSeed from '../user/seed'
import planSeed from '../plan/seed'

for (const table of [
  schema.permissionToRole,
  schema.roleToUser,
  schema.subscription,
  schema.price,
  schema.userImage,
  schema.user,
  schema.role,
  schema.permission,
  schema.plan,
]) {
  // await db.execute(
  //   sql.raw(`TRUNCATE TABLE ${getTableName(table)} RESTART IDENTITY CASCADE`),
  // )
  await db.delete(table)
}

await permissionSeed()
console.log('Created permissions')
await roleSeed()
console.log('Created roles')
await userSeed()
console.log('Created users')
await planSeed()
console.log('Created plans')
