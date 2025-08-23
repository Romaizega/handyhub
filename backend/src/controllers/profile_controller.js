const profileModel = require('../models/profile_models')
const userModel = require('../models/users_model')

// Retrieves all profiles (admin/internal use)
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

// Retrieves a single profile by user ID (internal use)
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

// Public endpoint to get both profile and user info by user ID
const getProfileByUserIdpublic = async (req, res) => {
  const { id } = req.params;
  console.log("received GET /profiles/by-user/:id =", id);

  try {
    const profile = await profileModel.getProfileByUserId(id);
    console.log("profileModel.getProfileByUserId →", profile);

    const user = await userModel.getUserById(id);
    console.log("userModel.getUserById →", user);

    if (!profile || !user) {
      return res.status(404).json({ message: "Profile or user not found" });
    }

    res.status(200).json({ message: "Profile and user", profile, user })
  } catch (error) {
    console.error("Error fetching public profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Public endpoint to fetch only worker profiles
const getProfilesWorkerPublic = async (req, res) => {
  try {
    const profiles = await profileModel.getAllProfiles();
    const workerProfiles = profiles.filter(profile => profile.role === 'worker');

    if (!workerProfiles || workerProfiles.length === 0) {
      return res.status(404).json({ message: "No worker profiles found" })
    }
    res.status(200).json({ message: "Worker profiles", profiles: workerProfiles })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a new profile (after registration)
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

// Update profile data (including optional avatar upload)
const updateProfileController = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const {
      display_name,
      city,
      about,
      avatar_url: avatarUrlFromBody,
      skills,           
      hourly_rate        
    } = req.body || {};

    const me = await userModel.getUserById(userId);
    if (!me) return res.status(404).json({ message: 'User not found' });

    if (display_name !== undefined && display_name.trim().length < 3) {
      return res.status(400).json({ message: 'display_name must be at least 3 characters' });
    }
    if (city !== undefined && city.trim().length === 0) {
      return res.status(400).json({ message: 'city cannot be empty' });
    }
    if (me.role === 'worker') {
      if (skills !== undefined && typeof skills !== 'string') {
        return res.status(400).json({ message: 'skills must be a comma-separated string' });
      }
      if (hourly_rate !== undefined && (Number.isNaN(Number(hourly_rate)) || Number(hourly_rate) < 0)) {
        return res.status(400).json({ message: 'hourly_rate must be a non-negative number' });
      }
    }


    const storedPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;
    const nextAvatarUrl = storedPath ?? (avatarUrlFromBody || null);
    const rate = (hourly_rate === '' || hourly_rate == null) ? null : Number(hourly_rate);

    const updated = await profileModel.updateProfile(
      userId,
      display_name,
      city,
      about,
      nextAvatarUrl,                                  
      me.role === 'worker' ? skills : undefined,      
      me.role === 'worker' ? rate : undefined
    );

    if (!updated) return res.status(404).json({ message: 'Profile not found' });

    const publicBase =
      process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;

    const profileForClient = {
      ...updated,
      avatar_url: updated.avatar_url
        ? (updated.avatar_url.startsWith('http')
            ? updated.avatar_url
            : `${publicBase}${updated.avatar_url}`)
        : null
    };

    return res.status(200).json({ profile: profileForClient });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Delete the current user's profile
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
}

// Get the profile of the currently authenticated user
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
  getMyprofileController,
  getProfileByUserIdpublic,
  getProfilesWorkerPublic,
}