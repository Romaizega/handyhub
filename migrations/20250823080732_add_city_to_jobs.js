exports.up = async function(knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.string('city', 100).nullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.alterTable('jobs', (table) => {
    table.dropColumn('city');
  });
};
