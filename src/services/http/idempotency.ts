export function createIdempotencyKey(prefix = 'xft') {
  const randomPart = Math.random().toString(36).slice(2, 10)
  const timePart = Date.now().toString(36)

  return `${prefix}-${timePart}-${randomPart}`
}