import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'rate_limit_requests'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('key').notNullable()
      table.integer('points').notNullable().defaultTo(0)
      table.bigInteger('expire').notNullable()

      table.index(['key', 'expire'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
