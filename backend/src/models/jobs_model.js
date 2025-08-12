const db = require('../db/db')


const getAllJobs = () => {
  return db('jobs').select('*').orderBy('status', 'desc')
}

const getJobById = (id) => {
  return db('jobs').where({id}).first()
}

const getJobsByClientId = (client_id) => {
  return db('jobs').where({client_id}).orderBy('created_at', 'desc');
}

const createJob = async (
  client_id,
  title,
  description,
  photos,
  status,
  budget,
  due_date
) => {

  const [job] = await db('jobs')
    .insert({
      client_id,
      title,
      description,
      photos: photos == null
      ?null
      :JSON.stringify(Array.isArray(photos) ? photos: [String[photos]]),
      status,
      budget,
      due_date
    })
    .returning('*');

  return job;
};

const updateJob = async (
  id,
  title,
  description,
  photos,
  status,
  budget,
  due_date
) => {
  const update = {}

  if (title !== undefined) 
    update.title = title;
  if (description !== undefined)
    update.description = description;
  if (photos !== undefined)
    update.photos = photos == null
      ? null
      : JSON.stringify(Array.isArray(photos) ? photos: [String[photos]]);
  if (status !== undefined)
    update.status = status;
  if (budget !== undefined)
    update.budget = budget;
  if (due_date !== undefined)
    update.due_date = due_date;
  update.updated_at = db.fn.now();

  const [job] = await db('jobs')
    .where({id})
    .update(update)
    .returning('*');

  return job;
}

const deleteJob = (id) => {
  return db('jobs').where({id}).del()
}

const updateJobStatus = async (id, status) => {
  const [job] = await db('jobs')
    .where({id})
    .update({
      status,
      updated_at: db.fn.now()
    })
    .returning('*');
  return job;
};


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