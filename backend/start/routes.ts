/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import { throttle } from '#start/limiter'

const AuthController = () => import('#controllers/auth_controller')
const ToolsController = () => import('#controllers/tools_controller')

/**
 * Health check route
 */
router.get('/', async () => {
  return {
    name: 'AI Tools Monitor API',
    version: '1.0.0',
    status: 'healthy',
  }
})

/**
 * API Routes
 */
router
  .group(() => {
    /**
     * Authentication Routes
     */
    router
      .group(() => {
        // Public routes with rate limiting
        router.post('/register', [AuthController, 'register']).use(
          throttle({
            key: 'auth_register',
            requests: 3,
            duration: '15 minutes',
          })
        )

        router.post('/login', [AuthController, 'login']).use(
          throttle({
            key: 'auth_login',
            requests: 5,
            duration: '15 minutes',
          })
        )

        // Protected routes
        router
          .group(() => {
            router.post('/logout', [AuthController, 'logout'])
            router.get('/me', [AuthController, 'me'])
            router.put('/profile', [AuthController, 'updateProfile'])
          })
          .use(middleware.auth())
      })
      .prefix('/auth')

    /**
     * Tools Routes
     */
    router
      .group(() => {
        // Public routes
        router.get('/', [ToolsController, 'index'])
        router.get('/search', [ToolsController, 'search'])
        router.get('/:id', [ToolsController, 'show'])

        // Protected routes (authenticated users only)
        router
          .group(() => {
            router.post('/', [ToolsController, 'store'])
            router.put('/:id', [ToolsController, 'update'])
            router.delete('/:id', [ToolsController, 'destroy'])
          })
          .use(middleware.auth())
      })
      .prefix('/tools')
  })
  .prefix('/api')
