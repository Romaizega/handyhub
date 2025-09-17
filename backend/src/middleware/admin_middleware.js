const jwt = require('jsonwebtoken');
const db = require('../db/db');


const adminAuthorize = (req, res, next) => {
  if(!req.user || req.user.role !== 'admin') {
    return res.status(403).json({message: "Access denide. Admin only"})
  }
  next()
}

module.exports = adminAuthorize