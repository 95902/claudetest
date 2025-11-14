import type { HttpContext } from '@adonisjs/core/http'
import Comment from '#models/comment'
import { createCommentValidator, updateCommentValidator } from '#validators/comment'
import { DateTime } from 'luxon'

export default class CommentsController {
  /**
   * Get comments for a specific resource
   * Query params: commentableType, commentableId, parentId (optional)
   */
  async index({ request, response }: HttpContext) {
    const commentableType = request.input('commentableType')
    const commentableId = request.input('commentableId')
    const parentId = request.input('parentId', null)

    if (!commentableType || !commentableId) {
      return response.badRequest({
        message: 'commentableType and commentableId are required',
      })
    }

    const query = Comment.query()
      .where('commentable_type', commentableType)
      .where('commentable_id', commentableId)
      .preload('user', (userQuery) => {
        userQuery.select('id', 'username', 'email')
      })

    // Filter by parentId (null for top-level, number for replies)
    if (parentId === null || parentId === 'null') {
      query.whereNull('parent_id')
    } else if (parentId) {
      query.where('parent_id', parentId)
    }

    const comments = await query.orderBy('created_at', 'desc')

    return response.ok({ data: comments })
  }

  /**
   * Create a new comment
   */
  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(createCommentValidator)

    const comment = await Comment.create({
      content: data.content,
      userId: user.id,
      commentableType: data.commentableType,
      commentableId: data.commentableId,
      parentId: data.parentId || null,
      isEdited: false,
    })

    await comment.load('user', (userQuery) => {
      userQuery.select('id', 'username', 'email')
    })

    return response.created({ data: comment })
  }

  /**
   * Update a comment (only if user owns it)
   */
  async update({ request, response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const comment = await Comment.findOrFail(params.id)

    // Check ownership
    if (comment.userId !== user.id) {
      return response.forbidden({
        message: 'You can only edit your own comments',
      })
    }

    const data = await request.validateUsing(updateCommentValidator)

    comment.content = data.content
    comment.isEdited = true
    comment.editedAt = DateTime.now()
    await comment.save()

    await comment.load('user', (userQuery) => {
      userQuery.select('id', 'username', 'email')
    })

    return response.ok({ data: comment })
  }

  /**
   * Delete a comment (only if user owns it or is admin)
   */
  async destroy({ response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const comment = await Comment.findOrFail(params.id)

    // Check ownership or admin role
    if (comment.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({
        message: 'You can only delete your own comments',
      })
    }

    await comment.delete()

    return response.noContent()
  }
}