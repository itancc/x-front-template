import {
  buildUserStats,
  createUsers,
  filterUsers,
  findUser,
  wait,
} from '../data/users'
import type { IUserRepository } from './types'

let users = createUsers()

export const mockUserRepository: IUserRepository = {
  async fetchList(query) {
    await wait(300)
    return filterUsers(users, query.params, query.sort, query.page, query.pageSize)
  },

  async fetchStats() {
    await wait(120)
    return buildUserStats(users)
  },

  async fetchById(id) {
    await wait(120)
    return findUser(users, id)
  },

  async toggleStatus(id) {
    const user = findUser(users, id)
    if (!user) {
      return null
    }

    user.status = user.status === 'enabled' ? 'disabled' : 'enabled'
    await wait(180)
    return user
  },

  async deleteById(id) {
    users = users.filter((user) => user.id !== id)
    await wait(180)
  },

  async batchEnable(ids) {
    if (ids.length === 0) {
      return
    }

    users = users.map((user) => (ids.includes(user.id) ? { ...user, status: 'enabled' } : user))
    await wait(180)
  },
}
