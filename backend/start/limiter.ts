import limiter from '@adonisjs/limiter/services/main'

/**
 * Throttle middleware for rate limiting routes
 */
export const throttle = limiter.define
