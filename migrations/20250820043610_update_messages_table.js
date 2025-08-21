exports.up = async function (knex) {
  await knex.schema.alterTable("messages", (table) => {
    table.dropForeign("job_id");
    table.dropColumn("job_id");
  });
  await knex.schema.alterTable("messages", (table) => {
    table
      .integer("job_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("jobs")
      .onDelete("CASCADE");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("messages", (table) => {
    table.dropForeign("job_id");
    table.dropColumn("job_id");
  });
  await knex.schema.alterTable("messages", (table) => {
    table
      .integer("job_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("jobs")
      .onDelete("CASCADE");
  });
};
