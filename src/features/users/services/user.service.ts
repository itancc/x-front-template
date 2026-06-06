import { runtimeConfig } from '../../../config/runtime'
import type { XTableSortState } from '../../../components/XTable'
import type { UserQueryState, UserRow } from '../data/users'
import { userRepository } from '../repositories'

export interface UserStatsCard {
  label: string
  value: number
  tone: 'accent' | 'success' | 'warning'
}

interface UserListPayload {
  page: number
  pageSize: number
  params: UserQueryState
  sort: XTableSortState
}

interface UserListResult {
  list: UserRow[]
  total: number
}

export async function fetchUserList(payload: UserListPayload): Promise<UserListResult> {
  return userRepository.fetchList(payload)
}

export async function fetchUserStats(): Promise<UserStatsCard[]> {
  return userRepository.fetchStats()
}

export async function fetchUserById(id: number): Promise<UserRow | null> {
  return userRepository.fetchById(id)
}

export async function toggleUserStatus(id: number): Promise<UserRow | null> {
  return userRepository.toggleStatus(id)
}

export async function deleteUser(id: number): Promise<void> {
  await userRepository.deleteById(id)
}

export async function batchEnableUsers(ids: number[]): Promise<void> {
  await userRepository.batchEnable(ids)
}

export const userApiMode = runtimeConfig.apiMode
