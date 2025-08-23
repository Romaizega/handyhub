const express = require('express')
const {
  register,
  login,
  me,
  logout,
  refreshAccessToken,
  changeEmail,
  changePassword,
  deleteAccount 
} = require('../controllers/auth_controller')
const authenticateJWT = require('../middleware/auth_middware')

const router = express.Router()
// Register a new user
router.post('/register', register)
// Login user and return tokens
router.post('/login', login)
// Get current authenticated user's info
router.get('/me', authenticateJWT, me)
// Logout user and clear refresh token cookie
router.post('/logout', logout)
// Refresh access token using refresh token
router.post('/refreshToken', refreshAccessToken)
// Change email of authenticated user
router.patch('/email',authenticateJWT, changeEmail)
// Change password of authenticated user
router.patch('/password',authenticateJWT, changePassword)
// Delete authenticated user's account
router.delete('/me', authenticateJWT, deleteAccount)

module.exports = router

