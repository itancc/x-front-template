import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

const UI_STORAGE_KEY = 'x-front-template:ui'

// --- Types ------------------------------------------------------------------
export type ColorMode = 'light' | 'dark'
export type ColorScheme =
  | 'blue' | 'sky' | 'indigo' | 'violet'
  | 'rose' | 'red' | 'orange' | 'amber'
  | 'lime' | 'green' | 'emerald' | 'cyan'
export type FontFamilyMode = 'sans-serif' | 'serif' | 'monospace' | 'comic'
// ThemeBase kept for API compatibility
export type ThemeBase = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'
export type RadiusMode = 'sharp' | 'soft' | 'pill'

// --- Palette tokens ---------------------------------------------------------
interface PaletteToken {
  accent: string
  accentStrong: string
  accentSoft: string
  accentBorder: string
}

const colorPalettes: Record<ColorScheme, PaletteToken> = {
  blue:    { accent: '#2563eb', accentStrong: '#1d4ed8', accentSoft: 'rgba(37,99,235,0.09)',   accentBorder: 'rgba(37,99,235,0.22)' },
  sky:     { accent: '#0284c7', accentStrong: '#0369a1', accentSoft: 'rgba(2,132,199,0.09)',   accentBorder: 'rgba(2,132,199,0.22)' },
  indigo:  { accent: '#4f46e5', accentStrong: '#4338ca', accentSoft: 'rgba(79,70,229,0.09)',   accentBorder: 'rgba(79,70,229,0.22)' },
  violet:  { accent: '#7c3aed', accentStrong: '#6d28d9', accentSoft: 'rgba(124,58,237,0.09)',  accentBorder: 'rgba(124,58,237,0.22)' },
  rose:    { accent: '#e11d48', accentStrong: '#be123c', accentSoft: 'rgba(225,29,72,0.09)',   accentBorder: 'rgba(225,29,72,0.22)' },
  red:     { accent: '#dc2626', accentStrong: '#b91c1c', accentSoft: 'rgba(220,38,38,0.09)',   accentBorder: 'rgba(220,38,38,0.22)' },
  orange:  { accent: '#ea580c', accentStrong: '#c2410c', accentSoft: 'rgba(234,88,12,0.09)',   accentBorder: 'rgba(234,88,12,0.22)' },
  amber:   { accent: '#d97706', accentStrong: '#b45309', accentSoft: 'rgba(217,119,6,0.09)',   accentBorder: 'rgba(217,119,6,0.22)' },
  lime:    { accent: '#65a30d', accentStrong: '#4d7c0f', accentSoft: 'rgba(101,163,13,0.10)',  accentBorder: 'rgba(101,163,13,0.24)' },
  green:   { accent: '#16a34a', accentStrong: '#15803d', accentSoft: 'rgba(22,163,74,0.10)',   accentBorder: 'rgba(22,163,74,0.24)' },
  emerald: { accent: '#059669', accentStrong: '#047857', accentSoft: 'rgba(5,150,105,0.10)',   accentBorder: 'rgba(5,150,105,0.24)' },
  cyan:    { accent: '#0891b2', accentStrong: '#0e7490', accentSoft: 'rgba(8,145,178,0.10)',   accentBorder: 'rgba(8,145,178,0.24)' },
}

// --- Radius tokens ----------------------------------------------------------
const radiusTokenMap: Record<RadiusMode, { xs: string; sm: string; base: string; lg: string }> = {
  sharp: { xs: '2px',  sm: '4px',  base: '6px',  lg: '8px'  },
  soft:  { xs: '3px',  sm: '5px',  base: '8px',  lg: '12px' },
  pill:  { xs: '6px',  sm: '10px', base: '16px', lg: '20px' },
}

// --- Font tokens ------------------------------------------------------------
const fontFamilyMap: Record<FontFamilyMode, string> = {
  'sans-serif': "Inter, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif",
  serif:        "'Source Serif 4', 'Noto Serif SC', 'Songti SC', serif",
  monospace:    "'JetBrains Mono', 'Cascadia Mono', Consolas, monospace",
  comic:        "'Comic Neue', 'LXGW WenKai', 'Microsoft YaHei', cursive",
}

// --- Snapshot ---------------------------------------------------------------
export interface VisitedTab {
  path: string
  title: string
  affix?: boolean
}

interface UISnapshot {
  colorMode: ColorMode
  colorScheme: ColorScheme
  fontFamily: FontFamilyMode
  themeBase: ThemeBase
  radiusMode: RadiusMode
  sidebarCollapsed: boolean
  visitedTabs: VisitedTab[]
}

function createDefaultSnapshot(): UISnapshot {
  return {
    colorMode: 'light',
    colorScheme: 'indigo',
    fontFamily: 'sans-serif',
    themeBase: 'neutral',
    radiusMode: 'soft',
    sidebarCollapsed: false,
    visitedTabs: [],
  }
}

function readSnapshot(): UISnapshot {
  if (typeof window === 'undefined') return createDefaultSnapshot()
  try {
    const raw = window.localStorage.getItem(UI_STORAGE_KEY)
    if (!raw) return createDefaultSnapshot()
    const parsed = JSON.parse(raw) as Partial<UISnapshot>
    const defaults = createDefaultSnapshot()
    return {
      colorMode:        parsed.colorMode === 'dark' ? 'dark' : 'light',
      colorScheme:      parsed.colorScheme && parsed.colorScheme in colorPalettes ? parsed.colorScheme : defaults.colorScheme,
      fontFamily:       parsed.fontFamily  && parsed.fontFamily  in fontFamilyMap  ? parsed.fontFamily  : defaults.fontFamily,
      themeBase:        parsed.themeBase   ?? defaults.themeBase,
      radiusMode:       parsed.radiusMode  ?? defaults.radiusMode,
      sidebarCollapsed: Boolean(parsed.sidebarCollapsed),
      visitedTabs:      Array.isArray(parsed.visitedTabs) ? parsed.visitedTabs : [],
    }
  } catch {
    return createDefaultSnapshot()
  }
}

// --- Apply theme to DOM -----------------------------------------------------
function applyTheme(snapshot: UISnapshot) {
  if (typeof document === 'undefined') return

  const root = document.documentElement

  // Light/dark switched via CSS data attribute selector
  root.dataset.colorMode = snapshot.colorMode

  // Accent palette
  const p = colorPalettes[snapshot.colorScheme]
  root.style.setProperty('--accent',        p.accent)
  root.style.setProperty('--accent-h',      p.accentStrong)
  root.style.setProperty('--accent-soft',   p.accentSoft)
  root.style.setProperty('--accent-border', p.accentBorder)
  root.style.setProperty('--accent-text',   '#ffffff')

  // Radius
  const r = radiusTokenMap[snapshot.radiusMode]
  root.style.setProperty('--r-xs', r.xs)
  root.style.setProperty('--r-sm', r.sm)
  root.style.setProperty('--r',    r.base)
  root.style.setProperty('--r-lg', r.lg)

  // Font family
  root.style.setProperty('--font-family', fontFamilyMap[snapshot.fontFamily])
}

function persistSnapshot(snapshot: UISnapshot) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(UI_STORAGE_KEY, JSON.stringify(snapshot))
  }
}

// --- Store ------------------------------------------------------------------
export const useUiStore = defineStore('ui', () => {
  const snapshot         = readSnapshot()
  const colorMode        = ref<ColorMode>(snapshot.colorMode)
  const colorScheme      = ref<ColorScheme>(snapshot.colorScheme)
  const fontFamily       = ref<FontFamilyMode>(snapshot.fontFamily)
  const themeBase        = ref<ThemeBase>(snapshot.themeBase)
  const radiusMode       = ref<RadiusMode>(snapshot.radiusMode)
  const sidebarCollapsed = ref(snapshot.sidebarCollapsed)
  const visitedTabs      = ref<VisitedTab[]>(snapshot.visitedTabs)

  const pinnedTabs = computed(() => visitedTabs.value.filter((t) => t.affix))

  function syncStorage() {
    const next: UISnapshot = {
      colorMode:        colorMode.value,
      colorScheme:      colorScheme.value,
      fontFamily:       fontFamily.value,
      themeBase:        themeBase.value,
      radiusMode:       radiusMode.value,
      sidebarCollapsed: sidebarCollapsed.value,
      visitedTabs:      visitedTabs.value,
    }
    persistSnapshot(next)
    applyTheme(next)
  }

  function setColorMode(value: ColorMode) {
    colorMode.value = value
    syncStorage()
  }

  function toggleTheme() {
    setColorMode(colorMode.value === 'light' ? 'dark' : 'light')
  }

  function setColorScheme(value: ColorScheme) {
    colorScheme.value = value
    syncStorage()
  }

  function setFontFamily(value: FontFamilyMode) {
    fontFamily.value = value
    syncStorage()
  }

  function setThemeBase(value: ThemeBase) {
    themeBase.value = value
    syncStorage()
  }

  function setRadiusMode(value: RadiusMode) {
    radiusMode.value = value
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
    if (!route.meta.title || route.meta.fullScreen) return
    const path  = route.path
    const title = String(route.meta.title)
    if (visitedTabs.value.some((t) => t.path === path)) return
    visitedTabs.value = [...visitedTabs.value, { path, title, affix: Boolean(route.meta.affix) }]
    syncStorage()
  }

  function removeVisitedView(path: string) {
    visitedTabs.value = visitedTabs.value.filter((t) => t.path !== path || t.affix)
    syncStorage()
  }

  function clearVisitedViews() {
    visitedTabs.value = visitedTabs.value.filter((t) => t.affix)
    syncStorage()
  }

  // Apply on store init
  applyTheme({
    colorMode:        colorMode.value,
    colorScheme:      colorScheme.value,
    fontFamily:       fontFamily.value,
    themeBase:        themeBase.value,
    radiusMode:       radiusMode.value,
    sidebarCollapsed: sidebarCollapsed.value,
    visitedTabs:      visitedTabs.value,
  })

  return {
    colorMode, colorScheme, fontFamily, themeBase, radiusMode,
    sidebarCollapsed, visitedTabs, pinnedTabs,
    addVisitedView, clearVisitedViews, removeVisitedView,
    setColorMode, toggleTheme,
    setColorScheme, setFontFamily, setThemeBase, setRadiusMode,
    setSidebarCollapsed, toggleSidebarCollapsed,
  }
})
