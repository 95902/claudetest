import limiter from '@adonisjs/limiter/services/main'

/**
 * Throttle middleware for rate limiting routes
 * Usage: .use(throttle({ key: 'name', requests: 5, duration: '1 minute' }))
 */
export const throttle = (options: { key: string; requests: number; duration: string }) => {
  return limiter.define(options.key, () => {
    return limiter.allowRequests(options.requests).every(options.duration)
  })
}
