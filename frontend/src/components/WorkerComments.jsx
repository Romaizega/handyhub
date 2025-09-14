import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCommentsByWorkerId } from '../features/comments/commentThunk';
import { AUTH_STATUS } from '../features/auth/authConstants';

const WorkerComments = ({ workerId, onAverageRating }) => {
  const dispatch = useDispatch();
  const { comments, status, error } = useSelector(state => state.comments);
  const [ratingFilter, setRatingFilter] = useState('all');

  useEffect(() => {
    if (workerId) {
      dispatch(getCommentsByWorkerId(workerId)).then((action) => {
        const data = action.payload;
        if (Array.isArray(data) && data.length > 0 && typeof onAverageRating === 'function') {
          const avg = (
            data.reduce((sum, c) => sum + c.rating, 0) / data.length
          ).toFixed(1);
          onAverageRating(avg);
        } else {
          onAverageRating(null);
        }
      });
    }
  }, [dispatch, workerId, onAverageRating]);

  const filtered = useMemo(() => {
    if (ratingFilter === 'all') return comments;
    const rating = Number(ratingFilter);
    return comments.filter(comment => comment.rating === rating);
  }, [comments, ratingFilter]);

  if (status === AUTH_STATUS.LOADING) return <p>Loading comments...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Worker Reviews</h2>

      <div className="mb-4 flex gap-2">
        {['all', '5', '4', '3', '2', '1'].map(val => (
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
            <div key={comment.id} className="bg-white p-4 rounded shadow-sm border">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <i
                      key={i}
                      className={`bi ${i <= comment.rating ? 'bi-star-fill text-yellow-500' : 'bi-star text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString('en-GB')}
                </span>
              </div>

              <p className="text-gray-800 mb-3">{comment.text}</p>

              {comment.photos?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {comment.photos.map((url, idx) => (
                    <a key={idx} href={url} target="_blank" rel="noreferrer">
                      <img
                        src={url}
                        alt={`Comment attachment ${idx + 1}`}
                        className="w-24 h-24 object-cover rounded border"
                      />
                    </a>
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
