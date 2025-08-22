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

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticateJWT, me)
router.post('/logout', logout)
router.post('/refreshToken', refreshAccessToken)
router.patch('/email',authenticateJWT, changeEmail)
router.patch('/password',authenticateJWT, changePassword)
router.delete('/me', authenticateJWT, deleteAccount)

module.exports = router

