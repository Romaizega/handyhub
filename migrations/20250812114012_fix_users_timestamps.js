exports.up = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('true');
  });

  await knex.schema.alterTable('users', (table) => {
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });
  await knex('users')
    .whereNull('created_at')
    .update({
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });
};

exports.down = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumns('created_at', 'updated_at');
    table.timestamp('true');
  });
};
