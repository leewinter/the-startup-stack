import { db, schema } from '#core/drizzle'
import permissionSeed from '../permission/seed.ts'
import roleSeed from '../role/seed.ts'
import userSeed from '../user/seed.ts'
import planSeed from '../plan/seed.ts'

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
