import type { HttpContext } from '@adonisjs/core/http'
import RssFeed from '#models/rss_feed'
import RssArticle from '#models/rss_article'
import Parser from 'rss-parser'
import { DateTime } from 'luxon'

export default class RssFeedsController {
  private parser: Parser

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['media:content', 'media:thumbnail', 'enclosure'],
      },
    })
  }

  /**
   * Get all RSS feeds
   * GET /api/rss-feeds
   */
  async index({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const category = request.input('category')
    const isActive = request.input('is_active')

    const query = RssFeed.query()

    if (category) {
      query.where('category', category)
    }

    if (isActive !== undefined) {
      query.where('is_active', isActive === 'true' || isActive === true)
    }

    const feeds = await query
      .orderBy('name', 'asc')
      .paginate(page, limit)

    return response.ok(feeds)
  }

  /**
   * Create a new RSS feed
   * POST /api/rss-feeds
   */
  async store({ request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin' && user.role !== 'moderator') {
      return response.forbidden({ message: 'Admin or moderator access required' })
    }

    const data = request.only(['name', 'url', 'category', 'description', 'language', 'icon_url'])

    try {
      // Test if feed is valid by parsing it
      await this.parser.parseURL(data.url)

      const feed = await RssFeed.create({
        name: data.name,
        url: data.url,
        category: data.category,
        description: data.description,
        language: data.language || 'en',
        iconUrl: data.icon_url,
        isActive: true,
        articleCount: 0,
      })

      return response.created({
        message: 'RSS feed created successfully',
        feed,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Invalid RSS feed URL or unable to parse feed',
        error: error.message,
      })
    }
  }

  /**
   * Get a single RSS feed with its articles
   * GET /api/rss-feeds/:id
   */
  async show({ params, request, response }: HttpContext) {
    const feed = await RssFeed.find(params.id)

    if (!feed) {
      return response.notFound({ message: 'RSS feed not found' })
    }

    const page = request.input('page', 1)
    const limit = request.input('limit', 20)

    const articles = await RssArticle.query()
      .where('rss_feed_id', feed.id)
      .orderBy('published_at', 'desc')
      .paginate(page, limit)

    return response.ok({
      feed,
      articles,
    })
  }

  /**
   * Update an RSS feed
   * PUT /api/rss-feeds/:id
   */
  async update({ params, request, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin' && user.role !== 'moderator') {
      return response.forbidden({ message: 'Admin or moderator access required' })
    }

    const feed = await RssFeed.find(params.id)

    if (!feed) {
      return response.notFound({ message: 'RSS feed not found' })
    }

    const data = request.only([
      'name',
      'url',
      'category',
      'description',
      'language',
      'is_active',
      'icon_url',
    ])

    feed.merge(data)
    await feed.save()

    return response.ok({
      message: 'RSS feed updated successfully',
      feed,
    })
  }

  /**
   * Delete an RSS feed
   * DELETE /api/rss-feeds/:id
   */
  async destroy({ params, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin') {
      return response.forbidden({ message: 'Admin access required' })
    }

    const feed = await RssFeed.find(params.id)

    if (!feed) {
      return response.notFound({ message: 'RSS feed not found' })
    }

    await feed.delete()

    return response.ok({
      message: 'RSS feed deleted successfully',
    })
  }

  /**
   * Fetch articles from a specific RSS feed
   * POST /api/rss-feeds/:id/fetch
   */
  async fetch({ params, response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin' && user.role !== 'moderator') {
      return response.forbidden({ message: 'Admin or moderator access required' })
    }

    const feed = await RssFeed.find(params.id)

    if (!feed) {
      return response.notFound({ message: 'RSS feed not found' })
    }

    try {
      const parsedFeed = await this.parser.parseURL(feed.url)
      let newArticlesCount = 0

      for (const item of parsedFeed.items) {
        // Check if article already exists
        const exists = await RssArticle.query()
          .where('rss_feed_id', feed.id)
          .where((query) => {
            query.where('link', item.link || '').orWhere('guid', item.guid || '')
          })
          .first()

        if (!exists && item.link) {
          // Extract image URL from various possible fields
          let imageUrl = null
          if (item['media:content']) {
            imageUrl = item['media:content'].$ ? item['media:content'].$.url : null
          } else if (item['media:thumbnail']) {
            imageUrl = item['media:thumbnail'].$ ? item['media:thumbnail'].$.url : null
          } else if (item.enclosure && item.enclosure.type?.startsWith('image/')) {
            imageUrl = item.enclosure.url
          }

          await RssArticle.create({
            rssFeedId: feed.id,
            title: item.title || 'No title',
            link: item.link,
            description: item.contentSnippet || item.content || null,
            content: item.content || item.contentSnippet || null,
            author: item.creator || item.author || null,
            guid: item.guid || item.link,
            publishedAt: item.pubDate ? DateTime.fromJSDate(new Date(item.pubDate)) : null,
            imageUrl,
            isRead: false,
            isBookmarked: false,
          })

          newArticlesCount++
        }
      }

      // Update feed metadata
      feed.lastFetchedAt = DateTime.now()
      feed.articleCount = await RssArticle.query().where('rss_feed_id', feed.id).count('* as total').first()
        .then(result => result?.$extras.total || 0)
      await feed.save()

      return response.ok({
        message: `Fetched ${newArticlesCount} new articles`,
        feed,
        newArticlesCount,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Failed to fetch RSS feed',
        error: error.message,
      })
    }
  }

  /**
   * Fetch all active RSS feeds
   * POST /api/rss-feeds/fetch-all
   */
  async fetchAll({ response, auth }: HttpContext) {
    const user = await auth.authenticate()

    if (user.role !== 'admin' && user.role !== 'moderator') {
      return response.forbidden({ message: 'Admin or moderator access required' })
    }

    const feeds = await RssFeed.query().where('is_active', true)
    const results = []

    for (const feed of feeds) {
      try {
        const parsedFeed = await this.parser.parseURL(feed.url)
        let newArticlesCount = 0

        for (const item of parsedFeed.items) {
          const exists = await RssArticle.query()
            .where('rss_feed_id', feed.id)
            .where((query) => {
              query.where('link', item.link || '').orWhere('guid', item.guid || '')
            })
            .first()

          if (!exists && item.link) {
            let imageUrl = null
            if (item['media:content']) {
              imageUrl = item['media:content'].$ ? item['media:content'].$.url : null
            } else if (item['media:thumbnail']) {
              imageUrl = item['media:thumbnail'].$ ? item['media:thumbnail'].$.url : null
            } else if (item.enclosure && item.enclosure.type?.startsWith('image/')) {
              imageUrl = item.enclosure.url
            }

            await RssArticle.create({
              rssFeedId: feed.id,
              title: item.title || 'No title',
              link: item.link,
              description: item.contentSnippet || item.content || null,
              content: item.content || item.contentSnippet || null,
              author: item.creator || item.author || null,
              guid: item.guid || item.link,
              publishedAt: item.pubDate ? DateTime.fromJSDate(new Date(item.pubDate)) : null,
              imageUrl,
              isRead: false,
              isBookmarked: false,
            })

            newArticlesCount++
          }
        }

        feed.lastFetchedAt = DateTime.now()
        feed.articleCount = await RssArticle.query().where('rss_feed_id', feed.id).count('* as total').first()
          .then(result => result?.$extras.total || 0)
        await feed.save()

        results.push({
          feedId: feed.id,
          feedName: feed.name,
          newArticlesCount,
          success: true,
        })
      } catch (error) {
        results.push({
          feedId: feed.id,
          feedName: feed.name,
          newArticlesCount: 0,
          success: false,
          error: error.message,
        })
      }
    }

    const totalNewArticles = results.reduce((sum, r) => sum + r.newArticlesCount, 0)

    return response.ok({
      message: `Fetched ${totalNewArticles} new articles from ${feeds.length} feeds`,
      results,
      totalNewArticles,
    })
  }

  /**
   * Get all articles across all feeds
   * GET /api/rss-feeds/articles
   */
  async articles({ request, response }: HttpContext) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 20)
    const feedId = request.input('feed_id')
    const isRead = request.input('is_read')
    const isBookmarked = request.input('is_bookmarked')

    const query = RssArticle.query().preload('feed')

    if (feedId) {
      query.where('rss_feed_id', feedId)
    }

    if (isRead !== undefined) {
      query.where('is_read', isRead === 'true' || isRead === true)
    }

    if (isBookmarked !== undefined) {
      query.where('is_bookmarked', isBookmarked === 'true' || isBookmarked === true)
    }

    const articles = await query
      .orderBy('published_at', 'desc')
      .paginate(page, limit)

    return response.ok(articles)
  }

  /**
   * Mark article as read
   * PUT /api/rss-feeds/articles/:id/read
   */
  async markAsRead({ params, response, auth }: HttpContext) {
    await auth.authenticate()

    const article = await RssArticle.find(params.id)

    if (!article) {
      return response.notFound({ message: 'Article not found' })
    }

    article.isRead = true
    await article.save()

    return response.ok({
      message: 'Article marked as read',
      article,
    })
  }

  /**
   * Toggle bookmark on article
   * POST /api/rss-feeds/articles/:id/bookmark
   */
  async toggleBookmark({ params, response, auth }: HttpContext) {
    await auth.authenticate()

    const article = await RssArticle.find(params.id)

    if (!article) {
      return response.notFound({ message: 'Article not found' })
    }

    article.isBookmarked = !article.isBookmarked
    await article.save()

    return response.ok({
      message: article.isBookmarked ? 'Article bookmarked' : 'Bookmark removed',
      article,
    })
  }
}
