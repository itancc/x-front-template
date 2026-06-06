import type { DynamicMenuGroup, AsyncRouteKey } from '../../../router/async-routes'

interface BackendRouteConfigResponse {
  menuGroups: DynamicMenuGroup[]
  routeKeys: AsyncRouteKey[]
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

const adminConfig: BackendRouteConfigResponse = {
  menuGroups: [
    {
      title: '业务',
      items: [
        { title: '用户管理', path: '/users', routeKey: 'users', permission: 'user:list:view', order: 2 },
        { title: '标准表单', path: '/templates/form', routeKey: 'template-form', permission: 'template:form:read', order: 3 },
        { title: '标准详情', path: '/templates/detail', routeKey: 'template-detail', permission: 'template:detail:read', order: 4 },
        { title: '消息待办', path: '/messages/todo', routeKey: 'messages-todo', permission: 'message:todo:read', order: 5 },
      ],
    },
    {
      title: '组件',
      items: [
        {
          title: '组件封装',
          path: '/components/showcase',
          routeKey: 'component-showcase',
          permission: 'component:showcase:read',
          order: 6,
        },
      ],
    },
    {
      title: '系统',
      items: [
        { title: '系统设置', path: '/system/settings', routeKey: 'system-settings', permission: 'system:setting:read', order: 7 },
      ],
    },
  ],
  routeKeys: [
    'users',
    'user-detail',
    'template-form',
    'template-detail',
    'messages-todo',
    'component-showcase',
    'system-settings',
  ],
}

const viewerConfig: BackendRouteConfigResponse = {
  menuGroups: [
    {
      title: '业务',
      items: [{ title: '消息待办', path: '/messages/todo', routeKey: 'messages-todo', permission: 'message:todo:read', order: 5 }],
    },
  ],
  routeKeys: ['messages-todo'],
}

function filterMenuByPermissions(menuGroups: DynamicMenuGroup[], permissions: string[]) {
  return menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => (item.permission ? permissions.includes(item.permission) : true)),
    }))
    .filter((group) => group.items.length > 0)
}

export async function fetchUserRouteConfig(permissions: string[]): Promise<BackendRouteConfigResponse> {
  await sleep(120)

  const isViewer = permissions.length > 0 && permissions.every((item) => ['dashboard:read', 'message:todo:read'].includes(item))
  const baseConfig = isViewer ? viewerConfig : adminConfig

  const menuGroups = filterMenuByPermissions(baseConfig.menuGroups, permissions)
  const visibleRouteKeys = new Set<AsyncRouteKey>()

  menuGroups.forEach((group) => {
    group.items.forEach((item) => {
      visibleRouteKeys.add(item.routeKey)
      if (item.routeKey === 'users') {
        visibleRouteKeys.add('user-detail')
      }
    })
  })

  return {
    menuGroups,
    routeKeys: [...visibleRouteKeys],
  }
}
