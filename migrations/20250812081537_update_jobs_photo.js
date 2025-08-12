exports.up = async function (knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.dropColumn('photos');
  });
  await knex.schema.alterTable('jobs', (table) => {
    table.specificType('photos', 'text[]').nullable();
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.dropColumn('photos');
  });
  await knex.schema.alterTable('jobs', (table) => {
    table.jsonb('photos').nullable();
  });
};