const express = require('express');
const {
  getAllCommentsController,
  getCommentByWorkerIdController
} = require('../controllers/comments_controller')

const authenticateJWT = require('../middleware/auth_middware');


const router = express.Router()

router.get('/profiles/:id/comments', getCommentByWorkerIdController)
router.get('/', getAllCommentsController)

module.exports = router