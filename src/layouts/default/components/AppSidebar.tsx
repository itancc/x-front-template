/// <reference types="vue/jsx" />
import { computed, defineComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppSwitcher from './AppSwitcher'
import { getAppSpaceById } from '../../../config/app-spaces'
import { prefetchAsyncRoute, type AsyncRouteKey, type DynamicMenuItem } from '../../../router/async-routes'
import { useAuthStore } from '../../../stores/auth'
import { usePermissionStore } from '../../../stores/permission'
import { useUiStore } from '../../../stores/ui'

export default defineComponent({
  name: 'AppSidebar',
  setup() {
    const route = useRoute()
    const authStore = useAuthStore()
    const permissionStore = usePermissionStore()
    const uiStore = useUiStore()

    const activeSpace = computed(() => getAppSpaceById(uiStore.activeAppId))

    const overviewItem: DynamicMenuItem = {
      title: '工作台',
      path: '/dashboard',
      routeKey: 'users' as AsyncRouteKey,
      permission: 'dashboard:read',
    }

    const visibleGroups = computed(() => {
      const spaceRouteKeys = activeSpace.value?.routeKeys ?? []

      const filteredGroups = permissionStore.menuGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => spaceRouteKeys.includes(item.routeKey)),
        }))
        .filter((group) => group.items.length > 0)

      if (authStore.hasPermission('dashboard:read')) {
        return [
          { title: '总览', items: [overviewItem] },
          ...filteredGroups,
        ]
      }

      return filteredGroups
    })

    function isActive(path: string) {
      return route.path === path || route.path.startsWith(`${path}/`)
    }

    function prefetchMenuItem(routeKey?: AsyncRouteKey) {
      if (!routeKey) return
      void prefetchAsyncRoute(routeKey)
    }

    return () => {
      const collapsed = uiStore.sidebarCollapsed

      return (
        <aside
          class={['app-sidebar', collapsed && 'app-sidebar-collapsed']}
          style={{ transition: 'width .25s ease' }}
        >
          {/* App Switcher */}
          {!collapsed && <AppSwitcher />}
          {collapsed && (
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                padding: '8px 0',
              }}
            >
              <span class="app-switcher-mark">
                {activeSpace.value?.icon ?? 'X'}
              </span>
            </div>
          )}

          {/* Navigation */}
          <nav
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
              minHeight: 0,
              overflowY: 'auto',
              paddingRight: '2px',
            }}
          >
            {visibleGroups.value.map((group) => (
              <section
                key={group.title}
                style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
              >
                {!collapsed && (
                  <p class="nav-group-title">{group.title}</p>
                )}
                {group.items.map((item) => (
                  <RouterLink
                    key={item.path}
                    to={item.path}
                    class={['nav-item', isActive(item.path) && 'nav-item-active']}
                    onMouseenter={() => prefetchMenuItem(item.routeKey)}
                    onFocus={() => prefetchMenuItem(item.routeKey)}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '999px',
                        flexShrink: 0,
                        background: isActive(item.path)
                          ? 'var(--app-accent)'
                          : 'rgba(148,163,184,.8)',
                        boxShadow: isActive(item.path)
                          ? '0 0 0 4px var(--app-accent-soft)'
                          : 'none',
                      }}
                    />
                    {!collapsed && (
                      <span style={{ fontSize: '14px' }}>{item.title}</span>
                    )}
                  </RouterLink>
                ))}
              </section>
            ))}
          </nav>

          {/* Collapse toggle */}
          <button
            type="button"
            style={{
              marginTop: 'auto',
              minHeight: '42px',
              border: '1px solid rgba(148,163,184,.22)',
              borderRadius: '14px',
              background: 'rgba(15,23,42,.68)',
              color: 'rgba(226,232,240,.9)',
              cursor: 'pointer',
              fontSize: '13px',
            }}
            onClick={() => uiStore.toggleSidebarCollapsed()}
          >
            {collapsed ? '→' : '← 收起'}
          </button>
        </aside>
      )
    }
  },
})
