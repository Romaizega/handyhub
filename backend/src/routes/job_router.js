const express = require('express');
const {
  getJobsPagedController, 
  getAllJobsController,
  getJobByIdController,
  updateJobController,
  updateJobStatusController,
  deleteJobController,
  createJobController,
  getJobsByClientIdController
} = require('../controllers/job_controller');
const authenticateJWT = require('../middleware/auth_middware');
const {uploadJobPhotos} = require('../utils/job_upload')

const router = express.Router();

// PUBLIC 
// Get paginated list of jobs
router.get('/', getJobsPagedController);
router.get('/jobs', getJobsPagedController);
// Get job by ID (public)
router.get('/:id', getJobByIdController);
// Get jobs created by the authenticated client
router.get('/myjob', authenticateJWT, getJobsByClientIdController);

// Create a new job (only clients)
router.post(
  '/',
  authenticateJWT,
  uploadJobPhotos.array('photos', 5), // max 5 files
  createJobController
)
// Update a job (only owner/client)
router.patch(
  '/:id',
  authenticateJWT,
  uploadJobPhotos.array('photos', 5),
  updateJobController
)
// Change job status (only owner/client)
router.patch('/:id/status', authenticateJWT, updateJobStatusController);
// Delete a job (only owner/client)
router.delete('/:id', authenticateJWT, deleteJobController);

module.exports = router;