const jwt = require('jsonwebtoken')

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if(!authHeader) {
    return res.status(401).json({message: "Access token missing"})
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token, process.env.JWT_SECRET, (error, user)=>{
    if(error){
      return res.status(403).json({message: "Invalid or expired access token "})
    }
    req.user = user
    next()
  })
}

module.exports = authenticateJWT