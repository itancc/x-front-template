import { runtimeConfig } from '../../../config/runtime'

import { mockUserRepository } from './mock.repository'
import { remoteUserRepository } from './remote.repository'
import type { IUserRepository } from './types'

const userRepository: IUserRepository = runtimeConfig.apiMode === 'mock'
  ? mockUserRepository
  : remoteUserRepository

export { userRepository }
export type { IUserRepository, UserListQuery, UserListResult } from './types'
