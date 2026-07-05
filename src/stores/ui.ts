import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

import { defaultAppSpaceId } from '../config/app-spaces'

const UI_STORAGE_KEY = 'x-front-template:ui'

export interface VisitedTab {
  path: string
  title: string
  affix?: boolean
}

export type ColorMode = 'light' | 'dark'
export type FontFamily = 'sans' | 'serif' | 'mono' | 'comic'
export type ThemeBase = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
export type CornerRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl'

export const ACCENT_COLORS = [
  '#3b82f6', '#60a5fa', '#6366f1', '#a855f7',
  '#ec4899', '#ef4444', '#f97316', '#eab308',
  '#84cc16', '#22c55e', '#10b981', '#06b6d4',
] as const

export type AccentColor = typeof ACCENT_COLORS[number]

interface UISnapshot {
  theme: 'aurora' | 'midnight'
  colorMode: ColorMode
  accentColor: string
  fontFamily: FontFamily
  themeBase: ThemeBase
  cornerRadius: CornerRadius
  sidebarCollapsed: boolean
  visitedTabs: VisitedTab[]
  activeAppId: string
}

function createDefaultSnapshot(): UISnapshot {
  return {
    theme: 'aurora',
    colorMode: 'light',
    accentColor: '#a47fb0',
    fontFamily: 'sans',
    themeBase: 'neutral',
    cornerRadius: 'lg',
    sidebarCollapsed: false,
    visitedTabs: [],
    activeAppId: defaultAppSpaceId,
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

    const d = createDefaultSnapshot()
    const parsed = JSON.parse(rawValue) as Partial<UISnapshot>
    return {
      theme: parsed.theme === 'midnight' ? 'midnight' : 'aurora',
      colorMode: parsed.colorMode === 'dark' ? 'dark' : 'light',
      accentColor: typeof parsed.accentColor === 'string' ? parsed.accentColor : d.accentColor,
      fontFamily: (['sans', 'serif', 'mono', 'comic'] as FontFamily[]).includes(parsed.fontFamily as FontFamily)
        ? (parsed.fontFamily as FontFamily)
        : d.fontFamily,
      themeBase: (['slate', 'gray', 'zinc', 'neutral', 'stone'] as ThemeBase[]).includes(parsed.themeBase as ThemeBase)
        ? (parsed.themeBase as ThemeBase)
        : d.themeBase,
      cornerRadius: (['none', 'sm', 'md', 'lg', 'xl'] as CornerRadius[]).includes(parsed.cornerRadius as CornerRadius)
        ? (parsed.cornerRadius as CornerRadius)
        : d.cornerRadius,
      sidebarCollapsed: Boolean(parsed.sidebarCollapsed),
      visitedTabs: Array.isArray(parsed.visitedTabs) ? parsed.visitedTabs : [],
      activeAppId: typeof parsed.activeAppId === 'string' ? parsed.activeAppId : d.activeAppId,
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

const FONT_FAMILY_MAP: Record<FontFamily, string> = {
  sans: "'Segoe UI Variable', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif",
  serif: "'Georgia', 'Noto Serif SC', serif",
  mono: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
  comic: "'Comic Sans MS', 'Chalkboard SE', cursive",
}

const RADIUS_MAP: Record<CornerRadius, string> = {
  none: '0px',
  sm: '6px',
  md: '10px',
  lg: '14px',
  xl: '20px',
}

function applyTheme(snapshot: UISnapshot) {
  if (typeof document === 'undefined') return

  const root = document.documentElement
  const isDark = snapshot.colorMode === 'dark'

  root.dataset.theme = isDark ? 'midnight' : 'aurora'
  root.dataset.colorMode = snapshot.colorMode
  root.dataset.fontFamily = snapshot.fontFamily
  root.dataset.themeBase = snapshot.themeBase
  root.dataset.cornerRadius = snapshot.cornerRadius

  root.style.setProperty('--app-accent-brand', snapshot.accentColor)
  root.style.setProperty('--font-body', FONT_FAMILY_MAP[snapshot.fontFamily])
  root.style.setProperty('--app-radius', RADIUS_MAP[snapshot.cornerRadius])
}

export const useUiStore = defineStore('ui', () => {
  const snapshot = readSnapshot()
  const theme = ref<UISnapshot['theme']>(snapshot.theme)
  const colorMode = ref<ColorMode>(snapshot.colorMode)
  const accentColor = ref<string>(snapshot.accentColor)
  const fontFamily = ref<FontFamily>(snapshot.fontFamily)
  const themeBase = ref<ThemeBase>(snapshot.themeBase)
  const cornerRadius = ref<CornerRadius>(snapshot.cornerRadius)
  const sidebarCollapsed = ref(snapshot.sidebarCollapsed)
  const visitedTabs = ref<VisitedTab[]>(snapshot.visitedTabs)
  const activeAppId = ref<string>(snapshot.activeAppId)
  const themeDrawerVisible = ref(false)

  const pinnedTabs = computed(() => visitedTabs.value.filter((tab) => tab.affix))

  function buildSnapshot(): UISnapshot {
    return {
      theme: theme.value,
      colorMode: colorMode.value,
      accentColor: accentColor.value,
      fontFamily: fontFamily.value,
      themeBase: themeBase.value,
      cornerRadius: cornerRadius.value,
      sidebarCollapsed: sidebarCollapsed.value,
      visitedTabs: visitedTabs.value,
      activeAppId: activeAppId.value,
    }
  }

  function syncStorage() {
    const next = buildSnapshot()
    persistSnapshot(next)
    applyTheme(next)
  }

  function toggleTheme() {
    colorMode.value = colorMode.value === 'dark' ? 'light' : 'dark'
    theme.value = colorMode.value === 'dark' ? 'midnight' : 'aurora'
    syncStorage()
  }

  function setColorMode(mode: ColorMode) {
    colorMode.value = mode
    theme.value = mode === 'dark' ? 'midnight' : 'aurora'
    syncStorage()
  }

  function setAccentColor(color: string) {
    accentColor.value = color
    syncStorage()
  }

  function setFontFamily(font: FontFamily) {
    fontFamily.value = font
    syncStorage()
  }

  function setThemeBase(base: ThemeBase) {
    themeBase.value = base
    syncStorage()
  }

  function setCornerRadius(radius: CornerRadius) {
    cornerRadius.value = radius
    syncStorage()
  }

  function setSidebarCollapsed(value: boolean) {
    sidebarCollapsed.value = value
    syncStorage()
  }

  function toggleSidebarCollapsed() {
    setSidebarCollapsed(!sidebarCollapsed.value)
  }

  function setActiveApp(id: string) {
    activeAppId.value = id
    syncStorage()
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

  applyTheme(snapshot)

  return {
    accentColor,
    activeAppId,
    addVisitedView,
    clearVisitedViews,
    colorMode,
    cornerRadius,
    fontFamily,
    pinnedTabs,
    removeVisitedView,
    setAccentColor,
    setActiveApp,
    setColorMode,
    setCornerRadius,
    setFontFamily,
    setSidebarCollapsed,
    setThemeBase,
    sidebarCollapsed,
    theme,
    themeBase,
    themeDrawerVisible,
    toggleSidebarCollapsed,
    toggleTheme,
    visitedTabs,
  }
})