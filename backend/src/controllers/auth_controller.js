const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const userModel = require('../models/users_model');


const register = async (req, res) => {
  const {username, email, password, role} = req.body;

  if(!username || !email || !password || !role) {
    return res.status(400).json({message: "All fields are required to fill out"})
  };

  if(username.length < 3) {
    return res.status(400).json({message: "Username must be at least 3 characters long"})
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if(!emailRegex.test(email)) {
    return res.status(400).json({message: "Invalid email format"})
  }
  const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  if(!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must be at least 8 characters long and include at least one letter and one number"
    })
  }

  try {
    if(await userModel.getUserByUsername(username)) {
      return res.status(400).json({message: "Username already exisist"})
    }
    if(await userModel.getUserByEmail(email)) {
      return res.status(400).json({message: "Email already exisist"})
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await userModel.createUser(username, email, hashedPassword, role)
    res.status(200).json({
      message: "New user created successfully",
      user: {id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role}
    })
  } catch (error) {
    console.error("Register error", error);
    res.status(500).json({message: "Server error", error: error.message})
  }
};

const login = async (req, res) => {
  const {username, password} = req.body
  if(!username || !password) {
    return res.status(401).json({message: "All fields are required"})
  }
  try {
    const user = await userModel.getUserByUsername(username)
    if(!user){
      return res.status(401).json({message: "Invalid username"})
    }

    const isMatchPassword = await bcrypt.compare(password, user.password_hash);
    if(!isMatchPassword) {
      return res.status(401).json({message: "Invalid password"})
    }

    const accessToken = jwt.sign(
      {userId: user.id, username: user.username},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_DAY}
    )
    const refreshToken = jwt.sign(
      {userId: user.id, username: user.username},
      process.env.REFRESH_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_WEEK}
    )

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.status(200).json({
      message: "Login successfuly",
      accessToken
    })

  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({message: "Server error", error: error.message})
  }
}


const me = async (req, res) => {
  try {
    const user = await userModel.getUserById(req.user.userId)
    if(!user) {
      return res.status(404).json({message: "User not found"})
    }
    res.status(200).json({
      message: "User found",
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    })
  } catch (error) {
    console.error("Function me error: ", error);
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if(!refreshToken) {
    return res.status(403).json({message: "Refresh token missing"})}
  jwt.verify(refreshToken, process.env.REFRESH_SECRET, (error, user)=>{
    if(error){
      return res.status(403).json({message: "Invalid or expire refresh token"})}
    const newAccessToken = jwt.sign(
      {userId: user.userId, username: user.username},
      process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_DAY}
    )
    res.json({accessToken: newAccessToken})
  })
}

const logout = (req, res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  res.status(200).json({message: "Logout successfully"})
}

const getUsersPaged = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const role = req.query.role || null;

    const data = await userModel.getUsersPaged(limit, page, role);

    res.status(200).json(data);
  } catch (error) {
    console.error("Get users paged error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  register,
  login,
  me,
  refreshAccessToken,
  logout,
  getUsersPaged
}