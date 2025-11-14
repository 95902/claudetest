import type { HttpContext } from '@adonisjs/core/http'
import Bookmark from '#models/bookmark'

export default class BookmarksController {
  /**
   * Get all bookmarks for authenticated user
   * Optionally filter by bookmarkableType
   */
  async index({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const bookmarkableType = request.input('bookmarkableType')

    const query = Bookmark.query().where('user_id', user.id)

    if (bookmarkableType) {
      query.where('bookmarkable_type', bookmarkableType)
    }

    const bookmarks = await query.orderBy('created_at', 'desc')

    return response.ok({ data: bookmarks })
  }

  /**
   * Check if user has bookmarked a specific resource
   */
  async show({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const bookmarkableType = request.input('bookmarkableType')
    const bookmarkableId = request.input('bookmarkableId')

    if (!bookmarkableType || !bookmarkableId) {
      return response.badRequest({
        message: 'bookmarkableType and bookmarkableId are required',
      })
    }

    const bookmark = await Bookmark.query()
      .where('user_id', user.id)
      .where('bookmarkable_type', bookmarkableType)
      .where('bookmarkable_id', bookmarkableId)
      .first()

    return response.ok({
      data: {
        isBookmarked: !!bookmark,
        bookmark: bookmark,
      },
    })
  }

  /**
   * Toggle bookmark (create if not exists, delete if exists)
   */
  async toggle({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const bookmarkableType = request.input('bookmarkableType')
    const bookmarkableId = request.input('bookmarkableId')

    if (!bookmarkableType || !bookmarkableId) {
      return response.badRequest({
        message: 'bookmarkableType and bookmarkableId are required',
      })
    }

    // Check if bookmark exists
    const existingBookmark = await Bookmark.query()
      .where('user_id', user.id)
      .where('bookmarkable_type', bookmarkableType)
      .where('bookmarkable_id', bookmarkableId)
      .first()

    if (existingBookmark) {
      // Remove bookmark
      await existingBookmark.delete()
      return response.ok({
        message: 'Bookmark removed',
        isBookmarked: false,
      })
    } else {
      // Add bookmark
      const bookmark = await Bookmark.create({
        userId: user.id,
        bookmarkableType: bookmarkableType,
        bookmarkableId: bookmarkableId,
      })

      return response.created({
        message: 'Bookmark added',
        isBookmarked: true,
        data: bookmark,
      })
    }
  }

  /**
   * Delete a bookmark (alternative to toggle)
   */
  async destroy({ response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const bookmark = await Bookmark.findOrFail(params.id)

    // Check ownership
    if (bookmark.userId !== user.id) {
      return response.forbidden({
        message: 'You can only delete your own bookmarks',
      })
    }

    await bookmark.delete()

    return response.noContent()
  }
}