import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Tool from '#models/tool'
import Article from '#models/article'
import AiModel from '#models/ai_model'
import Comment from '#models/comment'
import Rating from '#models/rating'
import db from '@adonisjs/lucid/services/db'

export default class AdminController {
  /**
   * Get dashboard statistics
   */
  async stats({ response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.forbidden({ message: 'Admin access required' })
    }

    const stats = {
      users: {
        total: (await User.query().count('* as total').first())?.total || 0,
        admins: (await User.query().where('role', 'admin').count('* as total').first())?.total || 0,
        moderators: (await User.query().where('role', 'moderator').count('* as total').first())?.total || 0,
        regular: (await User.query().where('role', 'user').count('* as total').first())?.total || 0,
      },
      tools: {
        total: (await Tool.query().count('* as total').first())?.total || 0,
        byCategory: await db
          .from('tools')
          .select('category')
          .count('* as count')
          .groupBy('category')
          .orderBy('count', 'desc'),
        avgRating: (await Tool.query().avg('average_rating as avg').first())?.avg || 0,
      },
      articles: {
        total: (await Article.query().count('* as total').first())?.total || 0,
        byCategory: await db
          .from('articles')
          .select('category')
          .count('* as count')
          .whereNotNull('category')
          .groupBy('category')
          .orderBy('count', 'desc'),
      },
      aiModels: {
        total: (await AiModel.query().count('* as total').first())?.total || 0,
        active: (await AiModel.query().where('status', 'active').count('* as total').first())?.total || 0,
        deprecated: (await AiModel.query().where('status', 'deprecated').count('* as total').first())?.total || 0,
        byProvider: await db
          .from('ai_models')
          .select('provider')
          .count('* as count')
          .groupBy('provider')
          .orderBy('count', 'desc'),
      },
      engagement: {
        comments: (await Comment.query().count('* as total').first())?.total || 0,
        ratings: (await Rating.query().count('* as total').first())?.total || 0,
      },
    }

    return response.ok({ data: stats })
  }

  /**
   * Get all users (admin only)
   */
  async getUsers({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.forbidden({ message: 'Admin access required' })
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const role = request.input('role')
    const search = request.input('search')

    const query = User.query().select(
      'id',
      'username',
      'email',
      'full_name',
      'role',
      'created_at',
      'updated_at'
    )

    if (role) {
      query.where('role', role)
    }

    if (search) {
      query.where((subQuery) => {
        subQuery
          .whereILike('username', `%${search}%`)
          .orWhereILike('email', `%${search}%`)
          .orWhereILike('full_name', `%${search}%`)
      })
    }

    query.orderBy('created_at', 'desc')

    const users = await query.paginate(page, limit)

    return response.ok({
      data: users.all(),
      meta: users.getMeta(),
    })
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole({ request, response, auth, params }: HttpContext) {
    const currentUser = await auth.authenticate()

    if (currentUser.role !== 'admin') {
      return response.forbidden({ message: 'Admin access required' })
    }

    const targetUser = await User.findOrFail(params.id)
    const newRole = request.input('role')

    if (!['user', 'moderator', 'admin'].includes(newRole)) {
      return response.badRequest({ message: 'Invalid role' })
    }

    // Prevent self-demotion
    if (currentUser.id === targetUser.id && newRole !== 'admin') {
      return response.forbidden({
        message: 'You cannot change your own admin role',
      })
    }

    targetUser.role = newRole
    await targetUser.save()

    return response.ok({
      message: `User role updated to ${newRole}`,
      data: targetUser,
    })
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser({ response, auth, params }: HttpContext) {
    const currentUser = await auth.authenticate()

    if (currentUser.role !== 'admin') {
      return response.forbidden({ message: 'Admin access required' })
    }

    const targetUser = await User.findOrFail(params.id)

    // Prevent self-deletion
    if (currentUser.id === targetUser.id) {
      return response.forbidden({
        message: 'You cannot delete your own account',
      })
    }

    await targetUser.delete()

    return response.ok({ message: 'User deleted successfully' })
  }

  /**
   * Get recent activity (admin only)
   */
  async getRecentActivity({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.forbidden({ message: 'Admin access required' })
    }

    const limit = request.input('limit', 20)

    // Get recent tools
    const recentTools = await Tool.query()
      .preload('user', (userQuery) => {
        userQuery.select('id', 'username')
      })
      .orderBy('created_at', 'desc')
      .limit(limit)

    // Get recent articles
    const recentArticles = await Article.query()
      .preload('user', (userQuery) => {
        userQuery.select('id', 'username')
      })
      .orderBy('created_at', 'desc')
      .limit(limit)

    // Get recent comments
    const recentComments = await Comment.query()
      .preload('user', (userQuery) => {
        userQuery.select('id', 'username')
      })
      .orderBy('created_at', 'desc')
      .limit(limit)

    return response.ok({
      data: {
        tools: recentTools,
        articles: recentArticles,
        comments: recentComments,
      },
    })
  }

  /**
   * Get content for moderation (admin/moderator)
   */
  async getModerationQueue({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin' && user.role !== 'moderator') {
      return response.forbidden({ message: 'Moderator access required' })
    }

    const type = request.input('type', 'all') // tools, articles, comments, all

    const queue: any = {}

    if (type === 'all' || type === 'comments') {
      // Get recent comments for moderation
      queue.comments = await Comment.query()
        .preload('user', (userQuery) => {
          userQuery.select('id', 'username', 'email')
        })
        .orderBy('created_at', 'desc')
        .limit(50)
    }

    if (type === 'all' || type === 'tools') {
      // Get recent tools
      queue.tools = await Tool.query()
        .preload('user', (userQuery) => {
          userQuery.select('id', 'username', 'email')
        })
        .orderBy('created_at', 'desc')
        .limit(50)
    }

    if (type === 'all' || type === 'articles') {
      // Get recent articles
      queue.articles = await Article.query()
        .preload('user', (userQuery) => {
          userQuery.select('id', 'username', 'email')
        })
        .orderBy('created_at', 'desc')
        .limit(50)
    }

    return response.ok({ data: queue })
  }
}
