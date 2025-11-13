import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('content').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('commentable_type', 50).notNullable() // Tool, Article, AiModel
      table.integer('commentable_id').notNullable()
      table.integer('parent_id').unsigned().references('id').inTable('comments').onDelete('CASCADE').nullable()
      table.boolean('is_edited').defaultTo(false)
      table.timestamp('edited_at').nullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // Add indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['commentable_type', 'commentable_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
