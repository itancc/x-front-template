import { computed, defineComponent, ref } from 'vue'
import type { PropType } from 'vue'
import { ElButton, ElPagination, ElPopconfirm, ElTable, ElTableColumn } from 'element-plus'

import type { XTableColumn, XTablePagination, XTableSortState } from './types'

function toSortState(payload: { prop: string | null; order: 'ascending' | 'descending' | null }): XTableSortState {
  return {
    prop: payload.prop ?? '',
    order: payload.order ?? null,
  }
}

export default defineComponent({
  name: 'XTable',
  props: {
    columns: {
      type: Array as PropType<XTableColumn<Record<string, unknown>>[]>,
      required: true,
    },
    data: {
      type: Array as PropType<Record<string, unknown>[]>,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pagination: {
      type: Object as PropType<XTablePagination>,
      required: true,
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    emptyText: {
      type: String,
      default: '暂无数据',
    },
  },
  emits: ['refresh', 'pagination-change', 'sort-change', 'selection-change'],
  setup(props, { emit, slots }) {
    const selectedRows = ref<Record<string, unknown>[]>([])
    const selectionCount = computed(() => selectedRows.value.length)

    function renderColumn(column: XTableColumn<Record<string, unknown>>) {
      if (column.type === 'selection') {
        return <ElTableColumn key={column.key} type="selection" width={column.width ?? 52} align={column.align ?? 'center'} fixed={column.fixed} />
      }

      if (column.type === 'index') {
        return <ElTableColumn key={column.key} type="index" width={column.width ?? 56} align={column.align ?? 'center'} fixed={column.fixed} />
      }

      if (column.actions) {
        return (
          <ElTableColumn
            key={column.key}
            label={column.label}
            minWidth={column.minWidth}
            width={column.width}
            align={column.align ?? 'right'}
            fixed={column.fixed}
            v-slots={{
              default: ({ row }: { row: Record<string, unknown> }) => (
                <div class="x-table__actions">
                  {column.actions?.map((action) => {
                    const hasPermission = action.permission ? action.permission(row) : true
                    if (!hasPermission) {
                      return null
                    }

                    const disabled = action.disabled ? action.disabled(row) : false
                    const textButton = (
                      <ElButton text type={action.type ?? 'primary'} disabled={disabled} onClick={() => action.onClick(row)}>
                        {action.label}
                      </ElButton>
                    )

                    if (!action.confirm) {
                      return <span key={action.key}>{textButton}</span>
                    }

                    return (
                      <ElPopconfirm key={action.key} title={action.confirm(row)} onConfirm={() => action.onClick(row)}>
                        {{ reference: () => textButton }}
                      </ElPopconfirm>
                    )
                  })}
                </div>
              ),
            }}
          />
        )
      }

      return (
        <ElTableColumn
          key={column.key}
          prop={String(column.prop ?? '')}
          label={column.label}
          minWidth={column.minWidth}
          width={column.width}
          align={column.align}
          fixed={column.fixed}
          sortable={column.sortable}
          showOverflowTooltip={column.showOverflowTooltip}
          v-slots={column.render ? { default: ({ row, $index }: { row: Record<string, unknown>; $index: number }) => column.render?.({ row, $index }) } : undefined}
        />
      )
    }

    return () => (
      <section class="x-table">
        <header class="x-table__toolbar">
          <div>{slots.toolbar?.({ selectionCount: selectionCount.value })}</div>
          <div class="x-table__toolbar-right">
            {slots.extra?.()}
            <ElButton onClick={() => emit('refresh')}>刷新</ElButton>
          </div>
        </header>

        <ElTable
          data={props.data}
          rowKey={props.rowKey}
          border
          stripe
          height="100%"
          v-loading={props.loading}
          emptyText={props.emptyText}
          onSelection-change={(rows: Record<string, unknown>[]) => {
            selectedRows.value = rows
            emit('selection-change', rows)
          }}
          onSort-change={(payload: { prop: string | null; order: 'ascending' | 'descending' | null }) => emit('sort-change', toSortState(payload))}
        >
          {props.columns.map(renderColumn)}
        </ElTable>

        <footer class="x-table__pagination">
          <ElPagination
            background
            currentPage={props.pagination.page}
            pageSize={props.pagination.pageSize}
            total={props.pagination.total}
            pageSizes={[10, 20, 50, 100]}
            layout="total, sizes, prev, pager, next"
            onCurrent-change={(page: number) => emit('pagination-change', { page, pageSize: props.pagination.pageSize })}
            onSize-change={(pageSize: number) => emit('pagination-change', { page: 1, pageSize })}
          />
        </footer>
      </section>
    )
  },
})

export * from './types'
export * from './columns'
