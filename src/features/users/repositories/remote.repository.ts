import { httpRequest, httpRequestWithRetry, mapTableQueryParams } from '../../../services/http'
import {
  toUserRow,
  toUserRows,
  toUserStatsCards,
  type UserListRemoteResult,
  type UserRemoteDTO,
  type UserStatsRemoteDTO,
} from '../services/user.adapter'
import type { IUserRepository } from './types'

export const remoteUserRepository: IUserRepository = {
  async fetchList(query) {
    const result = await httpRequestWithRetry<UserListRemoteResult>({
      url: '/users',
      method: 'GET',
      params: mapTableQueryParams(query, {
        sortFieldName: 'sortProp',
        sortOrderFieldName: 'sortOrder',
      }),
    }, {
      retries: 2,
      retryDelayMs: 220,
    })

    return {
      list: toUserRows(result.records),
      total: result.total,
    }
  },

  async fetchStats() {
    const result = await httpRequestWithRetry<UserStatsRemoteDTO>({
      url: '/users/stats',
      method: 'GET',
    }, {
      retries: 2,
      retryDelayMs: 220,
    })

    return toUserStatsCards(result)
  },

  async fetchById(id) {
    const result = await httpRequestWithRetry<UserRemoteDTO | null>({
      url: `/users/${id}`,
      method: 'GET',
    }, {
      retries: 1,
      retryDelayMs: 200,
    })

    return result ? toUserRow(result) : null
  },

  async toggleStatus(id) {
    const result = await httpRequest<UserRemoteDTO | null>({
      url: `/users/${id}/status`,
      method: 'PATCH',
    }, {
      autoIdempotencyKey: true,
    })

    return result ? toUserRow(result) : null
  },

  async deleteById(id) {
    await httpRequest<void>({
      url: `/users/${id}`,
      method: 'DELETE',
    }, {
      autoIdempotencyKey: true,
    })
  },

  async batchEnable(ids) {
    if (ids.length === 0) {
      return
    }

    await httpRequest<void>({
      url: '/users/batch-enable',
      method: 'POST',
      data: { ids },
    }, {
      autoIdempotencyKey: true,
    })
  },
}
