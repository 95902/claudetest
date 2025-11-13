import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookmarks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('bookmarkable_type', 50).notNullable()
      table.integer('bookmarkable_id').notNullable()
      table.string('collection_name', 100).nullable()

      table.timestamp('created_at')

      // Unique constraint: one bookmark per user per resource
      table.unique(['user_id', 'bookmarkable_type', 'bookmarkable_id'])
    })

    // Add indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
