import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rss_feeds'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('url', 1000).notNullable().unique()
      table.string('category', 100).notNullable() // Tech Company, French Media, etc.
      table.text('description').nullable()
      table.string('language', 10).defaultTo('en') // en, fr, etc.
      table.boolean('is_active').defaultTo(true)
      table.timestamp('last_fetched_at').nullable()
      table.integer('article_count').defaultTo(0)
      table.string('icon_url', 500).nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // Add indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.index('category')
      table.index('is_active')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}