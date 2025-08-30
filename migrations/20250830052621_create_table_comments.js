exports.up = function(knex) {
  return knex.schema.createTable('comments', (table) => {
    table.increments('id').primary();

    table.integer('job_id').unsigned().notNullable()
      .references('id').inTable('jobs').onDelete('CASCADE');

    table.integer('client_profile_id').unsigned().notNullable()
      .references('id').inTable('profiles');

    table.integer('worker_profile_id').unsigned().notNullable()
      .references('id').inTable('profiles').onDelete('CASCADE');

    table.integer('rating').notNullable().checkBetween([1, 5]);

    table.text('text').notNullable();

    table.unique(['job_id', 'client_profile_id']);

    table.timestamps(true, true); 
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('comments');
};
