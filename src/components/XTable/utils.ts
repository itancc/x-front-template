import type { XTableAction, XTableColumn } from './types'

export function isVisibleColumn<T>(column: XTableColumn<T>) {
  if (typeof column.permission === 'function') {
    return column.permission(column)
  }

  return column.permission !== false
}

export function isVisibleAction<T>(action: XTableAction<T>, row: T) {
  if (typeof action.hidden === 'function') {
    return !action.hidden(row)
  }

  return action.hidden !== true
}

export function hasPermission<T>(action: XTableAction<T>, row: T) {
  if (typeof action.permission === 'function') {
    return action.permission(row)
  }

  return action.permission !== false
}

export function isActionDisabled<T>(action: XTableAction<T>, row: T) {
  if (typeof action.disabled === 'function') {
    return action.disabled(row)
  }

  return action.disabled === true
}

export function resolveRowKey<T>(rowKey: string | ((row: T) => string), row: T) {
  if (typeof rowKey === 'function') {
    return rowKey(row)
  }

  return String(row[rowKey as keyof T] ?? '')
}

export function getColumnKey<T>(column: XTableColumn<T>, index: number) {
  return String(column.key ?? column.prop ?? `column-${index}`)
}

export function readStoredColumns(storageKey: string) {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const rawValue = window.localStorage.getItem(storageKey)

    if (!rawValue) {
      return null
    }

    const parsed = JSON.parse(rawValue)
    return Array.isArray(parsed) ? parsed.filter((item) => typeof item === 'string') : null
  } catch {
    return null
  }
}

export function writeStoredColumns(storageKey: string, value: string[]) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(storageKey, JSON.stringify(value))
}

export function getAttrValue<T>(source: Record<string, unknown>, keys: string[], fallback: T): T {
  for (const key of keys) {
    if (key in source) {
      return source[key] as T
    }
  }

  return fallback
}

export function omitKeys(source: Record<string, unknown>, keys: string[]) {
  const target: Record<string, unknown> = {}

  Object.entries(source).forEach(([key, value]) => {
    if (!keys.includes(key)) {
      target[key] = value
    }
  })

  return target
}