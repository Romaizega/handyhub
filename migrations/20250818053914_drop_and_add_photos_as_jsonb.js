exports.up = async function(knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.jsonb('photos').nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.dropColumn('photos');
  });
};
