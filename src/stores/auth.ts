import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { usePermissionStore } from './permission'

const AUTH_STORAGE_KEY = 'x-front-template:auth'

export interface AuthUser {
  id: string
  name: string
  role: string
  department: string
  avatar: string
  permissions: string[]
}

interface LoginPayload {
  username: string
  password: string
}

interface AuthSnapshot {
  token: string
  user: AuthUser | null
}

function readSnapshot(): AuthSnapshot {
  if (typeof window === 'undefined') {
    return { token: '', user: null }
  }

  try {
    const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY)
    if (!rawValue) {
      return { token: '', user: null }
    }

    const parsed = JSON.parse(rawValue) as AuthSnapshot
    return {
      token: typeof parsed.token === 'string' ? parsed.token : '',
      user: parsed.user && typeof parsed.user === 'object' ? parsed.user : null,
    }
  } catch {
    return { token: '', user: null }
  }
}

function persistSnapshot(snapshot: AuthSnapshot) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(snapshot))
}

function createPermissions(username: string) {
  if (username.toLowerCase().includes('viewer')) {
    return ['dashboard:read', 'message:todo:read']
  }

  return [
    'dashboard:read',
    'template:form:read',
    'template:detail:read',
    'message:todo:read',
    'component:showcase:read',
    'user:list:view',
    'user:list:edit',
    'user:list:delete',
    'system:setting:read',
    'system:setting:edit',
  ]
}

export const useAuthStore = defineStore('auth', () => {
  const snapshot = readSnapshot()
  const token = ref(snapshot.token)
  const user = ref<AuthUser | null>(snapshot.user)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  function syncStorage() {
    persistSnapshot({ token: token.value, user: user.value })
  }

  async function login(payload: LoginPayload) {
    const username = payload.username.trim() || 'admin'
    token.value = `mock-token:${Date.now()}`
    user.value = {
      id: 'u-10086',
      name: username,
      role: username.toLowerCase().includes('viewer') ? '浏览者' : '管理员',
      department: '数字化平台部',
      avatar: username.slice(0, 1).toUpperCase(),
      permissions: createPermissions(username),
    }

    syncStorage()
  }

  function logout() {
    const permissionStore = usePermissionStore()
    token.value = ''
    user.value = null
    permissionStore.reset()
    syncStorage()
  }

  function hasPermission(permission?: string) {
    if (!permission) {
      return true
    }

    return user.value?.permissions.includes(permission) ?? false
  }

  return {
    hasPermission,
    isAuthenticated,
    login,
    logout,
    token,
    user,
  }
})