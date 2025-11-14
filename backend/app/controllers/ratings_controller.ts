import type { HttpContext } from '@adonisjs/core/http'
import Rating from '#models/rating'
import Tool from '#models/tool'
import { createRatingValidator, updateRatingValidator } from '#validators/rating'
import db from '@adonisjs/lucid/services/db'

export default class RatingsController {
  /**
   * Get ratings for a specific resource
   * Query params: rateableType, rateableId
   */
  async index({ request, response }: HttpContext) {
    const rateableType = request.input('rateableType')
    const rateableId = request.input('rateableId')

    if (!rateableType || !rateableId) {
      return response.badRequest({
        message: 'rateableType and rateableId are required',
      })
    }

    const ratings = await Rating.query()
      .where('rateable_type', rateableType)
      .where('rateable_id', rateableId)
      .preload('user', (userQuery) => {
        userQuery.select('id', 'username', 'email')
      })
      .orderBy('created_at', 'desc')

    return response.ok({ data: ratings })
  }

  /**
   * Get user's rating for a specific resource
   */
  async show({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const rateableType = request.input('rateableType')
    const rateableId = request.input('rateableId')

    if (!rateableType || !rateableId) {
      return response.badRequest({
        message: 'rateableType and rateableId are required',
      })
    }

    const rating = await Rating.query()
      .where('rateable_type', rateableType)
      .where('rateable_id', rateableId)
      .where('user_id', user.id)
      .first()

    if (!rating) {
      return response.notFound({ message: 'Rating not found' })
    }

    await rating.load('user', (userQuery) => {
      userQuery.select('id', 'username', 'email')
    })

    return response.ok({ data: rating })
  }

  /**
   * Create or update a rating (upsert)
   * Users can only have one rating per resource
   */
  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(createRatingValidator)

    // Check if user already rated this resource
    const existingRating = await Rating.query()
      .where('rateable_type', data.rateableType)
      .where('rateable_id', data.rateableId)
      .where('user_id', user.id)
      .first()

    let rating: Rating

    if (existingRating) {
      // Update existing rating
      existingRating.score = data.score
      existingRating.reviewText = data.reviewText || null
      await existingRating.save()
      rating = existingRating
    } else {
      // Create new rating
      rating = await Rating.create({
        score: data.score,
        reviewText: data.reviewText || null,
        userId: user.id,
        rateableType: data.rateableType,
        rateableId: data.rateableId,
      })
    }

    // Recalculate average rating for the resource
    await this.recalculateAverageRating(data.rateableType, data.rateableId)

    await rating.load('user', (userQuery) => {
      userQuery.select('id', 'username', 'email')
    })

    return response.created({ data: rating })
  }

  /**
   * Update a rating (only if user owns it)
   */
  async update({ request, response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const rating = await Rating.findOrFail(params.id)

    // Check ownership
    if (rating.userId !== user.id) {
      return response.forbidden({
        message: 'You can only edit your own ratings',
      })
    }

    const data = await request.validateUsing(updateRatingValidator)

    rating.score = data.score
    rating.reviewText = data.reviewText || null
    await rating.save()

    // Recalculate average rating
    await this.recalculateAverageRating(rating.rateableType, rating.rateableId)

    await rating.load('user', (userQuery) => {
      userQuery.select('id', 'username', 'email')
    })

    return response.ok({ data: rating })
  }

  /**
   * Delete a rating (only if user owns it or is admin)
   */
  async destroy({ response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const rating = await Rating.findOrFail(params.id)

    // Check ownership or admin role
    if (rating.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({
        message: 'You can only delete your own ratings',
      })
    }

    const rateableType = rating.rateableType
    const rateableId = rating.rateableId

    await rating.delete()

    // Recalculate average rating
    await this.recalculateAverageRating(rateableType, rateableId)

    return response.noContent()
  }

  /**
   * Recalculate average rating for a resource
   */
  private async recalculateAverageRating(rateableType: string, rateableId: number) {
    const result = await db
      .from('ratings')
      .where('rateable_type', rateableType)
      .where('rateable_id', rateableId)
      .count('* as total')
      .avg('score as average')
      .first()

    const total = Number(result?.total || 0)
    const average = Number(result?.average || 0)

    // Update the resource (currently only supporting Tools)
    if (rateableType === 'Tool') {
      await Tool.query()
        .where('id', rateableId)
        .update({
          average_rating: average,
          ratings_count: total,
        })
    }

    // TODO: Add similar logic for Article and AiModel when implemented
  }
}