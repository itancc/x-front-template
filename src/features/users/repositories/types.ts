import type { XTableSortState } from '../../../components/XTable'
import type { UserQueryState, UserRow } from '../data/users'
import type { UserStatsCardModel } from '../services/user.adapter'

export interface UserListQuery {
  page: number
  pageSize: number
  params: UserQueryState
  sort: XTableSortState
}

export interface UserListResult {
  list: UserRow[]
  total: number
}

export interface IUserRepository {
  fetchList(query: UserListQuery): Promise<UserListResult>
  fetchStats(): Promise<UserStatsCardModel[]>
  fetchById(id: number): Promise<UserRow | null>
  toggleStatus(id: number): Promise<UserRow | null>
  deleteById(id: number): Promise<void>
  batchEnable(ids: number[]): Promise<void>
}
