const messageModel = require("../models/message_model");

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
};

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

const getThreads = async (req, res) => {
  const me = req.user.profileId;
  try {
    const threads = await messageModel.getThreads(me);
    res.json({ threads });
  } catch (error) {
    console.error("getThreads error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDirectMessages,
  sendDirectMessage,
  getThreads,
};
