import type { PropType } from 'vue'

import type { XTableColumn, XTablePagination } from './types'

export const xTableProps = {
  columns: {
    type: Array as PropType<Array<XTableColumn<any>>>,
    default: () => [],
  },
  pagination: {
    type: Object as PropType<XTablePagination | undefined>,
    default: undefined,
  },
  storageKey: {
    type: String,
    default: '',
  },
  showColumnManager: {
    type: Boolean,
    default: true,
  },
  // Common pass-through attrs exposed as typed props for TSX usage
  data: {
    type: Array as PropType<Array<Record<string, unknown>>>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  loadingText: {
    type: String,
    default: undefined,
  },
  emptyText: {
    type: String,
    default: undefined,
  },
  rowKey: {
    type: [String, Function] as PropType<string | ((row: Record<string, unknown>) => string)>,
    default: 'id',
  },
} as const