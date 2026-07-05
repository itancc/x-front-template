import type { AsyncRouteKey, DynamicMenuGroup } from '../router/async-routes'

export interface AppSpace {
  id: string
  name: string
  icon: string
  defaultPath: string
  routeKeys: AsyncRouteKey[]
  menuGroups?: DynamicMenuGroup[]
  enabled: boolean
}

export const appSpaces: AppSpace[] = [
  {
    id: 'crm',
    name: 'CRM 空间',
    icon: 'C',
    defaultPath: '/dashboard',
    routeKeys: [
      'users',
      'user-detail',
      'template-form',
      'template-detail',
      'messages-todo',
      'component-showcase',
      'system-settings',
    ],
    enabled: true,
  },
]

export const defaultAppSpaceId = appSpaces.find((s) => s.enabled)?.id ?? 'crm'

export function getEnabledAppSpaces(): AppSpace[] {
  return appSpaces.filter((s) => s.enabled)
}

export function getAppSpaceById(id: string): AppSpace | undefined {
  return appSpaces.find((s) => s.id === id)
}
