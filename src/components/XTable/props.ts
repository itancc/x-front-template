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
} as const