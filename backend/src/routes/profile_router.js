const express = require('express')
const {
  getAllProfiles,
  getProfileById,
  createProfileController,
  updateProfileController,
  deleteProfileController
  
} = require('../controllers/profile_controller')
const authenticateJWT = require('../middleware/auth_middware')

const router = express.Router();

router.get('/', authenticateJWT, getAllProfiles)
router.get('/:id', authenticateJWT, getProfileById)
router.post('/create', authenticateJWT, createProfileController)
router.patch('/update', authenticateJWT, updateProfileController)
router.delete('/delete',authenticateJWT, deleteProfileController)


module.exports = router