const db = require('../db/db')

const getAllComments = () => {
  return db('comments')
  .select('*')
  .orderBy('created_at', 'desc')
}

const getCommentByWorkerId = (userId) => {
  return db('comments')
    .join('profiles', 'comments.worker_profile_id', 'profiles.id')
    .where('profiles.user_id', userId)
    .select('comments.*')
    .orderBy('comments.created_at', 'desc')
}

const createComment = async (
  client_profile_id,
  text,
  rating,
  worker_profile_id,
  job_id,
  photos
) => {
  const [comment] = await db('comments')
  .insert({
    client_profile_id,
    text,
    rating,
    worker_profile_id,
    job_id,
    photos: photos == null
      ? null
      : JSON.stringify(Array.isArray(photos) ? photos : [String(photos)]),
  })
  .returning('*')
  return comment
}


const updateComment = async(
  id,
  text,
  photos
) => {
  const update = {updated_at: db.fn.now()};
  if (text !== undefined)
    update.text = text;
  if (photos !== undefined) 
  update.photos = JSON.stringify(Array.isArray(photos) ? photos : [String(photos)])

  const [comment] = await db('comments')
  .where({id})
  .update(update)
  .returning('*')

  return comment
}


const deleteComment = (id) => {
  return db('comments').where({id}).del()
}

module.exports = {
  getAllComments,
  getCommentByWorkerId,
  createComment,
  updateComment,
  deleteComment
}