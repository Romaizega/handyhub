const jwt = require('jsonwebtoken');
const db = require('../db/db');

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload.userId) {
      return res.status(401).json({ message: 'Invalid token: userId missing' });
    }
    let profileId = null;

    const profile = await db('profiles')
      .select('id')
      .where({ user_id: payload.userId })
      .first();

    if (profile) {
      profileId = profile.id;
    }

    req.user = {
      ...payload,
      profileId, 
    };

    next();
  } catch (err) {
    console.error('JWT auth error:', err);
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};

module.exports = authenticateJWT
