const offerModel = require('../models/offers_model')
const userModel = require('../models/users_model')
const profileModel = require('../models/profile_models')
const jobsModel = require('../models/jobs_model')


const getAllOfferController = async (req, res) => {
  try {
    const offers =  await offerModel.getAllOffers()
    if(offers.length < 1){
      res.status(400).json({message: "Offer list is empty"})
    }
  } catch (error) {
    console.error("Get all offers error: ", error);
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const getOfferByIdController = async (req, res) => {
  try {
    const {id} = req.params
    const job = await offerModel.getOfferById(id)
    if(!job){
      return res.status(404).json({message: "Offer not found"})
    }
    return res.status(200).json({message: "Offer details: ", job})
  } catch (error) {
    console.error("Get offer error : ", error.message);
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const createOfferController = async (req, res) => {
  const userId = req.user.userId
  const me = await userModel.getUserById(userId)
  if (!me) {
    return res.status(404).json({message: "User not found"})
  }
  if (me.role !== 'worker') {
      return res.status(403).json({message: "Only worker can accept offers"})
  }
  const workerProfile = await profileModel.getProfileByUserId(userId)
  if(!workerProfile) {
     return res.status(404).json({message: "Worker profile not found"})
  }
  const { job_id, price, message } = req.body;
    if (!job_id) {
      return res.status(400).json({message: 'job_id is required' });
    }
    if (price !== undefined) {
      const p = Number(price)
      if (Number.isNaN(p) || p < 0) {
        return res.status(400).json({message:"price must be a non-negative number"})
      }
    }
    if (message !== undefined && typeof message !== 'string') {
      return res.status(400).json({message: "message must be a string"})
    }

  const job = await jobsModel.getJobById(job_id)
    if (!job) {
      return res.status(404).json({message: "Job not found"})
    }
    if (job.status !== 'open') {
      return res.status(409).json({message: "Offers are allowed only for open jobs"})
    }
    if (job.client_id === workerProfile.id) {
      return res.status(403).json({message: "You cannot create an offer for your own job"})
    }
    try {
      const offer = await offerModel.createOffer(
        job_id,
        workerProfile.id,
        price ?? null,
        message ?? null,
        undefined
      );
      return res.status(201).json({message: "Offer created: ", offer})
    }
  catch (error) {
    console.error('Create offer error:', error.message)
    return res.status(500).json({message: 'Server error', error: error.message})
  }
}

const updateOfferController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const me = await userModel.getUserById(userId)
    if (!me) return res.status(404).json({message: "User not found"})
    if (me.role !== 'worker') {
      return res.status(403).json({message: "Only workers can update offers"})
    }
    const workerProfile = await profileModel.getProfileByUserId(userId)
    if (!workerProfile) {
      return res.status(404).json({ message:"Worker profile not found"})
    }
    const { id } = req.params;
    const offer = await offerModel.getOfferById(id);
    if (!offer) return res.status(404).json({message: "Offer not found"})

    if (offer.worker_profile_id !== workerProfile.id) {
      return res.status(403).json({message: "You can update only your own offers"})
    }
    if (offer.status !== 'pending') {
      return res.status(409).json({message: "Only pending offers can be updated"})
    }
    const { price, message } = req.body
    if (price !== undefined) {
      const p = Number(price)
      if (Number.isNaN(p) || p < 0) {
        return res.status(400).json({message: "price must be a non-negative number"})
      }
    }
    if (message !== undefined && typeof message !== 'string') {
      return res.status(400).json({message: "message must be a string"})
    }

    if (price === undefined && message === undefined) {
      return res.status(400).json({message: "Nothing to update"})
    }
    const updated = await offerModel.updateOffer(
      id,
      price,
      message,
      undefined
    )

    return res.status(200).json({message: "Offer upda2ted", offer: updated})
  } catch (error) {
    console.error("Update offer error:", error.message)
    return res.status(500).json({message: "Server error", error: error.message})
  }
}

const deleteOfferController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const me = await userModel.getUserById(userId)
    if (!me) return res.status(404).json({message: "User not found"})
    if (me.role !== 'worker') {
      return res.status(403).json({message: "Only workers can delete offers"})
    }
        const workerProfile = await profileModel.getProfileByUserId(userId)
    if (!workerProfile) {
      return res.status(404).json({message: "Worker profile not found"})
    }
    const { id } = req.params
    const offer = await offerModel.getOfferById(id)
    if (!offer) return res.status(404).json({message: "Offer not found"})

    if (offer.worker_profile_id !== workerProfile.id) {
      return res.status(403).json({message: "You can delete only your own offers"})
    }
    if (offer.status !== 'pending') {
      return res.status(409).json({ message: "Only pending offers can be deleted"})
    }
    const deleted = await offerModel.deleteOffer(id);
    if (deleted === 0) {
      return res.status(404).json({message: "Offer not found"})
    }

    return res.status(200).json({message: "Offer deleted successfully"})
  } catch (error) {
    console.error("Delete offer error:", error.message);
    return res.status(500).json({message: "Server error", error: error.message});
  }
}

const updateOfferStatusController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const me = await userModel.getUserById(userId);
    if (!me) return res.status(404).json({message: "User not found"})
    if (me.role !== 'client') {
      return res.status(403).json({message: "Only clients can change offer status"})
    }

    const { id } = req.params
    const offer = await offerModel.getOfferById(id)
    if (!offer) return res.status(404).json({message: "Offer not found"})

    const job = await jobsModel.getJobById(offer.job_id)
    if (!job) return res.status(404).json({message: "Job not found"})
    if (job.client_id !== userId) {
      return res.status(403).json({message: "You can update offers only for your jobs"});
    }

    const { status } = req.body
    const allowedStatuses = ['pending', 'accepted', 'rejected']
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status',
        allowed: allowedStatuses
      })
    }

    const updated = await offerModel.updateOfferStatus(id, status)
    return res.status(200).json({message: "Offer status updated", offer: updated})
  } catch (error) {
    console.error("Update offer status error:", error.message);
    return res.status(500).json({message: "Server error", error: error.message});
  }
}

const getOffersByJobController = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;
    console.log("Job fetch for userId:", userId);

    const job = await jobsModel.getJobById(jobId);
    console.log("Job.client_id profile ID? actual value:", job.client_id);

    const profile = await profileModel.getProfileByUserId(userId);
    console.log("Your profile.id:", profile?.id);

    if (!job) return res.status(404).json({ message: "Job not found" });
    if (!profile || job.client_id !== profile.id) {
      return res
        .status(403)
        .json({ message: "You can view offers only for your jobs" });
    }

    const offers = await offerModel.getOffersByJobId(jobId);
    return res.json({ offers });
  } catch (error) {
    console.error("Error loading offers by job:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message})
  }
}


module.exports = {
  getAllOfferController,
  getOfferByIdController,
  createOfferController,
  deleteOfferController,
  updateOfferStatusController,
  updateOfferController,
  getOffersByJobController

}