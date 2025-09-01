const commentModel = require('../models/comments_model')
const profileModel = require('../models/profile_models')
const jobsModel = require('../models/jobs_model')


const getAllCommentsController = async(req, res) => {
  try {
    const comments = await commentModel.getAllComments()
    if(comments.length < 1){
      res.status(400).json({message: "Commets list is empty"})
    }
    res.status(200).json({message:"Got all comments", comments})
  } catch (error) {
    console.error("Get all comments error", error.message);
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const getCommentByWorkerIdController = async(req, res) => {
  try {
    const userId = req.user.body
    const comments = await commentModel.getCommentByWorkerId(userId)
        if (!comments.length) {
          return res.status(404).json({ message: "Comment not found"})
        }
        return res.status(200).json({message: "Comments", comments})
      } catch (error) {
        console.error("Get comments error:", error.message)
        res.status(500).json({message: "Server error", error: error.message })
      }
}

module.exports = {
  getAllCommentsController,
  getCommentByWorkerIdController
}

