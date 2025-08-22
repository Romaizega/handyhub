const express = require("express");
const {
  getDirectMessages,
  sendDirectMessage,
  getThreads,
  getUnreadCount,
  markAllAsRead
} = require('../controllers/message_controller');
const authenticateJWT = require('../middleware/auth_middware');

const router = express.Router();

router.get('/direct', authenticateJWT, getDirectMessages);
router.post('/direct', authenticateJWT, sendDirectMessage);

router.get('/threads', authenticateJWT, getThreads);
router.get('/threads/unread', authenticateJWT, getUnreadCount);
router.post('/threads/mark-all-read', authenticateJWT, markAllAsRead);

module.exports = router;
