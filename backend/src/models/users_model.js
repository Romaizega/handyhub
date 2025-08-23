const db = require('../db/db')

// Get user by ID
const getUserById = (id) => {
  return db('users').where({id}).first()
};

// Get all users ordered by newest first
const getAllUsers = () => {
  return db('users').select('*').orderBy('id', 'desc')
}

// Get user by username (unique)
const getUserByUsername = (username) =>{
  return db('users').where({username}).first()
};

// Get user by email (unique)
const getUserByEmail = (email) => {
  return db('users').where({email}).first()
}

// Create a new user with hashed password
const createUser = async(username, email, passwordHash, role) => {
  const [user] = await db('users')
    .insert({username, email, password_hash: passwordHash, role})
    .returning('*');
  return user
}

// Get paginated users list, optionally filtered by role
const getUsersPaged = async (limit, page, role) => {
  const offset = (page - 1) * limit;

  let query = db('users').select('id','username', 'email', 'role', 'created_at');

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

// Update user's email by ID
const updateEmail = async (userId, newEmail) => {
  return db('users')
    .where({ id: userId })
    .update({ email: newEmail })
    .returning(['id', 'username', 'email', 'role'])
}

// Update user's password (expects hashed password)
const updatePassword = async (userId, newPasswordHash) => {
  return db('users')
    .where({ id: userId })
    .update({ password_hash: newPasswordHash });
}

// Delete user by ID
const deleteUser = async (userId) => {
  return db('users').where({ id: userId }).del();
}

module.exports = {
  getUserById,
  getAllUsers,
  getUserByEmail,
  getUserByUsername,
  createUser,
  getUsersPaged,
  updateEmail,
  updatePassword,
  deleteUser
}