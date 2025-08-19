const profileModel = require('../models/profile_models')
const userModel = require('../models/users_model')
const jobsModel = require('../models/jobs_model')
const fs = require('fs');
const path = require('path')

const getAllJobsController = async(req, res) => {
  try {
    const jobs = await jobsModel.getAllJobs()
    if(jobs.length < 1){
      res.status(400).json({message: "Jobs list is empty"})
    }
    res.status(200).json({message: "Got all jobs", jobs})
  } catch (error) {
    console.error("Get all jobs error", error.message);
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const getJobByIdController = async (req, res) => {
  try {
    const {id} = req.params
    const job = await jobsModel.getJobById(id)
    if(!job){
      return res.status(404).json({message: "Job not found"})
    }
    return res.status(200).json({message: "Job details: ", job})
  } catch (error) {
    console.error("Get job error getJobByIdController func: ", error.message);
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const getJobsByClientIdController = async (req, res) => {
  try {
    const userId = req.user.userId
    const profile = await profileModel.getProfileByUserId(userId)
    if (!profile) {
      return res.status(404).json({ message: "Profile not found"})
    }
    const jobs = await jobsModel.getJobsByClientId(profile.id)
    if (jobs.length < 1) {
      return res.status(200).json({message: "No jobs for this client", jobs: [] })
    }
    return res.status(200).json({message: "Client jobs", jobs })
  } catch (error) {
    console.error("Get client jobs error:", error.message)
    res.status(500).json({message: "Server error", error: error.message })
  }
}

const createJobController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const me = await userModel.getUserById(userId);
    if (!me) return res.status(404).json({ message: "User not found"});
    if (me.role !== 'client') {
      return res.status(403).json({message: "Only clients can create jobs"});
    }
    const profile = await profileModel.getProfileByUserId(userId)
    if(!profile){
      return res.status(400).json({message: "Profile not found"})
    }

    const { title, description, photos, budget, due_date, status } = req.body;
    const uploadedFiles = req.files || []
    const photoNames = uploadedFiles.map(f => `/uploads/jobs/${f.filename}`)


    if (!title || title.trim().length < 3) {
      return res.status(400).json({message: "title must be at least 3 characters"});
    }
    if (!description || description.trim().length < 10) {
      return res.status(400).json({message: "description must be at least 10 characters"});
    }
    if (budget !== undefined) {
      const b = Number(budget);
      if (Number.isNaN(b) || b < 0) {
        return res.status(400).json({message: "budget must be a non-negative number"});
      }
    }

    const allowedStatuses = ['open', 'in_progress', 'done', 'cancelled'];
    const safeStatus = status && allowedStatuses.includes(status) ? status : 'open';

    const job = await jobsModel.createJob(
      profile.id,    
      title.trim(),
      description.trim(),
      photoNames,
      safeStatus,
      budget ?? null,
      due_date ?? null
    )

    return res.status(201).json({message: "Job created", job });
  } catch (error) {
    console.error("Create job error:", error);
    return res.status(500).json({message: "Server error", error: error.message });
  }
};

const updateJobController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const me = await userModel.getUserById(userId);
    if (!me) return res.status(404).json({ message: "User not found" });
    if (me.role !== 'client') {
      return res.status(403).json({ message: "Only clients can update jobs" });
    }

    const profile = await profileModel.getProfileByUserId(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const existing = await jobsModel.getJobById(id);
    if (!existing) return res.status(404).json({ message: "Job not found" });
    if (existing.client_id !== profile.id) {
      return res.status(403).json({ message: "You can only update your own jobs" });
    }

    const { title, description, status, budget, due_date } = req.body;

    // validation
    if (title && title.trim().length < 3) {
      return res.status(400).json({ message: "Title must be at least 3 characters" });
    }
    if (description && description.trim().length < 10) {
      return res.status(400).json({ message: "Description must be at least 10 characters" });
    }
    if (budget !== undefined) {
      const b = Number(budget);
      if (isNaN(b) || b < 0) {
        return res.status(400).json({ message: "Budget must be a non-negative number" });
      }
    }

    // parse existingPhotos safely
    const raw = req.body.existingPhotos;
    const existingPhotos = Array.isArray(raw) ? raw : raw ? [raw] : [];

    const uploadedFiles = req.files || [];
    const newPhotoPaths = uploadedFiles.map(f => `/uploads/jobs/${f.filename}`);

    // delete removed old photos
    const toDelete = (existing.photos || []).filter(p => !existingPhotos.includes(p));
    for (const photoPath of toDelete) {
      const absPath = path.join(process.cwd(), photoPath);
      fs.unlink(absPath, err => {
        if (err) console.error("Failed to delete:", absPath, err.message);
      });
    }

    // ensure finalPhotos is a valid array of strings
    const finalPhotos = [...existingPhotos, ...newPhotoPaths].filter(p => typeof p === 'string');

    const updated = await jobsModel.updateJob(
      id,
      title?.trim(),
      description?.trim(),
      finalPhotos,
      status,
      budget ?? null,
      due_date ?? null
    );

    return res.status(200).json({ message: "Job updated", job: updated });

  } catch (error) {
    console.error("Update job error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateJobStatusController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { status } = req.body;

    const me = await userModel.getUserById(userId);
    if (!me) return res.status(404).json({message: "User not found"});
    if (me.role !== 'client') {
      return res.status(403).json({message: "Only clients can change job status"});
    }

    const profile = await profileModel.getProfileByUserId(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" })
    const job = await jobsModel.getJobById(id);
    if (!job) return res.status(404).json({message: "Job not found"});
    if (job.client_id !== profile.id) {
      return res.status(403).json({message: "You can change status only for your jobs"});
    }

    const allowedStatuses = ['open', 'in_progress', 'done', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({message: "Invalid status", allowed: allowedStatuses});
    }

    const updated = await jobsModel.updateJobStatus(id, status);
    return res.status(200).json({message: "Job status updated", job: updated});
  } catch (error) {
    console.error("Update job status error:", error.message);
    return res.status(500).json({message: "Server error", error: error.message});
  }
};

const deleteJobController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const me = await userModel.getUserById(userId);
    if (!me) return res.status(404).json({ message: "User not found" });
    if (me.role !== 'client') {
      return res.status(403).json({ message: "Only clients can delete their jobs" });
    }

    const profile = await profileModel.getProfileByUserId(userId);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const job = await jobsModel.getJobById(id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.client_id !== profile.id) {
      return res.status(403).json({ message: "You can delete only your own jobs" });
    }

    const deleted = await jobsModel.deleteJob(id);
    if (deleted === 0) {
      return res.status(404).json({ message: "Job not found" });
    }

    return res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Delete job error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

const getJobsPagedController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const data = await jobsModel.getJobsPaged(limit, page);

    res.status(200).json(data);
  } catch (error) {
    console.error("Get jobs paged error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {
  getAllJobsController,
  getJobByIdController,
  updateJobController,
  updateJobStatusController,
  deleteJobController,
  createJobController,
  getJobsByClientIdController,
  getJobsPagedController
  
}