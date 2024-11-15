import { Permission } from '.'

export default async function seed() {
  const entities = ['user'] as const
  const actions = ['create', 'read', 'update', 'delete'] as const
  const accesses = ['own', 'any'] as const
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        await Permission.insert({ entity, action, access })
      }
    }
  }
}
