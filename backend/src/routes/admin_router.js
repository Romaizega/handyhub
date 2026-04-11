const express = require('express')
const {listUser, checkUserorAdmin, deleteUser} = require('../controllers/admin_controller')
const authenticateJWT = require('../middleware/auth_middware')
const adminAuthorize = require('../middleware/admin_middleware')


const router = express.Router()

router.get('/users', authenticateJWT, adminAuthorize, listUser)
router.patch('/check',authenticateJWT, adminAuthorize, checkUserorAdmin)
router.delete('/users/:id', authenticateJWT, adminAuthorize, deleteUser)

module.exports = router