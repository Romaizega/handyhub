const express = require('express')
const {
  getAllOfferController,
  getOfferByIdController,
  createOfferController,
  deleteOfferController,
  updateOfferStatusController,
  updateOfferController
} = require('../controllers/offer_controller')
const authenticateJWT = require('../middleware/auth_middware');


const router = express.Router()

router.get('/',authenticateJWT, getOfferByIdController )
router.post('/', authenticateJWT, createOfferController)
router.delete('/:id', authenticateJWT, deleteOfferController)
router.patch('/:id', authenticateJWT, updateOfferController)
router.patch('/:id/status', authenticateJWT, updateOfferStatusController)

module.exports = router