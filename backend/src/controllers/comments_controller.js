const commentModel = require('../models/comments_model')
const profileModel = require('../models/profile_models')
const jobsModel = require('../models/jobs_model')
const userModel = require('../models/users_model')
const offerModel = require('../models/offers_model')


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
    // const userId = req.params.id
    const profileId = req.params.id
    const comments = await commentModel.getCommentByWorkerId(profileId)
        if (!comments.length) {
          return res.status(404).json({ message: "Comment not found"})
        }
        return res.status(200).json({message: "Comments", comments})
      } catch (error) {
        console.error("Get comments error by worker:", error.message)
        res.status(500).json({message: "Server error", error: error.message })
      }
}

const createCommentController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    const user = await userModel.getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    if (user.role !== 'client') {
      return res.status(403).json({ message: "Only clients can leave reviews" });
    }
    
    console.log("req.user.userId:", userId);
    const profile = await profileModel.getProfileByUserId(userId);
    if (!profile) {
      return res.status(400).json({ message: "Client profile not found" });
    }
    
    const { text, rating, offerId } = req.body;
    const files = req.files || [];
    const photoPaths = files.map(f => `/uploads/comments/${f.filename}`);

    if (!offerId) {
      return res.status(400).json({ message: "Offer ID is required" });
    }

    const offer = await offerModel.getOfferById(offerId);
    if (!offer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const workerProfile = await profileModel.getProfileByUserId(offer.worker_profile_id);
    if (!workerProfile) {
      return res.status(404).json({ message: "Worker profile not found" });
    }

    if (!text || text.trim().length < 3) {
      return res.status(400).json({ message: "Review text must be at least 3 characters" });
    }

    const parsedRating = Number(rating);
    if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
    }

    const comment = await commentModel.createComment(
      profile.id,
      text.trim(),
      parsedRating,
      workerProfile.id,
      offer.job_id,
      photoPaths,
    );

    return res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    console.error("Create comment error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  getAllCommentsController,
  getCommentByWorkerIdController,
  createCommentController
}

