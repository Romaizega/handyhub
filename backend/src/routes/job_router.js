const express = require('express');
const {
  getJobsPagedController, 
  getJobByIdController,
  updateJobController,
  updateJobStatusController,
  deleteJobController,
  createJobController,
  getJobsByClientIdController
} = require('../controllers/job_controller');
const authenticateJWT = require('../middleware/auth_middware');

const router = express.Router();

// public list 
router.get('/', getJobsPagedController);

// private
router.get('/myjob', authenticateJWT, getJobsByClientIdController);

// public by id 
router.get('/:id', getJobByIdController);

// private CRUD
router.post('/', authenticateJWT, createJobController);
router.patch('/:id', authenticateJWT, updateJobController);
router.patch('/:id/status', authenticateJWT, updateJobStatusController);
router.delete('/:id', authenticateJWT, deleteJobController);

module.exports = router;
