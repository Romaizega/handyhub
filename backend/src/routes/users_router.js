const express = require('express')
const {getUsersPaged} = require('../controllers/auth_controller')

const router = express.Router()
// Get paginated list of users (optional role filter)
router.get('/', getUsersPaged)

module.exports =router