import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RssArticle from './rss_article.js'

export default class RssFeed extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare url: string

  @column()
  declare category: string

  @column()
  declare description: string | null

  @column()
  declare language: string

  @column()
  declare isActive: boolean

  @column.dateTime()
  declare lastFetchedAt: DateTime | null

  @column()
  declare articleCount: number

  @column()
  declare iconUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => RssArticle)
  declare articles: HasMany<typeof RssArticle>
}