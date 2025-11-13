import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class AiModel extends BaseModel {
  static table = 'ai_models'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare provider: string

  @column()
  declare version: string | null

  @column()
  declare modelType: string

  @column()
  declare contextWindow: number | null

  @column()
  declare parametersCount: string | null

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => (value ? JSON.parse(value) : null),
  })
  declare pricing: Record<string, any> | null

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => (value ? JSON.parse(value) : null),
  })
  declare capabilities: Record<string, any> | null

  @column({
    prepare: (value: any) => JSON.stringify(value),
    consume: (value: string) => (value ? JSON.parse(value) : null),
  })
  declare benchmarkScores: Record<string, any> | null

  @column.date()
  declare releaseDate: DateTime | null

  @column()
  declare documentationUrl: string | null

  @column()
  declare status: 'active' | 'deprecated'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
