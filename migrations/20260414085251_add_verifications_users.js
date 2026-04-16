exports.up = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.integer('verification_code').nullable();
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('code_expires_at').nullable();
  }
)}

exports.down = async function(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('verification_code')
    table.dropColumn('is_verified')
    table.dropColumn('code_expires_at')
  })
}
