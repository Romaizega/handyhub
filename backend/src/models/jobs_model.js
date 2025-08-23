const db = require('../db/db')

// Get all jobs ordered by status
const getAllJobs = () => {
  return db('jobs').select('*').orderBy('status', 'desc')
}

// Get detailed job info by job ID (includes client email)
const getJobById = (id) => {
  return db('jobs')
    .join('profiles', 'profiles.id', '=', 'jobs.client_id')
    .join('users', 'profiles.user_id', '=', 'users.id')
    .select(
      'jobs.*',
      'profiles.user_id as client_user_id',
      'users.email as client_email'
    )
    .where('jobs.id', id)
    .first();
}

// Get all jobs posted by a specific client (profile ID)
const getJobsByClientId = (client_id) => {
  return db('jobs').where({client_id}).orderBy('created_at', 'desc');
}

// Create a new job 
const createJob = async (
  client_id,
  title,
  description,
  photos,
  status,
  budget,
  due_date,
  city
) => {
  const [job] = await db('jobs')
    .insert({
      client_id,
      title,
      description,
      photos: photos == null
      ? null
      : JSON.stringify(Array.isArray(photos) ? photos : [String(photos)]),
      status,
      budget,
      due_date,
      city
    })
    .returning('*');

  return job;
};

// Update a job with only provided fields
const updateJob = async (
  id,
  title,
  description,
  photos,
  status,
  budget,
  due_date,
  city
) => {
  const update = { updated_at: db.fn.now() };
  if (title !== undefined)
     update.title = title;
  if (description !== undefined)
     update.description = description;
  if (photos !== undefined) 
    update.photos = JSON.stringify(Array.isArray(photos) ? photos : [String(photos)])
  if (status !== undefined) 
    update.status = status;
  if (budget !== undefined) 
    update.budget = budget;
  if (due_date !== undefined) 
    update.due_date = due_date;
  if (city !== undefined) 
    update.city = city;

  const [job] = await db('jobs')
    .where({ id })
    .update(update)
    .returning('*');
  return job;
};

// Delete job by ID
const deleteJob = (id) => {
  return db('jobs').where({id}).del()
}

// Update only the status field of a job
const updateJobStatus = async (id, status) => {
  const [job] = await db('jobs')
    .where({id})
    .update({
      status,
      updated_at: db.fn.now()
    })
    .returning('*');
  return job;
}

// Get paginated jobs (for public or admin listing)
const getJobsPaged = async (limit, page) => {
  const offset = (page - 1) * limit;

  const jobs = await db('jobs')
    .select('*')
    .orderBy('created_at', 'desc')
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db('jobs').count('*');

  return {
    jobs,
    total: Number(count),
    page,
    totalPages: Math.ceil(count / limit)
  };
};

module.exports = {
  getAllJobs,
  getJobById,
  getJobsByClientId,
  createJob,
  updateJob,
  updateJobStatus,
  deleteJob,
  getJobsPaged
}