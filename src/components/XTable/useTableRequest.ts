import { reactive, ref } from 'vue'

import type { XTablePagination, XTableSortState } from './types'

interface TableRequestPayload<Params> {
  page: number
  pageSize: number
  params: Params
  sort: XTableSortState
}

interface TableRequestResult<Row> {
  list: Row[]
  total: number
}

interface UseTableRequestOptions<Row, Params extends object> {
  initialPageSize: number
  initialParams: Params
  request: (payload: TableRequestPayload<Params>) => Promise<TableRequestResult<Row>>
}

export function useTableRequest<Row, Params extends object>(
  options: UseTableRequestOptions<Row, Params>,
) {
  const loading = ref(false)
  const data = ref<Row[]>([])
  const params = ref<Params>({ ...options.initialParams })
  const sort = ref<XTableSortState>({ prop: '', order: null })
  const pagination = reactive<XTablePagination>({
    page: 1,
    pageSize: options.initialPageSize,
    total: 0,
  })

  async function reload() {
    loading.value = true
    try {
      const response = await options.request({
        page: pagination.page,
        pageSize: pagination.pageSize,
        params: params.value,
        sort: sort.value,
      })
      data.value = response.list
      pagination.total = response.total
    } finally {
      loading.value = false
    }
  }

  async function updateParams(nextParams: Params) {
    params.value = { ...nextParams }
    pagination.page = 1
    await reload()
  }

  async function reset() {
    params.value = { ...options.initialParams }
    pagination.page = 1
    sort.value = { prop: '', order: null }
    await reload()
  }

  async function handlePaginationChange(payload: { page: number; pageSize: number }) {
    pagination.page = payload.page
    pagination.pageSize = payload.pageSize
    await reload()
  }

  async function handleSortChange(payload: XTableSortState) {
    sort.value = payload
    pagination.page = 1
    await reload()
  }

  void reload()

  return {
    data,
    handlePaginationChange,
    handleSortChange,
    loading,
    pagination,
    reload,
    reset,
    updateParams,
  }
}
