const db = require('../db/db');

// Get all messages exchanged between two profiles
const getByParticipants = async (profileId, otherProfileId) => {
  return await db('messages')
    .where({ sender_profile_id: profileId, recipient_profile_id: otherProfileId })
    .orWhere({ sender_profile_id: otherProfileId, recipient_profile_id: profileId })
    .orderBy('timestamp', 'asc');
};

// Create a new message between two profiles, optionally linked to a job
const createMessage = async ({ senderId, recipientId, text, jobId = null }) => {
  const payload = {
    sender_profile_id: senderId,
    recipient_profile_id: recipientId,
    text,
  };
  if (jobId !== null && jobId !== undefined) payload.job_id = jobId;

  const [message] = await db('messages').insert(payload).returning('*');
  return message;
};

// Get last message in each unique conversation (thread) for a user
const getThreads = async (meProfileId) => {
  const sql = `
    SELECT DISTINCT ON (t.other_id)
      t.id,
      t.sender_profile_id,
      t.recipient_profile_id,
      t.text,
      t.timestamp,
      t.other_id AS other_profile_id,
      p.display_name AS other_display_name,
      p.avatar_url AS other_avatar_url
    FROM (
      SELECT m.*,
             CASE
               WHEN m.sender_profile_id = ? THEN m.recipient_profile_id
               ELSE m.sender_profile_id
             END AS other_id
      FROM messages m
      WHERE m.sender_profile_id = ? OR m.recipient_profile_id = ?
    ) AS t
    JOIN profiles p ON p.id = t.other_id
    ORDER BY t.other_id, t.timestamp DESC
  `;
  const { rows } = await db.raw(sql, [meProfileId, meProfileId, meProfileId]);
  return rows;
}

// Count unread messages received by the current user
const getUnreadCount = async (profileId) => {
  const [{ count }] = await db('messages')
    .where({ recipient_profile_id: profileId, is_read: false })
    .count()
  return parseInt(count, 10) || 0
}

// Mark all received messages as read
const markAllAsRead = async (profileId) => {
  return await db('messages')
    .where({ recipient_profile_id: profileId, is_read: false })
    .update({ is_read: true })
}

module.exports = {
  getByParticipants,
  createMessage,
  getThreads,
  getUnreadCount,
  markAllAsRead
}
