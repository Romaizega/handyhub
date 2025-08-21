// routes/messages.js
const express = require("express");
const {
  getDirectMessages,
  sendDirectMessage,
  getThreads,
} = require('../controllers/message_controller');
const authenticateJWT = require('../middleware/auth_middware');

const router = express.Router();

router.get('/direct', authenticateJWT, getDirectMessages);
router.post('/direct', authenticateJWT, sendDirectMessage);

router.get('/threads', authenticateJWT, getThreads);

module.exports = router;
