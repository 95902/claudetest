import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'taggables'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('tag_id').unsigned().references('id').inTable('tags').onDelete('CASCADE')
      table.string('taggable_type', 50).notNullable()
      table.integer('taggable_id').notNullable()

      table.timestamp('created_at')
    })

    // Add indexes
    this.schema.alterTable(this.tableName, (table) => {
      table.index(['taggable_type', 'taggable_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
