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
// Get all profiles (admin or internal use)
router.get('/', authenticateJWT, getAllProfiles)
// Get current user's profile
router.get('/me', authenticateJWT, getMyprofileController)
// Get all public worker profiles
router.get('/workers', getProfilesWorkerPublic)
// Get profile by profile ID (internal/admin access)
router.get('/:id', authenticateJWT, getProfileById)
// Public profile info by user ID
router.get('/by-user/:id', getProfileByUserIdpublic)
// Create profile for authenticated user
router.post(
  '/create',
  authenticateJWT,
  uploadAvatar.single('avatar'),
  createProfileController
)
// Update authenticated user's profile
router.patch(
  '/update',
  authenticateJWT,
  uploadAvatar.single('avatar'),
  updateProfileController
)
// Delete authenticated user's profile
router.delete('/delete',authenticateJWT, deleteProfileController)


module.exports = router