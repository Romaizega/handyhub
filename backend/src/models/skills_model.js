const db = require('../db/db')

const getAllSkills = () => {
  return db('skills').select('*').orderBy('name', 'asc')
}

module.exports = {
  getAllSkills
}