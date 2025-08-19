const express = require('express')
const {
  getAllProfiles,
  getProfileById,
  createProfileController,
  updateProfileController,
  deleteProfileController,
  getMyprofileController,
  getProfilesWorkerPublic,
  getProfileByUserIdpublic,
  
} = require('../controllers/profile_controller')
const authenticateJWT = require('../middleware/auth_middware')
const {uploadAvatar} = require('../utils/upload')

const router = express.Router();

router.get('/', authenticateJWT, getAllProfiles)
router.get('/me', authenticateJWT, getMyprofileController)
router.get('/workers', getProfilesWorkerPublic)
router.get('/:id', authenticateJWT, getProfileById)
router.get('/by-user/:id', getProfileByUserIdpublic)

router.post(
  '/create',
  authenticateJWT,
  uploadAvatar.single('avatar'),
  createProfileController
)
router.patch(
  '/update',
  authenticateJWT,
  uploadAvatar.single('avatar'),
  updateProfileController
)
router.delete('/delete',authenticateJWT, deleteProfileController)


module.exports = router