import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

import { runtimeConfig } from '../../config/runtime'
import { useAuthStore } from '../../stores/auth'
import { createIdempotencyKey } from './idempotency'
import {
  HttpBusinessError,
  type HttpRequestOptions,
  type HttpResponseEnvelope,
  type UnauthorizedHandler,
} from './types'

let unauthorizedHandler: UnauthorizedHandler | null = null
let unauthorizedHandling = false

function setUnauthorizedProcessing(value: boolean) {
  unauthorizedHandling = value
}

async function handleUnauthorized(reason: 'http-status-401' | 'business-code-401') {
  if (!unauthorizedHandler || unauthorizedHandling) {
    return
  }

  setUnauthorizedProcessing(true)

  try {
    await unauthorizedHandler(reason)
  } finally {
    window.setTimeout(() => setUnauthorizedProcessing(false), 300)
  }
}

const instance: AxiosInstance = axios.create({
  baseURL: runtimeConfig.apiBaseURL,
  timeout: 15000,
})

instance.interceptors.request.use((config) => {
  const authStore = useAuthStore()

  if (authStore.token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${authStore.token}`
  }

  return config
})

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      void handleUnauthorized('http-status-401')
    }

    const message = error.response?.status
      ? `请求失败(${error.response.status})`
      : '网络连接异常，请稍后重试'

    ElMessage.error(message)
    return Promise.reject(error)
  },
)

function canAttachIdempotencyKey(method: string) {
  return !['GET', 'HEAD', 'OPTIONS'].includes(method.toUpperCase())
}

function withIdempotencyHeaders(config: AxiosRequestConfig, options?: HttpRequestOptions) {
  const method = (config.method ?? 'GET').toUpperCase()

  if (!canAttachIdempotencyKey(method)) {
    return config
  }

  const idempotencyKey = options?.idempotencyKey
    ?? (options?.autoIdempotencyKey ? createIdempotencyKey() : undefined)

  if (!idempotencyKey) {
    return config
  }

  return {
    ...config,
    headers: {
      ...(config.headers ?? {}),
      'Idempotency-Key': idempotencyKey,
    },
  }
}

export async function httpRequest<T = unknown>(config: AxiosRequestConfig, options?: HttpRequestOptions): Promise<T> {
  const finalConfig = withIdempotencyHeaders(config, options)
  const response = await instance.request<HttpResponseEnvelope<T> | T>(finalConfig)
  const payload = response.data

  if (payload && typeof payload === 'object' && 'code' in payload && 'data' in payload) {
    const envelope = payload as HttpResponseEnvelope<T>
    if (envelope.code !== 0) {
      if (envelope.code === 401) {
        void handleUnauthorized('business-code-401')
      }

      ElMessage.error(envelope.message || '请求失败')
      throw new HttpBusinessError(envelope.message || 'Request failed', envelope.code)
    }

    return envelope.data
  }

  return payload as T
}

export function setHttpUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler
}

export { instance as httpClient }
