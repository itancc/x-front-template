export interface HttpResponseEnvelope<T> {
  code: number
  message: string
  data: T
}

export class HttpBusinessError extends Error {
  code: number

  constructor(message: string, code: number) {
    super(message)
    this.name = 'HttpBusinessError'
    this.code = code
  }
}

export type UnauthorizedHandler = (reason: 'http-status-401' | 'business-code-401') => void | Promise<void>

export interface HttpRequestOptions {
  idempotencyKey?: string
  autoIdempotencyKey?: boolean
}
