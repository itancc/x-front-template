import type { TableColumnCtx, TableInstance } from 'element-plus'
import type { Ref, Slots, VNodeChild } from 'vue'

export type XTableAlign = 'left' | 'center' | 'right'
export type XTableColumnType = 'default' | 'index' | 'selection' | 'expand' | 'actions'
export type XTableSortOrder = 'ascending' | 'descending' | null

export interface XTablePagination {
  page: number
  pageSize: number
  total: number
  pageSizes?: number[]
  background?: boolean
  layout?: string
  paginationProps?: Record<string, unknown>
}

export interface XTableRenderScope<T = Record<string, unknown>> {
  row: T
  column: XTableColumn<T>
  $index: number
}

export interface XTableAction<T = Record<string, unknown>> {
  key: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  link?: boolean
  text?: boolean
  plain?: boolean
  permission?: boolean | ((row: T) => boolean)
  disabled?: boolean | ((row: T) => boolean)
  hidden?: boolean | ((row: T) => boolean)
  confirm?: string | ((row: T) => string)
  onClick?: (row: T, index: number) => void | Promise<void>
  buttonProps?: Record<string, unknown>
}

export interface XTableColumn<T = Record<string, unknown>> {
  type?: XTableColumnType
  key?: string
  prop?: keyof T | string
  label?: string
  width?: number | string
  minWidth?: number | string
  fixed?: true | 'left' | 'right'
  align?: XTableAlign
  headerAlign?: XTableAlign
  sortable?: boolean | 'custom'
  showOverflowTooltip?: boolean
  visible?: boolean
  persist?: boolean
  className?: string
  labelClassName?: string
  children?: Array<XTableColumn<T>>
  formatter?: (scope: XTableRenderScope<T>) => VNodeChild
  render?: (scope: XTableRenderScope<T>) => VNodeChild
  headerRender?: (column: XTableColumn<T>) => VNodeChild
  slot?: string
  headerSlot?: string
  emptyText?: string
  tagType?: (scope: XTableRenderScope<T>) => 'success' | 'info' | 'warning' | 'danger' | 'primary'
  selectable?: (row: T, index: number) => boolean
  reserveSelection?: boolean
  permission?: boolean | ((column: XTableColumn<T>) => boolean)
  actions?: Array<XTableAction<T>>
  columnProps?: Record<string, unknown>
}

export interface XTableExpose {
  clearSelection: () => void
  resetColumnVisibility: () => void
  tableRef: Ref<TableInstance | undefined>
}

export interface XTableSortState {
  prop?: string
  order: XTableSortOrder
}

export interface XTableRequestPayload<TParams extends object = Record<string, unknown>> {
  page: number
  pageSize: number
  params: TParams
  sort: XTableSortState
}

export interface XTableRequestResult<TRow> {
  list: TRow[]
  total: number
}

export interface UseTableRequestOptions<TRow, TParams extends object = Record<string, unknown>> {
  immediate?: boolean
  initialPage?: number
  initialPageSize?: number
  initialParams?: TParams
  request: (payload: XTableRequestPayload<TParams>) => Promise<XTableRequestResult<TRow>>
}

export interface XTablePaginationChangePayload {
  page: number
  pageSize: number
}

export interface XTableSortChangePayload {
  column: TableColumnCtx<Record<string, any>>
  prop: string
  order: XTableSortOrder
}

export interface XTableRenderContext<T = Record<string, unknown>> {
  slots: Slots
  runAction: (action: XTableAction<T>, row: T, index: number) => Promise<void>
  isActionLoading: (action: XTableAction<T>, row: T) => boolean
}