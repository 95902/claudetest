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
const ArticlesController = () => import('#controllers/articles_controller')
const AiModelsController = () => import('#controllers/ai_models_controller')
const TagsController = () => import('#controllers/tags_controller')
const AdminController = () => import('#controllers/admin_controller')
const RssFeedsController = () => import('#controllers/rss_feeds_controller')

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

    /**
     * Articles Routes
     */
    router
      .group(() => {
        // Public routes
        router.get('/', [ArticlesController, 'index'])
        router.get('/:id', [ArticlesController, 'show'])

        // Protected routes (authenticated users only)
        router
          .group(() => {
            router.post('/', [ArticlesController, 'store'])
            router.put('/:id', [ArticlesController, 'update'])
            router.delete('/:id', [ArticlesController, 'destroy'])
          })
          .use(middleware.auth())
      })
      .prefix('/articles')

    /**
     * AI Models Routes
     */
    router
      .group(() => {
        // Public routes
        router.get('/', [AiModelsController, 'index'])
        router.get('/:id', [AiModelsController, 'show'])

        // Protected routes (admin only)
        router
          .group(() => {
            router.post('/', [AiModelsController, 'store'])
            router.put('/:id', [AiModelsController, 'update'])
            router.delete('/:id', [AiModelsController, 'destroy'])
          })
          .use(middleware.auth())
      })
      .prefix('/ai-models')

    /**
     * Tags Routes
     */
    router
      .group(() => {
        // Public routes
        router.get('/', [TagsController, 'index'])
        router.get('/resource', [TagsController, 'show'])

        // Protected routes
        router
          .group(() => {
            router.post('/attach', [TagsController, 'attach'])
            router.post('/detach', [TagsController, 'detach'])
          })
          .use(middleware.auth())
      })
      .prefix('/tags')

    /**
     * Admin Routes (admin only)
     */
    router
      .group(() => {
        router.get('/stats', [AdminController, 'stats'])
        router.get('/users', [AdminController, 'getUsers'])
        router.put('/users/:id/role', [AdminController, 'updateUserRole'])
        router.delete('/users/:id', [AdminController, 'deleteUser'])
        router.get('/activity', [AdminController, 'getRecentActivity'])
        router.get('/moderation', [AdminController, 'getModerationQueue'])
      })
      .prefix('/admin')
      .use(middleware.auth())

    /**
     * RSS Feeds Routes
     */
    router
      .group(() => {
        // Public routes - list feeds and articles
        router.get('/', [RssFeedsController, 'index'])
        router.get('/articles', [RssFeedsController, 'articles'])
        router.get('/:id', [RssFeedsController, 'show'])

        // Protected routes (authenticated users)
        router
          .group(() => {
            router.put('/articles/:id/read', [RssFeedsController, 'markAsRead'])
            router.post('/articles/:id/bookmark', [RssFeedsController, 'toggleBookmark'])
          })
          .use(middleware.auth())

        // Admin/Moderator routes - manage feeds
        router
          .group(() => {
            router.post('/', [RssFeedsController, 'store'])
            router.put('/:id', [RssFeedsController, 'update'])
            router.delete('/:id', [RssFeedsController, 'destroy'])
            router.post('/:id/fetch', [RssFeedsController, 'fetch'])
            router.post('/fetch-all', [RssFeedsController, 'fetchAll'])
          })
          .use(middleware.auth())
      })
      .prefix('/rss-feeds')
  })
  .prefix('/api')
