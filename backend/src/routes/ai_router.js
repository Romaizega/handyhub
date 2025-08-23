const express = require('express')
const router = express.Router()
const {uploadJobPhotos} = require('../utils/job_upload') // Multer config for job photo uploads
const { generateJobDescription } = require('../controllers/ai_controller') // AI-generated job summary
const authenticateJWT = require('../middleware/auth_middware');


router.post('/job-description', authenticateJWT, uploadJobPhotos.single('image'), generateJobDescription)

module.exports = router
