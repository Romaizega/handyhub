const express = require('express')
const {
  getAllOfferController,
  getOfferByIdController,
  createOfferController,
  deleteOfferController,
  updateOfferStatusController,
  updateOfferController,
  getOffersByJobController
} = require('../controllers/offer_controller')
const authenticateJWT = require('../middleware/auth_middware');


const router = express.Router()
// Get a specific offer by ID
router.get('/:id',authenticateJWT, getOfferByIdController )
// Get all offers for current worker
router.get('/',authenticateJWT, getAllOfferController )
// Create a new offer for a job
router.post('/', authenticateJWT, createOfferController)
// Delete an offer (only pending + own)
router.delete('/:id', authenticateJWT, deleteOfferController)
// Update an existing offer (only pending + own)
router.patch('/:id', authenticateJWT, updateOfferController)
// Change status of an offer (client only)
router.patch('/:id/status', authenticateJWT, updateOfferStatusController)
// Get all offers for a specific job (client-only access)
router.get('/by-job/:jobId', authenticateJWT, getOffersByJobController)


module.exports = router