const db = require('../db/db')


const getAllOffers = (userId) => {
  return db('offers')
    .join('profiles', 'offers.worker_profile_id', 'profiles.id')
    .where('profiles.user_id', userId)
    .select('offers.*')
    .orderBy('offers.created_at', 'desc');
}


const getOfferById = (id) => {
  return db('offers').where({id}).first()
}

const getOffersByJobId = (jobId) => {
  return db('offers')
    .join('profiles', 'offers.worker_profile_id', 'profiles.id')
    .join('users', 'profiles.user_id', 'users.id')
    .select(
      'offers.*',
      'users.id as worker_user_id',
      'users.username as worker_username'
    )
    .where('offers.job_id', jobId)
    .orderBy('offers.created_at', 'desc');
}

const createOffer = async (
  job_id,
  worker_profile_id,
  price,
  message,
  status
) => {
  const [offer] = await db('offers')
    .insert({  
      job_id,
      worker_profile_id,
      price,
      message,
      status: status ?? 'pending'
    })
    .returning('*')
  return offer
}

const updateOffer = async (
  id,
  price,
  message,
  status
) => {
  const update = {}

  if(price !== undefined)
    update.price = price;
  if(message !== undefined)
    update.message = message
  if(status !== undefined)
    update.status = status ?? 'pending'
  update.updated_at = db.fn.now();

  const [offer] = await db('offers')
    .where({id})
    .update(update)
    .returning('*')
  
  return offer
}


const deleteOffer = (id) => {
  return db('offers').where({id}).del()
}

const updateOfferStatus = async (id, status) => {
  const [offer] = await db('offers')
    .where({ id })
    .update({ status, updated_at: db.fn.now() })
    .returning('*');
  return offer;
};



module.exports = {
  getAllOffers,
  getOfferById,
  getOffersByJobId,
  createOffer,
  updateOffer,
  deleteOffer,
  updateOfferStatus
}

