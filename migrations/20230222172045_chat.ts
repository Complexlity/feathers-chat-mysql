import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.string('avatar')
  })
  await knex.schema.alterTable('messages', (table) => {
    table.integer('userId').unsigned().notNullable()
    table.bigint('createdAt')
    table.foreign('userId').references('id').inTable('users')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('avatar')
  })

  await knex.schema.alterTable('messages', (table) => {
    table.dropColumn('createdAt')
    table.dropColumn('userId')
  })
}
