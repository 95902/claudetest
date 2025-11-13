import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ratings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('score').notNullable() // 1-5
      table.text('review').nullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('rateable_type', 50).notNullable()
      table.integer('rateable_id').notNullable()
      table.integer('helpful_count').defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')

      // Unique constraint: one rating per user per resource
      table.unique(['user_id', 'rateable_type', 'rateable_id'])
    })

    // Add indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['rateable_type', 'rateable_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
