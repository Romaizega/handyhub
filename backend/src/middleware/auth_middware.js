const jwt = require('jsonwebtoken');
const db = require('../db/db');

// Middleware to authenticate JWT and attach user info to request
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    // Check if Authorization header is present and formatted correctly
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract token part
    const payload = jwt.verify(token, process.env.JWT_SECRET); // Validate token


    if (!payload.userId) {
      return res.status(401).json({ message: 'Invalid token: userId missing' });
    }
    let profileId = null;

     // Fetch profile ID associated with the userId from the token
    const profile = await db('profiles')
      .select('id')
      .where({ user_id: payload.userId })
      .first();

    if (profile) {
      profileId = profile.id;
    }

    // Attach user info to request object for downstream use
    req.user = {
      ...payload,
      profileId, 
    };

    next();  // Proceed to next middleware
  } catch (err) {
    console.error('JWT auth error:', err);
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }
};

module.exports = authenticateJWT
