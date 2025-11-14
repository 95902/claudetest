import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import RssFeed from './rss_feed.js'

export default class RssArticle extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare rssFeedId: number

  @column()
  declare title: string

  @column()
  declare link: string

  @column()
  declare description: string | null

  @column()
  declare content: string | null

  @column()
  declare author: string | null

  @column()
  declare guid: string | null

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column()
  declare imageUrl: string | null

  @column()
  declare isRead: boolean

  @column()
  declare isBookmarked: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => RssFeed)
  declare feed: BelongsTo<typeof RssFeed>
}