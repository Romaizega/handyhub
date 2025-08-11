exports.up = async function (knex) {
  await knex.schema.createTable('profiles', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .unique(); 
    table.string('role', 20).notNullable();
    table.string('display_name', 100).notNullable();
    table.string('city', 100).notNullable();
    table.text('about').nullable();
    table.string('avatar_url').nullable();
    table.string('skills').nullable();
    table.integer('hourly_rate').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('profiles');
};
