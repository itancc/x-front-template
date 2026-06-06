import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'

import type { XTableAction } from '../types'

interface UseTableActionsOptions<T> {
  resolveRowKey: (row: T) => string
}

export function useTableActions<T>(options: UseTableActionsOptions<T>) {
  const actionLoadingKeys = ref<string[]>([])

  async function runAction(action: XTableAction<T>, row: T, index: number) {
    const confirmMessage = typeof action.confirm === 'function' ? action.confirm(row) : action.confirm

    if (confirmMessage) {
      try {
        await ElMessageBox.confirm(confirmMessage, '请确认', {
          type: 'warning',
          confirmButtonText: '确认',
          cancelButtonText: '取消',
        })
      } catch {
        return
      }
    }

    if (!action.onClick) {
      return
    }

    const loadingKey = `${action.key}:${options.resolveRowKey(row)}`
    actionLoadingKeys.value = [...actionLoadingKeys.value, loadingKey]

    try {
      await action.onClick(row, index)
    } finally {
      actionLoadingKeys.value = actionLoadingKeys.value.filter((item) => item !== loadingKey)
    }
  }

  function isActionLoading(action: XTableAction<T>, row: T) {
    return actionLoadingKeys.value.includes(`${action.key}:${options.resolveRowKey(row)}`)
  }

  return {
    isActionLoading,
    runAction,
  }
}