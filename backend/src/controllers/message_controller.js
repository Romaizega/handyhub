const messageModel = require("../models/message_model");

// Get all direct messages between current user and another profile
const getDirectMessages = async (req, res) => {
  const currentProfileId = req.user.profileId;
  const { otherProfileId } = req.query;
  if (!otherProfileId) {
    return res.status(400).json({ message: "otherProfileId required" });
  }
  try {
    const messages = await messageModel.getByParticipants(
      currentProfileId,
      Number(otherProfileId)
    );
    res.json({ messages });
  } catch (error) {
    console.error("getDirectMessages error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Send a direct message to another profile (optionally linked to a job)
const sendDirectMessage = async (req, res) => {
  const senderId = req.user.profileId;
  const { recipientId, text, jobId } = req.body;
  if (!senderId) return res.status(401).json({ message: "Unauthorized: profileId missing" });
  if (!recipientId || !text?.trim()) {
    return res.status(400).json({ message: "recipientId and text are required" });
  }
  try {
    const message = await messageModel.createMessage({
      senderId,
      recipientId,
      text: text.trim(),
      jobId,
    });
    res.status(201).json({ message });
  } catch (error) {
    console.error("sendDirectMessage error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all conversation threads involving the current user
const getThreads = async (req, res) => {
  const me = req.user.profileId;
  try {
    const threads = await messageModel.getThreads(me);
    res.json({ threads });
  } catch (error) {
    console.error("getThreads error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get total count of unread messages for current user
const getUnreadCount = async (req, res) => {
  try {
    const profileId = req.user.profileId
    const count = await messageModel.getUnreadCount(profileId)
    res.json({ unread: count })
  } catch (error) {
    console.error("getUnreadCount error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Mark all unread messages as read for the current user
const markAllAsRead = async (req, res) => {
  try {
    const profileId = req.user.profileId
    await messageModel.markAllAsRead(profileId)
    res.json({ success: true })
  } catch (error) {
    console.error("markAllAsRead error:", error)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getDirectMessages,
  sendDirectMessage,
  getThreads,
  getUnreadCount,
  markAllAsRead
}
