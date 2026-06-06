interface RunWhenIdleOptions {
  timeout?: number
  fallbackDelay?: number
}

type IdleCallback = () => void

type RuntimeWithIdleCallback = typeof globalThis & {
  requestIdleCallback?: (callback: IdleCallback, options?: { timeout: number }) => number
}

export function runWhenIdle(callback: IdleCallback, options: RunWhenIdleOptions = {}): void {
  const { timeout = 1200, fallbackDelay = 300 } = options
  const runtime = globalThis as RuntimeWithIdleCallback

  if (typeof runtime.requestIdleCallback === 'function') {
    runtime.requestIdleCallback(callback, { timeout })
    return
  }

  globalThis.setTimeout(callback, fallbackDelay)
}
