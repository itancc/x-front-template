export type SortOrder = 'ascending' | 'descending' | null

export interface TableQueryInput<TParams extends object = Record<string, unknown>> {
  page: number
  pageSize: number
  params: TParams
  sort?: {
    prop?: string
    order: SortOrder
  }
}

export interface TableQueryMapOptions {
  pageField?: string
  pageSizeField?: string
  sortFieldName?: string
  sortOrderFieldName?: string
  ascValue?: string
  descValue?: string
}

export function mapTableQueryParams<TParams extends object = Record<string, unknown>>(
  input: TableQueryInput<TParams>,
  options?: TableQueryMapOptions,
) {
  const pageField = options?.pageField ?? 'page'
  const pageSizeField = options?.pageSizeField ?? 'pageSize'
  const sortFieldName = options?.sortFieldName ?? 'sortField'
  const sortOrderFieldName = options?.sortOrderFieldName ?? 'sortOrder'
  const ascValue = options?.ascValue ?? 'asc'
  const descValue = options?.descValue ?? 'desc'

  const payload: Record<string, unknown> = {
    [pageField]: input.page,
    [pageSizeField]: input.pageSize,
    ...input.params,
  }

  if (input.sort?.prop && input.sort.order) {
    payload[sortFieldName] = input.sort.prop
    payload[sortOrderFieldName] = input.sort.order === 'ascending' ? ascValue : descValue
  }

  return payload
}
