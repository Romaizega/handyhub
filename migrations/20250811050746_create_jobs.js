exports.up = async function(knex) {
  await knex.schema.createTable('jobs', (table)=>{
    table.increments('id').primary();
    table
      .integer('client_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('profiles')
      .onDelete('CASCADE');
    table.string('title', 120).notNullable();
    table.text('description').notNullable();
    table.jsonb('photos').nullable();
    table.string('status', 50).notNullable().defaultTo('open');
    table.integer('budget').nullable();
    table.date('due_date').nullable();
    table.timestamps(true, true);
  })  
};

exports.down =  async function(knex) {
  await knex.schema.dropTableIfExists('jobs');
};
