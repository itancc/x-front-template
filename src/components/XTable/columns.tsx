import type { XTableAction, XTableColumn } from './types'

interface TextColumnFactory<Row> {
  key: string
  prop: keyof Row | string
  label: string
  minWidth?: number
  width?: number
}

interface DateTimeColumnFactory<Row> extends TextColumnFactory<Row> {}

interface ActionsColumnFactory<Row> {
  key: string
  label?: string
  minWidth?: number
  width?: number
  actions: XTableAction<Row>[]
}

export function createSelectionColumn<Row>(): XTableColumn<Row> {
  return {
    key: 'selection',
    label: '',
    width: 52,
    align: 'center',
    type: 'selection',
    fixed: 'left',
  }
}

export function createIndexColumn<Row>(): XTableColumn<Row> {
  return {
    key: 'index',
    label: '#',
    width: 56,
    align: 'center',
    type: 'index',
    fixed: 'left',
  }
}

export function createTextColumn<Row>(factory: TextColumnFactory<Row>): XTableColumn<Row> {
  return {
    key: factory.key,
    prop: factory.prop,
    label: factory.label,
    minWidth: factory.minWidth ?? 140,
    width: factory.width,
    showOverflowTooltip: true,
  }
}

export function createDateTimeColumn<Row>(factory: DateTimeColumnFactory<Row>): XTableColumn<Row> {
  return {
    key: factory.key,
    prop: factory.prop,
    label: factory.label,
    minWidth: factory.minWidth ?? 180,
    width: factory.width,
    sortable: 'custom',
    showOverflowTooltip: true,
  }
}

export function createActionsColumn<Row>(factory: ActionsColumnFactory<Row>): XTableColumn<Row> {
  return {
    key: factory.key,
    label: factory.label ?? '操作',
    minWidth: factory.minWidth ?? 220,
    width: factory.width,
    align: 'right',
    fixed: 'right',
    actions: factory.actions,
  }
}
