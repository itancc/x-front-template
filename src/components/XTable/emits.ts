import type { XTablePaginationChangePayload, XTableSortChangePayload } from './types'

export const xTableEmits = {
  'update:page': (value: number) => typeof value === 'number',
  'update:pageSize': (value: number) => typeof value === 'number',
  'pagination-change': (payload: XTablePaginationChangePayload) => typeof payload.page === 'number',
  'sort-change': (_payload: XTableSortChangePayload) => true,
  'selection-change': (_value: any[]) => true,
  refresh: () => true,
  'column-visibility-change': (_value: string[]) => true,
} as const