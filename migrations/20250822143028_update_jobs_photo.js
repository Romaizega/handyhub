exports.up = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('jobs', 'photos');
  if (hasColumn) {
    await knex.schema.alterTable('jobs', (table) => {
      table.dropColumn('photos');
    });
  }

  await knex.schema.alterTable('jobs', (table) => {
    table.jsonb('photos').nullable();
  });
};

exports.down = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('jobs', 'photos');
  if (hasColumn) {
    await knex.schema.alterTable('jobs', (table) => {
      table.dropColumn('photos');
    });
  }

  await knex.schema.alterTable('jobs', (table) => {
    table.specificType('photos', 'text[]').nullable();
  });
};
