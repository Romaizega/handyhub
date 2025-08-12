const express = require('express')
const {getUsersPaged} = require('../controllers/auth_controller')

const router = express.Router()

router.get('/', getUsersPaged)

module.exports =router