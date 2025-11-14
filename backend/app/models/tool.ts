import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'

export default class Tool extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare description: string

  @column()
  declare category: string

  @column()
  declare url: string

  @column()
  declare logoUrl: string | null

  @column()
  declare pricing: 'free' | 'freemium' | 'paid'

  @column()
  declare features: Record<string, any> | null

  @column()
  declare pros: string[] | null

  @column()
  declare cons: string[] | null

  @column()
  declare githubRepo: string | null

  @column()
  declare userId: number | null

  @column()
  declare averageRating: number

  @column()
  declare ratingsCount: number

  @column()
  declare viewsCount: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
