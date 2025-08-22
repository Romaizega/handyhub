exports.up = function(knex) {
  return knex.schema.table('messages', function(table) {
    table.boolean('is_read').defaultTo(false);
  });
};

exports.down = function(knex) {
  return knex.schema.table('messages', function(table) {
    table.dropColumn('is_read');
  });
};
