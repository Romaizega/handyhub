const express = require('express')
const {
  getAllJobsController,
  getJobByIdController,
  updateJobController,
  updateJobStatusController,
  deleteJobController,
  createJobController,
  getJobsByClientIdController
} = require('../controllers/job_controller')
const authenticateJWT = require('../middleware/auth_middware')

const router = express.Router()

// public getting job descriptons
router.get('/', getAllJobsController)
router.get('/:id', getJobByIdController)
// privete with token
router.get('/myjob', authenticateJWT, getJobsByClientIdController)
router.post('/', authenticateJWT, createJobController)
router.patch('/:id', authenticateJWT, updateJobController)
router.patch('/:id/status', authenticateJWT, updateJobStatusController)
router.delete('/:id', authenticateJWT, deleteJobController)

module.exports = router
