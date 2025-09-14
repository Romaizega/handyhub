import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getCommentsByWorkerId } from '../features/comments/commentThunk';

const WorkerRating = ({ workerId, onAverageRating }) => {
  const dispatch = useDispatch();

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

  return null;
};

export default WorkerRating;