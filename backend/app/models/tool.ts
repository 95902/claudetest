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

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => (value ? JSON.parse(value) : null),
  })
  declare features: Record<string, any> | null

  @column({
    prepare: (value: string[]) => `{${value.join(',')}}`,
    consume: (value: string) => value ? value.slice(1, -1).split(',').filter(Boolean) : [],
  })
  declare pros: string[] | null

  @column({
    prepare: (value: string[]) => `{${value.join(',')}}`,
    consume: (value: string) => value ? value.slice(1, -1).split(',').filter(Boolean) : [],
  })
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
