import { reactive, ref } from 'vue'

import type { UseTableRequestOptions, XTableSortState } from './types'

export function useTableRequest<TRow, TParams extends object = Record<string, unknown>>(
  options: UseTableRequestOptions<TRow, TParams>,
) {
  const loading = ref(false)
  const data = ref<TRow[]>([])
  const error = ref<unknown>(null)
  const sort = ref<XTableSortState>({ order: null })
  const params = reactive({ ...(options.initialParams ?? {}) }) as TParams
  const pagination = reactive({
    page: options.initialPage ?? 1,
    pageSize: options.initialPageSize ?? 10,
    total: 0,
  })

  async function run() {
    loading.value = true
    error.value = null

    try {
      const result = await options.request({
        page: pagination.page,
        pageSize: pagination.pageSize,
        params,
        sort: sort.value,
      })

      data.value = result.list
      pagination.total = result.total
      return result
    } catch (requestError) {
      error.value = requestError
      throw requestError
    } finally {
      loading.value = false
    }
  }

  async function reload() {
    return run()
  }

  async function handlePaginationChange(next: { page: number; pageSize: number }) {
    pagination.page = next.page
    pagination.pageSize = next.pageSize
    return run()
  }

  async function handleSortChange(next: XTableSortState) {
    sort.value = next
    pagination.page = 1
    return run()
  }

  async function updateParams(nextParams: Partial<TParams>, resetPage = true) {
    Object.assign(params, nextParams)

    if (resetPage) {
      pagination.page = 1
    }

    return run()
  }

  async function reset() {
    Object.assign(params, options.initialParams ?? {})
    pagination.page = options.initialPage ?? 1
    pagination.pageSize = options.initialPageSize ?? 10
    sort.value = { order: null }
    return run()
  }

  if (options.immediate !== false) {
    void run()
  }

  return {
    data,
    error,
    handlePaginationChange,
    handleSortChange,
    loading,
    pagination,
    params,
    reload,
    reset,
    run,
    sort,
    updateParams,
  }
}