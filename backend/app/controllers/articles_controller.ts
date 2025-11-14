import type { HttpContext } from '@adonisjs/core/http'
import Article from '#models/article'
import { createArticleValidator, updateArticleValidator } from '#validators/article'

export default class ArticlesController {
  /**
   * Get all articles with pagination and filters
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 12)
    const category = request.input('category')
    const search = request.input('search')

    const query = Article.query().preload('user', (userQuery) => {
      userQuery.select('id', 'username', 'email')
    })

    if (category) {
      query.where('category', category)
    }

    if (search) {
      query.where((subQuery) => {
        subQuery.whereILike('title', `%${search}%`).orWhereILike('content', `%${search}%`)
      })
    }

    query.orderBy('published_at', 'desc')

    const articles = await query.paginate(page, limit)

    return response.ok({
      data: articles.all(),
      meta: articles.getMeta(),
    })
  }

  /**
   * Get single article by ID or slug
   */
  async show({ params, response }: HttpContext) {
    const article = await Article.query()
      .where((query) => {
        if (isNaN(Number(params.id))) {
          query.where('slug', params.id)
        } else {
          query.where('id', params.id)
        }
      })
      .preload('user', (userQuery) => {
        userQuery.select('id', 'username', 'email')
      })
      .firstOrFail()

    // Increment views count
    article.viewsCount += 1
    await article.save()

    return response.ok({ data: article })
  }

  /**
   * Create new article (auth required)
   */
  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()
    const data = await request.validateUsing(createArticleValidator)

    const article = await Article.create({
      ...data,
      userId: user.id,
      viewsCount: 0,
    })

    await article.load('user', (userQuery) => {
      userQuery.select('id', 'username', 'email')
    })

    return response.created({ data: article })
  }

  /**
   * Update article (only owner or admin)
   */
  async update({ request, response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const article = await Article.findOrFail(params.id)

    // Check ownership or admin
    if (article.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({
        message: 'You can only edit your own articles',
      })
    }

    const data = await request.validateUsing(updateArticleValidator)

    article.merge(data)
    await article.save()

    await article.load('user', (userQuery) => {
      userQuery.select('id', 'username', 'email')
    })

    return response.ok({ data: article })
  }

  /**
   * Delete article (only owner or admin)
   */
  async destroy({ response, auth, params }: HttpContext) {
    const user = await auth.authenticate()
    const article = await Article.findOrFail(params.id)

    // Check ownership or admin
    if (article.userId !== user.id && user.role !== 'admin') {
      return response.forbidden({
        message: 'You can only delete your own articles',
      })
    }

    await article.delete()

    return response.noContent()
  }
}
