const db = require('../db/db')

const getAllProfiles = () => {
  return db('profiles').select('*').orderBy('updated_at', 'desc')
}

const getProfileByUserId = (id) => {
  return db('profiles').where({user_id: id}).first()
}

const createProfile = async (
  user_id,
  role,
  display_name,
  city,
  about,
  avatar_url,
  skills,
  hourly_rate
) => {
  const [profile] = await db('profiles')
    .insert({
      user_id,
      role,
      display_name,
      city,
      about,
      avatar_url,
      skills,
      hourly_rate
    })
    .returning('*');

  return profile;
};

const updateProfile = async (
  user_id,
  display_name,
  city,
  about,
  avatar_url,
  skills,
  hourly_rate
) => {
  const update = {};

  if (display_name !== undefined) 
    update.display_name = display_name;
  if (city !== undefined)
    update.city = city;
  if (about !== undefined)
    update.about = about;
  if (avatar_url !== undefined)
    update.avatar_url = avatar_url;
  if (skills !== undefined)
    update.skills = skills;
  if (hourly_rate !== undefined)
    update.hourly_rate = hourly_rate;
  update.updated_at = db.fn.now();

  const [profile] = await db('profiles')
    .where({ user_id })
    .update(update)
    .returning('*');

  return profile;
};

const deleteProfile = (user_id) => {
  return db('profiles').where({user_id}).del()
}


module.exports = {
  getProfileByUserId,
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile
}