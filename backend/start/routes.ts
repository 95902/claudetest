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
const CommentsController = () => import('#controllers/comments_controller')
const RatingsController = () => import('#controllers/ratings_controller')
const BookmarksController = () => import('#controllers/bookmarks_controller')

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

    /**
     * Comments Routes
     */
    router
      .group(() => {
        // Public route - get comments
        router.get('/', [CommentsController, 'index'])

        // Protected routes (authenticated users only)
        router
          .group(() => {
            router.post('/', [CommentsController, 'store'])
            router.put('/:id', [CommentsController, 'update'])
            router.delete('/:id', [CommentsController, 'destroy'])
          })
          .use(middleware.auth())
      })
      .prefix('/comments')

    /**
     * Ratings Routes
     */
    router
      .group(() => {
        // Public route - get all ratings for a resource
        router.get('/', [RatingsController, 'index'])

        // Protected routes (authenticated users only)
        router
          .group(() => {
            router.get('/me', [RatingsController, 'show']) // Get user's rating
            router.post('/', [RatingsController, 'store']) // Create/update rating
            router.put('/:id', [RatingsController, 'update'])
            router.delete('/:id', [RatingsController, 'destroy'])
          })
          .use(middleware.auth())
      })
      .prefix('/ratings')

    /**
     * Bookmarks Routes
     */
    router
      .group(() => {
        router.get('/', [BookmarksController, 'index']) // Get user's bookmarks
        router.get('/check', [BookmarksController, 'show']) // Check if bookmarked
        router.post('/toggle', [BookmarksController, 'toggle']) // Toggle bookmark
        router.delete('/:id', [BookmarksController, 'destroy'])
      })
      .prefix('/bookmarks')
      .use(middleware.auth())
  })
  .prefix('/api')
