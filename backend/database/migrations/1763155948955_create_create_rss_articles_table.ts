import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rss_articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('rss_feed_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('rss_feeds')
        .onDelete('CASCADE')

      table.string('title', 500).notNullable()
      table.string('link', 1000).notNullable().unique()
      table.text('description').nullable()
      table.text('content').nullable()
      table.string('author', 255).nullable()
      table.string('guid', 500).nullable() // Unique identifier from RSS feed
      table.timestamp('published_at').nullable()
      table.string('image_url', 500).nullable()
      table.boolean('is_read').defaultTo(false)
      table.boolean('is_bookmarked').defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // Add indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.index('rss_feed_id')
      table.index('published_at')
      table.index('is_read')
      table.index('is_bookmarked')
      table.index('guid')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}