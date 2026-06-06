import { computed, ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

import type { XTableColumn } from '../types'
import { getColumnKey, isVisibleColumn, readStoredColumns, writeStoredColumns } from '../utils'

interface UseColumnVisibilityOptions<T> {
  columns: ComputedRef<Array<XTableColumn<T>>>
  storageKey: Ref<string>
  onChange?: (value: string[]) => void
}

export function useColumnVisibility<T>(options: UseColumnVisibilityOptions<T>) {
  const visibleColumnKeys = ref<string[]>([])

  const normalizedColumns = computed(() => options.columns.value.filter(isVisibleColumn))

  const persistableColumns = computed(() => {
    return normalizedColumns.value
      .map((column, index) => ({
        column,
        key: getColumnKey(column, index),
      }))
      .filter(({ column }) => column.persist !== false && column.type !== 'selection' && column.type !== 'expand')
  })

  const allPersistableColumnKeys = computed(() => persistableColumns.value.map(({ key }) => key))

  const initialVisibleKeys = computed(() => {
    return persistableColumns.value
      .filter(({ column }) => column.visible !== false)
      .map(({ key }) => key)
  })

  const effectiveVisibleColumnKeys = computed(() => {
    if (!options.storageKey.value || visibleColumnKeys.value.length === 0) {
      return initialVisibleKeys.value
    }

    return visibleColumnKeys.value
  })

  const finalColumns = computed(() => {
    return normalizedColumns.value.filter((column, index) => {
      if (column.type === 'selection' || column.type === 'expand' || column.persist === false) {
        return column.visible !== false
      }

      return effectiveVisibleColumnKeys.value.includes(getColumnKey(column, index))
    })
  })

  watch(
    [allPersistableColumnKeys, initialVisibleKeys, options.storageKey],
    ([keys, defaults, storageKey]) => {
      if (!storageKey) {
        visibleColumnKeys.value = defaults
        return
      }

      const storedKeys = readStoredColumns(storageKey)
      const nextKeys = (storedKeys ?? defaults).filter((key) => keys.includes(key))
      visibleColumnKeys.value = nextKeys.length > 0 ? nextKeys : defaults
    },
    { immediate: true },
  )

  watch(
    visibleColumnKeys,
    (value) => {
      if (options.storageKey.value) {
        writeStoredColumns(options.storageKey.value, value)
      }

      options.onChange?.(value)
    },
    { deep: true },
  )

  function toggleColumn(key: string) {
    const active = effectiveVisibleColumnKeys.value.includes(key)

    if (active && effectiveVisibleColumnKeys.value.length === 1) {
      return
    }

    visibleColumnKeys.value = active
      ? effectiveVisibleColumnKeys.value.filter((item) => item !== key)
      : [...effectiveVisibleColumnKeys.value, key]
  }

  function resetColumnVisibility() {
    visibleColumnKeys.value = initialVisibleKeys.value
  }

  return {
    effectiveVisibleColumnKeys,
    finalColumns,
    persistableColumns,
    resetColumnVisibility,
    toggleColumn,
  }
}