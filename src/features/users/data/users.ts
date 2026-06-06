import type { XTableSortState } from '../../../components/XTable'

export interface UserRow {
  id: number
  name: string
  department: string
  status: 'enabled' | 'disabled'
  role: string
  createdAt: string
}

export interface UserQueryState {
  keyword: string
  includeDisabled: boolean
}

const departments = ['产品中心', '研发平台', '供应链', '财务共享', '运营支持']
const roles = ['管理员', '运营', '财务', '审计', '访客']

export function createUsers(size = 58): UserRow[] {
  return Array.from({ length: size }, (_, index): UserRow => ({
    id: index + 1,
    name: `用户 ${index + 1}`,
    department: departments[index % departments.length],
    status: index % 5 === 0 ? 'disabled' : 'enabled',
    role: roles[index % roles.length],
    createdAt: `2026-05-${String((index % 28) + 1).padStart(2, '0')} 10:${String(index % 60).padStart(2, '0')}`,
  }))
}

export function wait(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

export function filterUsers(
  users: UserRow[],
  params: UserQueryState,
  sort: XTableSortState,
  page: number,
  pageSize: number,
) {
  let list = users.filter((user) => {
    const matchKeyword = params.keyword
      ? user.name.includes(params.keyword) || user.department.includes(params.keyword) || user.role.includes(params.keyword)
      : true
    const matchStatus = params.includeDisabled ? true : user.status === 'enabled'

    return matchKeyword && matchStatus
  })

  if (sort.prop === 'createdAt' && sort.order) {
    list = [...list].sort((left, right) => {
      const result = left.createdAt.localeCompare(right.createdAt)
      return sort.order === 'ascending' ? result : -result
    })
  }

  const start = (page - 1) * pageSize

  return {
    list: list.slice(start, start + pageSize),
    total: list.length,
  }
}

export function findUser(users: UserRow[], id: number) {
  return users.find((item) => item.id === id) ?? null
}

export function buildUserStats(users: UserRow[]) {
  const enabled = users.filter((user) => user.status === 'enabled').length
  const disabled = users.length - enabled

  return [
    { label: '成员总数', value: users.length, tone: 'accent' as const },
    { label: '启用成员', value: enabled, tone: 'success' as const },
    { label: '停用成员', value: disabled, tone: 'warning' as const },
  ]
}
