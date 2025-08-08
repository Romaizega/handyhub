exports.up = function (knex) {
  return knex.schema
    // 1. Users
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('username', 50).notNullable();
      table.string('email', 100).unique().notNullable();
      table.string('role', 50).notNullable();
      table.text('password_hash').notNullable();
      table.timestamp(true, true);
    })
  }

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('users')
};
