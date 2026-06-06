/// <reference types="vue/jsx" />

import { ElButton, ElTableColumn, ElTag } from 'element-plus'
import type { VNodeChild } from 'vue'

import type { XTableColumn, XTableRenderContext, XTableRenderScope } from './types'
import { getColumnKey, hasPermission, isActionDisabled, isVisibleAction } from './utils'

function renderCellContent<T>(
  column: XTableColumn<T>,
  row: T,
  index: number,
  context: XTableRenderContext<T>,
): VNodeChild {
  const scope: XTableRenderScope<T> = { row, column, $index: index }

  if (column.render) {
    return column.render(scope)
  }

  if (column.slot && context.slots[column.slot]) {
    return context.slots[column.slot]?.(scope)
  }

  if (column.type === 'actions') {
    const actions = (column.actions ?? []).filter((action) => isVisibleAction(action, row) && hasPermission(action, row))

    if (actions.length === 0) {
      return <span class="x-table__actions-empty">-</span>
    }

    return (
      <div class="x-table__actions">
        {actions.map((action) => (
          <ElButton
            key={action.key}
            link={action.link ?? true}
            text={action.text}
            plain={action.plain}
            type={action.type}
            disabled={isActionDisabled(action, row)}
            loading={context.isActionLoading(action, row)}
            onClick={() => context.runAction(action, row, index)}
            {...action.buttonProps}
          >
            {action.label}
          </ElButton>
        ))}
      </div>
    )
  }

  if (column.formatter) {
    return column.formatter(scope)
  }

  const value = column.prop ? (row as Record<string, unknown>)[column.prop as string] : undefined

  if (column.tagType) {
    return <ElTag type={column.tagType(scope)}>{value as VNodeChild}</ElTag>
  }

  if (value == null) {
    return column.emptyText ?? '-'
  }

  return typeof value === 'object' ? String(value) : (value as VNodeChild)
}

export function renderTableColumn<T>(column: XTableColumn<T>, index: number, context: XTableRenderContext<T>) {
  const columnKey = getColumnKey(column, index)

  return (
    <ElTableColumn
      key={columnKey}
      type={column.type === 'default' ? undefined : column.type}
      prop={column.prop as string | undefined}
      label={column.label}
      width={column.width}
      min-width={column.minWidth}
      fixed={column.fixed}
      align={column.align}
      header-align={column.headerAlign}
      sortable={column.sortable}
      show-overflow-tooltip={column.showOverflowTooltip}
      class-name={column.className}
      label-class-name={column.labelClassName}
      selectable={column.selectable as ((row: unknown, index: number) => boolean) | undefined}
      reserve-selection={column.reserveSelection}
      {...column.columnProps}
    >
      {{
        default: (scope: { row: T; $index: number }) => {
          if (column.children?.length) {
            return column.children.map((child, childIndex) => renderTableColumn(child, childIndex, context))
          }

          return renderCellContent(column, scope.row, scope.$index, context)
        },
        header: () => {
          if (column.headerRender) {
            return column.headerRender(column)
          }

          if (column.headerSlot && context.slots[column.headerSlot]) {
            return context.slots[column.headerSlot]?.({ column })
          }

          return column.label
        },
      }}
    </ElTableColumn>
  )
}