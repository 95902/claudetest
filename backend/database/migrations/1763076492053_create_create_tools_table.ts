import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tools'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('slug', 255).notNullable().unique()
      table.text('description').notNullable()
      table.string('category', 50).notNullable()
      table.string('url', 500).notNullable()
      table.string('logo_url', 500).nullable()
      table.enum('pricing', ['free', 'freemium', 'paid']).defaultTo('free')
      table.jsonb('features').nullable()
      table.specificType('pros', 'text[]').nullable()
      table.specificType('cons', 'text[]').nullable()
      table.string('github_repo', 255).nullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL')
      table.decimal('average_rating', 2, 1).defaultTo(0)
      table.integer('ratings_count').defaultTo(0)
      table.integer('views_count').defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    // Add indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.index('category')
      table.index('slug')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}