import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ai_models'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('provider', 100).notNullable()
      table.string('version', 50).nullable()
      table.string('model_type', 50).notNullable() // LLM, Image, Audio, Video
      table.integer('context_window').nullable()
      table.string('parameters_count', 50).nullable()
      table.jsonb('pricing').nullable() // {input: 0.001, output: 0.002}
      table.jsonb('capabilities').nullable()
      table.jsonb('benchmark_scores').nullable()
      table.date('release_date').nullable()
      table.string('documentation_url', 500).nullable()
      table.enum('status', ['active', 'deprecated']).defaultTo('active')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
