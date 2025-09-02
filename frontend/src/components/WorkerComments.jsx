import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCommentsByWorkerId } from '../features/comments/commentThunk';
import { AUTH_STATUS } from '../features/auth/authConstants';

const WorkerComments = ({ workerId }) => {
  const dispatch = useDispatch();
  const { comments, status, error } = useSelector(state => state.comments);
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    if (workerId) dispatch(getCommentsByWorkerId(workerId));
  }, [dispatch, workerId]);

  const filtered = useMemo(() => {
    return comments.filter(comment => {
      if (ratingFilter === 'all') return true;
      if (ratingFilter === '5') return comment.rating === 5;
      if (ratingFilter === '4+') return comment.rating >= 4;
      return true;
    });
  }, [comments, ratingFilter]);

  if (status === AUTH_STATUS.LOADING) return <p>Loading comments...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Worker Reviews</h2>

      <div className="mb-4 flex gap-2">
        {['all', '5', '4+'].map(val => (
          <button
            key={val}
            className={`btn btn-sm ${ratingFilter === val ? 'btn-neutral' : 'btn-outline'}`}
            onClick={() => setRatingFilter(val)}
          >
            {val === 'all' ? 'All' : `${val} ⭐`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No reviews to display.</p>
      ) : (
        <div className="grid gap-4">
          {filtered.map(comment => (
            <div key={comment.id} className="card bg-base-100 shadow-md p-4">
              <div className="flex items-center gap-2 mb-2">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`bi ${i < comment.rating ? 'bi-star-fill text-yellow-500' : 'bi-star'}`}
                  ></i>
                ))}
                <span className="text-sm text-gray-500 ml-auto">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p>{comment.text}</p>
              {comment.photos?.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {comment.photos.map((url, idx) => (
                    <img key={idx} src={url} alt="attached" className="w-24 h-24 object-cover rounded" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkerComments;
