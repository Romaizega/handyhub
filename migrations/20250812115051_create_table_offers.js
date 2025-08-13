exports.up = async function (knex) {
  await knex.schema.createTable('offers', (table) => {
    table.increments('id').primary();

    table
      .integer('job_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('jobs')
      .onDelete('CASCADE');

    table
      .integer('worker_profile_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('profiles')
      .onDelete('CASCADE');

    table.integer('price').nullable();
    table.text('message').nullable();
    table.string('status', 50).notNullable().defaultTo('pending');
    table.timestamps(true, true);
    table.unique(['job_id', 'worker_profile_id']);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('offers');
};
