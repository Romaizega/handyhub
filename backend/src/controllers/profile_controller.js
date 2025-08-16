const profileModel = require('../models/profile_models')
const userModel = require('../models/users_model')

const getAllProfiles = async(req, res) =>{
  try {
    const profiles = await profileModel.getAllProfiles();
    if(profiles.length < 1){
      res.status(400).json({message: "Profiles are empty"})
    }
    res.status(200).json({message: "You got all profiles: ", profiles})
  } catch (error) {
    console.error("Get profiles error", error.message);
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const getProfileById = async(req, res) =>{
  try {
    const {id} = req.params
    const profile = await profileModel.getProfileByUserId(id)
    if(!profile) {
      return res.status(404).json({message: "Profile not found"})
    }
    return res.status(200).json({message: "Profile: ", profile})
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error", error: error.message})
  }
}


const createProfileController = async(req, res) => {
  const userId = req.user.userId
  const {
    display_name,
    city,
    about,
    avatar_url,
    skills,
    hourly_rate
  } = req.body
  try {
    const me = await userModel.getUserById(userId)
    if(!me) {
      return res.status(404).json({message: "User not found"})
    }
    if(display_name == undefined || display_name.trim().length < 3) {
      return res.status(400).json({message: "Display_name must be at least 3 chars"})
    }
    if(city == undefined || city.trim().length === 3) {
      return res.status(400).json({message: "city cannot be empty"})
    }
    
    const roleDB = me.role
    if (roleDB === 'worker') {
      if (skills === undefined || String(skills).trim().length === 0) {
        return res.status(400).json({ message: "skills are required for worker" });
      }
      if (hourly_rate !== undefined) {
        const rateNum = Number(hourly_rate);
        if (Number.isNaN(rateNum) || rateNum < 0) {
          return res.status(400).json({ message: "hourly_rate must be a non-negative number" });
        }
      }
    }

    const skillsForWorker = roleDB === 'worker' ? (skills ?? null) : null;
    const hourlyForWorker = roleDB === 'worker' ? (hourly_rate ?? null) : null;

    const existing = await profileModel.getProfileByUserId(userId);
    if (existing) {
      return res.status(409).json({ message: "Profile already exists" });
    }

    const profile = await profileModel.createProfile(
      userId,
      roleDB,
      display_name.trim(),
      city.trim(),
      about ?? null,
      avatar_url ?? null,
      skillsForWorker,
      hourlyForWorker
    );

    return res.status(201).json({message: "Profile created", profile})
  } catch (error) {
    if (error && error.code === '23505') {
     return res.status(409).json({ message: "Profile already exists" })
  }
    console.error("Create profile error", error);
    res.status(500).json({message: "Server error", error: error.message})
  }
}

const updateProfileController = async (req, res) => {
  const userId = req.user.userId
  const { display_name, city, about, avatar_url, skills, hourly_rate } = req.body

  try {
    const me = await userModel.getUserById(userId)
    if (!me) return res.status(404).json({ message: "User not found"});

    if (display_name !== undefined && display_name.trim().length < 3) {
      return res.status(400).json({ message: "display_name must be at least 3 characters"});
    }
    if (city !== undefined && city.trim().length === 0) {
      return res.status(400).json({ message: "city cannot be empty"});
    }
    if (me.role === 'worker') {
      if (skills !== undefined && typeof skills !== 'string') {
        return res.status(400).json({ message: "skills must be a comma-separated string"});
      }
      if (hourly_rate !== undefined && (Number.isNaN(Number(hourly_rate)) || Number(hourly_rate) < 0)) {
        return res.status(400).json({ message: "hourly_rate must be a non-negative number"})
      }
    } else if (me.role === 'client') {
    }

    const profile = await profileModel.updateProfile(
      userId,
      display_name,
      city,
      about,
      avatar_url,
      me.role === 'worker' ? skills : undefined,
      me.role === 'worker' ? hourly_rate : undefined
    );

    if (!profile) return res.status(404).json({ message: "Profile not found"})

    return res.status(200).json({ profile })
  } catch (error) {
    console.error('Update profile error:', error)
    return res.status(500).json({ message: "Server error", error: error.message })
  }
}

const deleteProfileController = async(req, res) => {
  const userId = req.user.userId;
  try {
    const deletedUser = await profileModel.deleteProfile(userId)
    if (deletedUser === 0) {
      return res.status(404).json({ message: "Profile not found"});
    }
    return res.status(200).json({ message: "Profile deleted successfully"});
  } catch (error) {
    console.error("Delete profile error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getMyprofileController = async(req, res) => {
  try {
    const userId = req.user.userId
    const profile = await profileModel.getProfileByUserId(userId)
    if(!profile){
      return res.status(404).json({message: "Profile not found"})
    }
    return res.status(200).json({message: "Profile: ", profile})
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  getAllProfiles,
  getProfileById,
  updateProfileController,
  createProfileController,
  deleteProfileController,
  getMyprofileController
}