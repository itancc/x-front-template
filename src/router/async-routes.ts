import type { RouteRecordRaw } from 'vue-router'

const UserListView = () => import('../features/users/pages/UserListView')
const UserDetailView = () => import('../features/users/pages/UserDetailView')
const SettingsView = () => import('../features/system/pages/SettingsView')
const StandardFormView = () => import('../features/templates/pages/StandardFormView')
const DetailTemplateView = () => import('../features/templates/pages/DetailTemplateView')
const TodoCenterView = () => import('../features/messages/pages/TodoCenterView')
const ComponentShowcaseView = () => import('../features/showcase/pages/ComponentShowcaseView')

type AsyncRouteLoader = () => Promise<unknown>
type AsyncRouteMeta = NonNullable<RouteRecordRaw['meta']>

export type AsyncRouteKey =
  | 'users'
  | 'user-detail'
  | 'system-settings'
  | 'template-form'
  | 'template-detail'
  | 'messages-todo'
  | 'component-showcase'

export interface DynamicMenuItem {
  title: string
  path: string
  routeKey: AsyncRouteKey
  permission?: string
  order?: number
}

export interface DynamicMenuGroup {
  title: string
  items: DynamicMenuItem[]
}

interface AsyncRouteDefinition {
  path: string
  name: string
  loader: AsyncRouteLoader
  meta: AsyncRouteMeta
}

const asyncRouteDefinitions: Record<AsyncRouteKey, AsyncRouteDefinition> = {

  users: {
    path: 'users',
    name: 'users',
    loader: UserListView,
    meta: {
      title: '用户管理',
      requiresAuth: true,
      permission: 'user:list:view',
      routeKey: 'users',
    },
  },
  'user-detail': {
    path: 'users/:id',
    name: 'user-detail',
    loader: UserDetailView,
    meta: {
      title: '用户详情',
      requiresAuth: true,
      hidden: true,
      permission: 'user:list:view',
      routeKey: 'user-detail',
    },
  },
  'system-settings': {
    path: 'system/settings',
    name: 'system-settings',
    loader: SettingsView,
    meta: {
      title: '系统设置',
      requiresAuth: true,
      permission: 'system:setting:read',
      routeKey: 'system-settings',
    },
  },
  'template-form': {
    path: 'templates/form',
    name: 'template-form',
    loader: StandardFormView,
    meta: {
      title: '标准表单',
      requiresAuth: true,
      permission: 'template:form:read',
      routeKey: 'template-form',
    },
  },
  'template-detail': {
    path: 'templates/detail',
    name: 'template-detail',
    loader: DetailTemplateView,
    meta: {
      title: '标准详情',
      requiresAuth: true,
      permission: 'template:detail:read',
      routeKey: 'template-detail',
    },
  },
  'messages-todo': {
    path: 'messages/todo',
    name: 'messages-todo',
    loader: TodoCenterView,
    meta: {
      title: '消息待办',
      requiresAuth: true,
      permission: 'message:todo:read',
      routeKey: 'messages-todo',
    },
  },
  'component-showcase': {
    path: 'components/showcase',
    name: 'component-showcase',
    loader: ComponentShowcaseView,
    meta: {
      title: '组件封装',
      requiresAuth: true,
      permission: 'component:showcase:read',
      routeKey: 'component-showcase',
    },
  },
}

const prefetchedRouteKeys = new Set<AsyncRouteKey>()

function createAsyncRoute(definition: AsyncRouteDefinition): RouteRecordRaw {
  return {
    path: definition.path,
    name: definition.name,
    component: definition.loader,
    meta: { ...definition.meta },
  }
}

export function resolveAsyncRoute(routeKey: AsyncRouteKey): RouteRecordRaw {
  return createAsyncRoute(asyncRouteDefinitions[routeKey])
}

export function prefetchAsyncRoute(routeKey: AsyncRouteKey): Promise<void> {
  if (prefetchedRouteKeys.has(routeKey)) {
    return Promise.resolve()
  }

  prefetchedRouteKeys.add(routeKey)

  return asyncRouteDefinitions[routeKey]
    .loader()
    .then(() => undefined)
    .catch(() => {
      prefetchedRouteKeys.delete(routeKey)
    })
}

export function prefetchAsyncRoutes(routeKeys: AsyncRouteKey[]): void {
  routeKeys.forEach((routeKey) => {
    void prefetchAsyncRoute(routeKey)
  })
}
