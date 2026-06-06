import { h } from 'vue'
import { ElTag } from 'element-plus'
import type { TagProps } from 'element-plus'

import type { XTableAction, XTableColumn, XTableRenderScope } from './types'

export function createSelectionColumn<T>(options: Partial<XTableColumn<T>> = {}): XTableColumn<T> {
  return {
    type: 'selection',
    width: 54,
    reserveSelection: true,
    ...options,
  }
}

export function createIndexColumn<T>(options: Partial<XTableColumn<T>> = {}): XTableColumn<T> {
  return {
    type: 'index',
    label: '#',
    width: 64,
    align: 'center',
    ...options,
  }
}

export function createTextColumn<T>(
  options: Partial<XTableColumn<T>> & { prop: keyof T | string; label: string },
): XTableColumn<T> {
  return {
    type: 'default',
    showOverflowTooltip: true,
    minWidth: 140,
    ...options,
  }
}

export function createDateTimeColumn<T>(
  options: Partial<XTableColumn<T>> & { prop: keyof T | string; label: string },
): XTableColumn<T> {
  return {
    type: 'default',
    sortable: 'custom',
    minWidth: 180,
    ...options,
  }
}

export function createStatusTagColumn<T>(
  options: Partial<XTableColumn<T>> & {
    prop: keyof T | string
    label: string
    resolveTagType: (scope: XTableRenderScope<T>) => TagProps['type']
    text: (scope: XTableRenderScope<T>) => string
  },
): XTableColumn<T> {
  return {
    type: 'default',
    align: 'center',
    width: 110,
    ...options,
    render: (scope) => h(ElTag, { type: options.resolveTagType(scope) }, () => options.text(scope)),
  }
}

export function createActionsColumn<T>(
  options: Partial<XTableColumn<T>> & { actions: Array<XTableAction<T>> },
): XTableColumn<T> {
  return {
    type: 'actions',
    label: '操作',
    minWidth: 220,
    fixed: 'right',
    persist: false,
    ...options,
  }
}
