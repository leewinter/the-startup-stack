import { Role } from '.'

export default async function seed() {
  await Role.insert('admin', 'Administrator role', 'any')
  await Role.insert('user', 'User role', 'own')
}
