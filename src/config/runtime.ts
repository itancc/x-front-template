export type ApiMode = 'mock' | 'remote'

interface RuntimeConfig {
  apiMode: ApiMode
  apiBaseURL: string
}

function normalizeApiMode(value: string | undefined): ApiMode {
  return value === 'remote' ? 'remote' : 'mock'
}

export function getRuntimeConfig(): RuntimeConfig {
  const env = import.meta.env

  return {
    apiMode: normalizeApiMode(env.VITE_API_MODE),
    apiBaseURL: env.VITE_API_BASE_URL ?? '/api',
  }
}

export const runtimeConfig = getRuntimeConfig()
