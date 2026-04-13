const skillsModel = require('../models/skills_model')

const getAllSkills = async(req, res) => {
  try {
    const skills = await skillsModel.getAllSkills()
    return res.status(200).json({ message: "Got skills", skills })
  } catch (error) {
    console.error("Get all skills error", error.message)
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getAllSkills
}