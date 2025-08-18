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

// public list 
router.get('/', getJobsPagedController);
router.get('/jobs', getJobsPagedController);

// private
router.get('/myjob', authenticateJWT, getJobsByClientIdController);

// public by id 
router.get('/:id', getJobByIdController);

// private CRUD
router.post(
  '/',
  authenticateJWT,
  uploadJobPhotos.array('photos', 5), // max 5 files
  createJobController
)
router.patch(
  '/:id',
  authenticateJWT,
  uploadJobPhotos.array('photos', 5),
  updateJobController
)
router.patch('/:id/status', authenticateJWT, updateJobStatusController);
router.delete('/:id', authenticateJWT, deleteJobController);

module.exports = router;
