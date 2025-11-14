import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import RssFeed from '#models/rss_feed'
import RssArticle from '#models/rss_article'
import Parser from 'rss-parser'
import { DateTime } from 'luxon'

export default class FetchRssFeeds extends BaseCommand {
  static commandName = 'fetch:rss-feeds'
  static description = 'Fetch articles from all active RSS feeds'

  static options: CommandOptions = {
    startApp: true,
  }

  private parser: Parser = new Parser({
    customFields: {
      item: ['media:content', 'media:thumbnail', 'enclosure'],
    },
  })

  async run() {
    const startTime = Date.now()

    this.logger.info('🚀 Starting RSS feeds fetch...')

    // Get all active feeds
    const feeds = await RssFeed.query().where('is_active', true)

    if (feeds.length === 0) {
      this.logger.warning('⚠️  No active RSS feeds found')
      return
    }

    this.logger.info(`📡 Found ${feeds.length} active feeds`)

    let totalNewArticles = 0
    let successCount = 0
    let errorCount = 0

    // Fetch each feed
    for (const feed of feeds) {
      try {
        this.logger.info(`\n📰 Fetching: ${feed.name}`)

        const parsedFeed = await this.parser.parseURL(feed.url)
        let newArticlesCount = 0

        // Process each article
        for (const item of parsedFeed.items) {
          // Check if article already exists
          const exists = await RssArticle.query()
            .where('rss_feed_id', feed.id)
            .where((query) => {
              query.where('link', item.link || '').orWhere('guid', item.guid || '')
            })
            .first()

          if (!exists && item.link) {
            // Extract image URL
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
        feed.articleCount = await RssArticle.query()
          .where('rss_feed_id', feed.id)
          .count('* as total')
          .first()
          .then((result) => result?.$extras.total || 0)
        await feed.save()

        if (newArticlesCount > 0) {
          this.logger.success(`   ✅ ${newArticlesCount} new articles`)
        } else {
          this.logger.info(`   ℹ️  No new articles`)
        }

        totalNewArticles += newArticlesCount
        successCount++
      } catch (error) {
        this.logger.error(`   ❌ Error: ${error.message}`)
        errorCount++
      }
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    // Summary
    this.logger.info('\n' + '='.repeat(50))
    this.logger.info('📊 SUMMARY')
    this.logger.info('='.repeat(50))
    this.logger.success(`✅ Success: ${successCount} feeds`)
    if (errorCount > 0) {
      this.logger.error(`❌ Errors: ${errorCount} feeds`)
    }
    this.logger.info(`📰 Total new articles: ${totalNewArticles}`)
    this.logger.info(`⏱️  Duration: ${duration}s`)
    this.logger.info('='.repeat(50))
  }
}