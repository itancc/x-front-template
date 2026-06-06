import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const UI_STORAGE_KEY = 'x-front-template:ui'

export interface VisitedTab {
  path: string
  title: string
  affix?: boolean
}

interface UISnapshot {
  theme: 'aurora' | 'midnight'
  sidebarCollapsed: boolean
  visitedTabs: VisitedTab[]
}

function createDefaultSnapshot(): UISnapshot {
  return {
    theme: 'aurora',
    sidebarCollapsed: false,
    visitedTabs: [],
  }
}

function readSnapshot(): UISnapshot {
  if (typeof window === 'undefined') {
    return createDefaultSnapshot()
  }

  try {
    const rawValue = window.localStorage.getItem(UI_STORAGE_KEY)
    if (!rawValue) {
      return createDefaultSnapshot()
    }

    const parsed = JSON.parse(rawValue) as UISnapshot
    return {
      theme: parsed.theme === 'midnight' ? 'midnight' : 'aurora',
      sidebarCollapsed: Boolean(parsed.sidebarCollapsed),
      visitedTabs: Array.isArray(parsed.visitedTabs) ? parsed.visitedTabs : [],
    }
  } catch {
    return createDefaultSnapshot()
  }
}

function persistSnapshot(snapshot: UISnapshot) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(snapshot))
}

function applyTheme(theme: UISnapshot['theme']) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
}

export const useUiStore = defineStore('ui', () => {
  const snapshot = readSnapshot()
  const theme = ref<UISnapshot['theme']>(snapshot.theme)
  const sidebarCollapsed = ref(snapshot.sidebarCollapsed)
  const visitedTabs = ref<VisitedTab[]>(snapshot.visitedTabs)

  const pinnedTabs = computed(() => visitedTabs.value.filter((tab) => tab.affix))

  function syncStorage() {
    const nextSnapshot: UISnapshot = {
      theme: theme.value,
      sidebarCollapsed: sidebarCollapsed.value,
      visitedTabs: visitedTabs.value,
    }

    persistSnapshot(nextSnapshot)
    applyTheme(theme.value)
  }

  function toggleTheme() {
    theme.value = theme.value === 'aurora' ? 'midnight' : 'aurora'
    syncStorage()
  }

  function setSidebarCollapsed(value: boolean) {
    sidebarCollapsed.value = value
    syncStorage()
  }

  function toggleSidebarCollapsed() {
    setSidebarCollapsed(!sidebarCollapsed.value)
  }

  function addVisitedView(route: RouteLocationNormalizedLoaded) {
    if (!route.meta.title || route.meta.fullScreen) {
      return
    }

    const path = route.path
    const title = String(route.meta.title)

    if (visitedTabs.value.some((item) => item.path === path)) {
      return
    }

    visitedTabs.value = [
      ...visitedTabs.value,
      {
        path,
        title,
        affix: Boolean(route.meta.affix),
      },
    ]
    syncStorage()
  }

  function removeVisitedView(path: string) {
    visitedTabs.value = visitedTabs.value.filter((item) => item.path !== path || item.affix)
    syncStorage()
  }

  function clearVisitedViews() {
    visitedTabs.value = visitedTabs.value.filter((item) => item.affix)
    syncStorage()
  }

  applyTheme(theme.value)

  return {
    addVisitedView,
    clearVisitedViews,
    pinnedTabs,
    removeVisitedView,
    setSidebarCollapsed,
    sidebarCollapsed,
    theme,
    toggleSidebarCollapsed,
    toggleTheme,
    visitedTabs,
  }
})