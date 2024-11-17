import { Permission } from '.'

export default async function seed() {
  for (const entity of Permission.entities) {
    for (const action of Permission.actions) {
      for (const access of Permission.accesses) {
        await Permission.insert({ entity, action, access })
      }
    }
  }
}
