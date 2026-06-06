/// <reference types="vue/jsx" />

import { ElButton, ElEmpty, ElPagination, ElTable, ElTooltip } from 'element-plus'
import type { TableInstance } from 'element-plus'
import { computed, defineComponent, ref, toRef } from 'vue'

import { DEFAULT_EMPTY_TEXT, DEFAULT_LOADING_TEXT, DEFAULT_PAGINATION_LAYOUT, DEFAULT_PAGE_SIZES } from './constants'
import { useColumnVisibility } from './composables/useColumnVisibility'
import { useTableActions } from './composables/useTableActions'
import { xTableEmits } from './emits'
import { xTableProps } from './props'
import { renderTableColumn } from './render'
import type { XTableExpose, XTableSortChangePayload } from './types'
import { getAttrValue, getColumnKey, omitKeys, resolveRowKey } from './utils'

const OMITTED_ATTR_KEYS = [
  'data',
  'loading',
  'loadingText',
  'loading-text',
  'rowKey',
  'row-key',
  'emptyText',
  'empty-text',
]

export default defineComponent({
  name: 'XTable',
  inheritAttrs: false,
  props: xTableProps,
  emits: xTableEmits,
  setup(props, { attrs, emit, expose, slots }) {
    const tableRef = ref<TableInstance>()
    const storageKey = toRef(props, 'storageKey')

    const readAttr = <T,>(keys: string[], fallback: T) => getAttrValue<T>(attrs, keys, fallback)

    const tableData = computed(() => readAttr<Array<Record<string, unknown>>>(['data'], []))
    const loading = computed(() => Boolean(readAttr(['loading'], false)))
    const loadingText = computed(() => readAttr(['loadingText', 'loading-text'], DEFAULT_LOADING_TEXT))
    const emptyText = computed(() => readAttr(['emptyText', 'empty-text'], DEFAULT_EMPTY_TEXT))
    const rowKey = computed(() => readAttr<string | ((row: Record<string, unknown>) => string)>(['rowKey', 'row-key'], 'id'))
    const tableAttrs = computed(() => omitKeys(attrs, OMITTED_ATTR_KEYS))

    const { effectiveVisibleColumnKeys, finalColumns, persistableColumns, resetColumnVisibility, toggleColumn } =
      useColumnVisibility({
        columns: computed(() => props.columns),
        storageKey,
        onChange: (value) => emit('column-visibility-change', value),
      })

    const { isActionLoading, runAction } = useTableActions<Record<string, unknown>>({
      resolveRowKey: (row) => resolveRowKey(rowKey.value, row),
    })

    const selectionCount = computed(() => tableRef.value?.getSelectionRows()?.length ?? 0)

    function clearSelection() {
      tableRef.value?.clearSelection()
    }

    function emitPaginationChange(page: number, pageSize: number) {
      emit('pagination-change', { page, pageSize })
    }

    function handleCurrentPageChange(page: number) {
      emit('update:page', page)
      emitPaginationChange(page, props.pagination?.pageSize ?? DEFAULT_PAGE_SIZES[0])
    }

    function handlePageSizeChange(pageSize: number) {
      emit('update:pageSize', pageSize)
      emitPaginationChange(1, pageSize)
    }

    function renderColumnManager() {
      if (!props.showColumnManager || persistableColumns.value.length === 0) {
        return null
      }

      return (
        <div class="x-table__column-manager">
          {persistableColumns.value.map(({ column, key }, index) => {
            const active = effectiveVisibleColumnKeys.value.includes(key)

            return (
              <button
                key={key}
                type="button"
                class={['x-table__column-toggle', active && 'is-active']}
                onClick={() => toggleColumn(key)}
              >
                {column.label ?? getColumnKey(column, index)}
              </button>
            )
          })}
        </div>
      )
    }

    function renderPagination() {
      if (!props.pagination) {
        return null
      }

      return (
        <div class="x-table__pagination">
          <ElPagination
            background={props.pagination.background ?? true}
            currentPage={props.pagination.page}
            pageSize={props.pagination.pageSize}
            pageSizes={props.pagination.pageSizes ?? DEFAULT_PAGE_SIZES}
            layout={props.pagination.layout ?? DEFAULT_PAGINATION_LAYOUT}
            total={props.pagination.total}
            {...props.pagination.paginationProps}
            {...{
              'onUpdate:current-page': handleCurrentPageChange,
              'onUpdate:page-size': handlePageSizeChange,
            }}
          />
        </div>
      )
    }

    function resolveTableRowKey(row: Record<string, unknown>) {
      return resolveRowKey(rowKey.value, row)
    }

    expose({
      clearSelection,
      resetColumnVisibility,
      tableRef,
    } satisfies XTableExpose)

    return () => (
      <section class="x-table">
        <div class="x-table__toolbar">
          <div class="x-table__toolbar-left">{slots.toolbar?.({ selectionCount: selectionCount.value })}</div>
          <div class="x-table__toolbar-right">
            {renderColumnManager()}
            {slots.extra?.()}
            <ElTooltip content="刷新">
              <ElButton circle onClick={() => emit('refresh')}>
                ↻
              </ElButton>
            </ElTooltip>
          </div>
        </div>

        <ElTable
          ref={tableRef}
          data={tableData.value}
          rowKey={resolveTableRowKey}
          emptyText={emptyText.value}
          v-loading={loading.value}
          elementLoadingText={loadingText.value}
          {...tableAttrs.value}
          onSelectionChange={(value: Array<Record<string, unknown>>) => emit('selection-change', value)}
          onSortChange={(payload: XTableSortChangePayload) => emit('sort-change', payload)}
        >
          {{
            empty: () => slots.empty?.() ?? <ElEmpty description={emptyText.value} />,
            default: () =>
              finalColumns.value.map((column, index) =>
                renderTableColumn(column, index, {
                  slots,
                  runAction,
                  isActionLoading,
                }),
              ),
            append: () => slots.append?.(),
          }}
        </ElTable>

        {renderPagination()}
      </section>
    )
  },
})
