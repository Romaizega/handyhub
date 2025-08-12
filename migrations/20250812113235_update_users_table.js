exports.up = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('users', function (table) {
    table.dropTimestamps();
  });
};