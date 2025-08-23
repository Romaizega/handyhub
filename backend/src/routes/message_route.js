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
// Get messages between current and another profile
router.get('/direct', authenticateJWT, getDirectMessages);
// Send direct message to another profile
router.post('/direct', authenticateJWT, sendDirectMessage);
// Get message threads for current profile
router.get('/threads', authenticateJWT, getThreads);
// Get unread message count
router.get('/threads/unread', authenticateJWT, getUnreadCount);
// Mark all messages as read
router.post('/threads/mark-all-read', authenticateJWT, markAllAsRead);

module.exports = router;
