const db = require('../db/db')

const getUserById = (id) => {
  return db('users').where({id}).first()
};

const getAllUsers = () => {
  return db('users').select('*').orderBy('id', 'desc')
}

const getUserByUsername = (username) =>{
  return db('users').where({username}).first()
};

const getUserByEmail = (email) => {
  return db('users').where({email}).first()
}

const createUser = async(username, email, passwordHash, role) => {
  const [user] = await db('users')
    .insert({username, email, password_hash: passwordHash, role})
    .returning('*');
  return user
}

const getUsersPaged = async (limit, page, role) => {
  const offset = (page - 1) * limit;

  let query = db('users').select('id', 'email', 'role', 'created_at');

  if (role) {
    query = query.where({ role });
  }

  const users = await query
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  let countQuery = db('users').count('*');
  if (role) {
    countQuery = countQuery.where({ role });
  }
  const [{count}] = await countQuery;

  return {
    users,
    total: Number(count),
    page,
    totalPages: Math.ceil(count / limit)
  }
}

module.exports = {
  getUserById,
  getAllUsers,
  getUserByEmail,
  getUserByUsername,
  createUser,
  getUsersPaged
}