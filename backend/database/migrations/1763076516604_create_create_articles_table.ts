import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'articles'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title', 500).notNullable()
      table.string('slug', 500).notNullable().unique()
      table.text('content').notNullable()
      table.text('excerpt').nullable()
      table.string('source_url', 500).nullable()
      table.string('author', 255).nullable()
      table.timestamp('published_at').nullable()
      table.string('image_url', 500).nullable()
      table.string('category', 50).nullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.integer('views_count').defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // Add indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['published_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
