<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { prefetchAsyncRoute, type AsyncRouteKey, type DynamicMenuGroup, type DynamicMenuItem } from '../../../router/async-routes'
import { useAuthStore } from '../../../stores/auth'
import { usePermissionStore } from '../../../stores/permission'
import { useUiStore } from '../../../stores/ui'

const route = useRoute()
const authStore = useAuthStore()
const permissionStore = usePermissionStore()
const uiStore = useUiStore()

type OverviewMenuItem = Omit<DynamicMenuItem, 'routeKey'> & {
  routeKey?: AsyncRouteKey
}

interface SidebarMenuGroup extends Omit<DynamicMenuGroup, 'items'> {
  items: Array<DynamicMenuItem | OverviewMenuItem>
}

const overviewGroup: SidebarMenuGroup = {
  title: '总览',
  items: [{ title: '工作台', path: '/dashboard', permission: 'dashboard:read' }],
}

const visibleGroups = computed<SidebarMenuGroup[]>(() => {
  if (authStore.hasPermission('dashboard:read')) {
    return [overviewGroup, ...permissionStore.menuGroups]
  }

  return permissionStore.menuGroups
})

function isActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}

function prefetchMenuItem(routeKey?: AsyncRouteKey) {
  if (!routeKey) {
    return
  }

  void prefetchAsyncRoute(routeKey)
}
</script>

<template>
  <aside :class="['app-sidebar', uiStore.sidebarCollapsed && 'is-collapsed']">
    <div class="app-sidebar__brand">
      <div class="brand-mark">X</div>
      <div v-if="!uiStore.sidebarCollapsed" class="brand-copy">
        <strong>X Front Template</strong>
        <span>Enterprise Vue 3 + TSX</span>
      </div>
    </div>

    <nav class="app-sidebar__nav">
      <section v-for="group in visibleGroups" :key="group.title" class="nav-group">
        <p v-if="!uiStore.sidebarCollapsed" class="nav-group__title">{{ group.title }}</p>
        <RouterLink
          v-for="item in group.items"
          :key="item.path"
          :to="item.path"
          :class="['nav-item', isActive(item.path) && 'is-active']"
          @mouseenter="prefetchMenuItem(item.routeKey)"
          @focus="prefetchMenuItem(item.routeKey)"
        >
          <span class="nav-item__dot" />
          <span v-if="!uiStore.sidebarCollapsed">{{ item.title }}</span>
        </RouterLink>
      </section>
    </nav>

    <button class="sidebar-toggle" type="button" @click="uiStore.toggleSidebarCollapsed()">
      {{ uiStore.sidebarCollapsed ? '展开' : '收起' }}
    </button>
  </aside>
</template>

<style scoped>
.app-sidebar {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 280px;
  padding: 18px 14px 16px;
  border-right: 1px solid var(--app-border);
  background:
    linear-gradient(180deg, rgba(10, 14, 25, 0.92), rgba(12, 16, 31, 0.86)),
    radial-gradient(circle at top, var(--app-accent-soft-strong), transparent 34%);
  color: rgba(241, 245, 249, 0.96);
}

.app-sidebar.is-collapsed {
  width: 94px;
}

.app-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 8px 10px;
}

.brand-mark {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: var(--app-gradient-primary);
  color: #04111f;
  font-weight: 800;
  box-shadow: 0 14px 28px var(--app-accent-ring);
}

.brand-copy {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand-copy strong {
  font-size: 15px;
  letter-spacing: 0.03em;
}

.brand-copy span {
  color: rgba(226, 232, 240, 0.68);
  font-size: 12px;
}

.app-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  overflow-y: auto;
  padding-right: 2px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.nav-group__title {
  margin: 0 0 2px;
  padding: 0 12px;
  color: rgba(148, 163, 184, 0.9);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 0 14px;
  border-radius: 14px;
  color: rgba(226, 232, 240, 0.88);
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
}

.nav-item:hover,
.nav-item.is-active {
  color: #f8fafc;
  background: var(--app-accent-soft);
  transform: translateX(2px);
}

.nav-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.8);
}

.nav-item.is-active .nav-item__dot {
  background: var(--app-accent);
  box-shadow: 0 0 0 4px var(--app-accent-soft);
}

.sidebar-toggle {
  margin-top: auto;
  min-height: 42px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.68);
  color: rgba(226, 232, 240, 0.9);
}

@media (max-width: 1024px) {
  .app-sidebar {
    width: 100%;
    border-right: 0;
    border-bottom: 1px solid var(--app-border);
  }

  .app-sidebar.is-collapsed {
    width: 100%;
  }
}
</style>
