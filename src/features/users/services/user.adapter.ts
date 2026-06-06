import type { UserRow } from '../data/users'

export interface UserStatsCardModel {
  label: string
  value: number
  tone: 'accent' | 'success' | 'warning'
}

export interface UserRemoteDTO {
  user_id: number
  user_name: string
  department_name: string
  status: 0 | 1
  role_name: string
  created_at: string
}

export interface UserStatsRemoteDTO {
  total_users: number
  enabled_users: number
  disabled_users: number
}

export interface UserListRemoteResult {
  records: UserRemoteDTO[]
  total: number
}

export function toUserRow(dto: UserRemoteDTO): UserRow {
  return {
    id: dto.user_id,
    name: dto.user_name,
    department: dto.department_name,
    status: dto.status === 1 ? 'enabled' : 'disabled',
    role: dto.role_name,
    createdAt: dto.created_at,
  }
}

export function toUserRows(dtos: UserRemoteDTO[]) {
  return dtos.map(toUserRow)
}

export function toUserStatsCards(dto: UserStatsRemoteDTO): UserStatsCardModel[] {
  return [
    { label: '成员总数', value: dto.total_users, tone: 'accent' },
    { label: '启用成员', value: dto.enabled_users, tone: 'success' },
    { label: '停用成员', value: dto.disabled_users, tone: 'warning' },
  ]
}
