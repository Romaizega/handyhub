exports.up = async function(knex) {
  await knex.schema.createTable('messages', (table) => {
    table.increments('id').primary();

    table.integer('job_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('jobs')
      .onDelete('CASCADE');

    table.integer('sender_profile_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('profiles')
      .onDelete('CASCADE');

    table.integer('recipient_profile_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('profiles')
      .onDelete('CASCADE');

    table.text('text').notNullable();
    table.timestamp('timestamp').defaultTo(knex.fn.now());
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('messages');
};
