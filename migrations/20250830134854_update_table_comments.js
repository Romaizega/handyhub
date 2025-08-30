exports.up = async function(knex) {
  await knex.schema.alterTable('comments', (table) => {
    table.jsonb('photos').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('comments', (table) => {
    table.dropColumn('photos');
  });
};
