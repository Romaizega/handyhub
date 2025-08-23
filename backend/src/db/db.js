require('dotenv').config()
const knex = require('knex')

// Initialize Knex with PostgreSQL client and connection string from env
const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL
});


module.exports = db


