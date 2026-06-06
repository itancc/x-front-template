import type { AxiosError, AxiosRequestConfig } from 'axios'

import { httpRequest } from './client'

export interface RetryOptions {
  retries?: number
  retryDelayMs?: number
  retryOnMethods?: string[]
}

function sleep(ms: number) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

function isMethodRetryable(method: string, retryOnMethods: string[]) {
  return retryOnMethods.includes(method.toUpperCase())
}

function isRetryableError(error: unknown) {
  const axiosError = error as AxiosError | undefined

  if (!axiosError) {
    return false
  }

  if (!axiosError.response) {
    return true
  }

  const status = axiosError.response.status
  return status >= 500
}

export async function httpRequestWithRetry<T = unknown>(
  config: AxiosRequestConfig,
  options?: RetryOptions,
): Promise<T> {
  const retries = options?.retries ?? 1
  const retryDelayMs = options?.retryDelayMs ?? 250
  const retryOnMethods = options?.retryOnMethods ?? ['GET']

  const method = (config.method ?? 'GET').toUpperCase()
  const canRetry = isMethodRetryable(method, retryOnMethods)

  let attempt = 0

  while (true) {
    try {
      return await httpRequest<T>(config)
    } catch (error) {
      if (!canRetry || attempt >= retries || !isRetryableError(error)) {
        throw error
      }

      attempt += 1
      await sleep(retryDelayMs * attempt)
    }
  }
}
