const db = require('../db/db')
const userModel = require('../models/users_model')

const listUser = async (req, res) => {
  try {
    const users = await db('users')
    .select('id', 'username', 'email', 'role', 'created_at')
    .orderBy('id', 'asc')
    return res.status(200).json({message: "Users list", users})
  } catch (error) {
      console.error("Get listUser error by Admin:", error.message)
      res.status(500).json({message: "Server error", error: error.message })
  }
}

const checkUserorAdmin = async (req, res) => {
  const {userId} = req.body
  try {
    const user = await db('users').where({id: userId}).first()
    if(!user) {
      return res.status(404).json({message: "User not found"})
    }
    if(user.role === 'admin') {
      return res.status(400).json({message: "User is already admin"})
    }

    await db('users')
    .where({id: userId})
    .update({role:'admin'})
    
    return res.status(200).json({message: "Admin"})
  } catch (error) {
    console.error("Check user or admin error:", error.message)
    res.status(500).json({message: "Server error", error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const {id} = req.params
    const user = await userModel.getUserById(id)
    if(!user) return res.status(404).json({message: "User not found"})
    await userModel.deleteUser(id)
    return res.status(200).json({ message: "User deleted" })

  } catch (error) {
    console.error("Delete user error:", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  listUser,
  checkUserorAdmin,
  deleteUser
}