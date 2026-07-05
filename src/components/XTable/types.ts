import type { VNodeChild } from 'vue'

export type XTableSortOrder = 'ascending' | 'descending' | null

export interface XTableSortState {
  prop: string
  order: XTableSortOrder
}

export interface XTableRenderContext<Row> {
  row: Row
  $index: number
}

export interface XTableAction<Row> {
  key: string
  label: string
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  permission?: (row: Row) => boolean
  disabled?: (row: Row) => boolean
  confirm?: (row: Row) => string
  onClick: (row: Row) => Promise<void> | void
}

export interface XTableColumn<Row> {
  key: string
  prop?: keyof Row | string
  label: string
  width?: number
  minWidth?: number
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: boolean | 'custom'
  showOverflowTooltip?: boolean
  type?: 'selection' | 'index'
  actions?: XTableAction<Row>[]
  render?: (context: XTableRenderContext<Row>) => VNodeChild
}

export interface XTablePagination {
  page: number
  pageSize: number
  total: number
}
