const express = require('express')
const router = express.Router()
const {uploadJobPhotos} = require('../utils/job_upload')
const { generateJobDescription } = require('../controllers/ai_controller')
const authenticateJWT = require('../middleware/auth_middware');


router.post('/job-description', authenticateJWT, uploadJobPhotos.single('image'), generateJobDescription)

module.exports = router
