exports.up = async function (knex) {
  if (await knex.schema.hasColumn('users', 'true')) {
    await knex.schema.alterTable('users', (t) => t.dropColumn('true'));
  }

  if (!(await knex.schema.hasColumn('users', 'created_at'))) {
    await knex.schema.alterTable('users', (t) =>
      t.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now())
    );
  }
  if (!(await knex.schema.hasColumn('users', 'updated_at'))) {
    await knex.schema.alterTable('users', (t) =>
      t.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now())
    );
  }

  await knex('users')
    .whereNull('created_at')
    .update({ created_at: knex.fn.now(), updated_at: knex.fn.now() });
};

exports.down = async function (knex) {
  if (await knex.schema.hasColumn('users', 'created_at')) {
    await knex.schema.alterTable('users', (t) => t.dropColumn('created_at'));
  }
  if (await knex.schema.hasColumn('users', 'updated_at')) {
    await knex.schema.alterTable('users', (t) => t.dropColumn('updated_at'));
  }
  if (!(await knex.schema.hasColumn('users', 'true'))) {
    await knex.schema.alterTable('users', (t) => t.timestamp('true'));
  }
};
