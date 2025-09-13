const express = require('express');
const {
  getAllCommentsController,
  getCommentByWorkerIdController,
  createCommentController
} = require('../controllers/comments_controller')

const authenticateJWT = require('../middleware/auth_middware');
const {uploadCommentPhotos} = require('../utils/comment_uload')

const router = express.Router()

router.get('/profiles/:id/comments', getCommentByWorkerIdController)
router.get('/', getAllCommentsController)
router.post('/', authenticateJWT, uploadCommentPhotos.array('photos'), createCommentController)

module.exports = router