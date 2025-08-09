const express = require('express')
const {
  register,
  login,
  me,
  logout,
  refreshAccessToken
} = require('../controllers/auth_controller')
const authenticateJWT = require('../middleware/auth_middware')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', authenticateJWT, me)
router.post('/logout', logout)
router.post('/refreshToken', refreshAccessToken)

module.exports = router