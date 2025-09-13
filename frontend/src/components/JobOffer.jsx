import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { getOffersByJob, updateOfferStatus } from '../features/offers/offerThunk';
import { AUTH_STATUS } from '../features/auth/authConstants';
import WorkerInfo from '../components/WorkerInfo';
import MessageButton from './MessageButton';

const JobOffer = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { offers, status, error } = useSelector((s) => s.offers);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => {
    if (status === AUTH_STATUS.IDLE) {
      dispatch(getOffersByJob(jobId));
    }
  }, [status, dispatch, jobId]);

  const handleUpdateStatus = async (offerId, newStatus) => {
    try {
      await dispatch(updateOfferStatus({ id: offerId, status: newStatus })).unwrap();
      dispatch(getOffersByJob(jobId)); 
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update offer status");
    }
  };

  const handleGoToReview = (offerId, workerUserId) => {
    navigate(`/comments/new?offer=${offerId}&worker=${workerUserId}`);
  };

  if (status === AUTH_STATUS.LOADING) return <div>Loading offers…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (offers.length === 0) return <div>No offers yet.</div>;

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Offers for this Job</h2>

      {offers.map((offer) => (
        <div key={offer.id} className="border rounded p-4 shadow-sm mb-4">
          <p><strong>From:</strong> <WorkerInfo userId={offer.worker_user_id} /></p>

          {offer.price && (
            <p><strong>Worker's price:</strong> ${offer.price}</p>
          )}
          {offer.message && (
            <p><strong>Worker's comment:</strong> {offer.message}</p>
          )}

          {offer.status === 'pending' && (
            <div className="flex gap-2 mt-3">
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleUpdateStatus(offer.id, 'accepted')}
              >
                Accept
              </button>
              <button
                className="btn btn-sm btn-error"
                onClick={() => handleUpdateStatus(offer.id, 'rejected')}
              >
                Reject
              </button>
            </div>
          )}

          <div className="mt-3">
            <MessageButton
              workerUserId={offer.worker_user_id}
              myProfileId={user?.profile?.id}
            />
          </div>

          {offer.status === 'accepted' && (
            <div className="mt-3 flex gap-2">
              <button
                className="btn btn-sm btn-neutral"
                onClick={() => {
                  const confirmed = window.confirm('Mark this job as completed?');
                  if (confirmed) {
                    handleUpdateStatus(offer.id, 'completed');
                  }
                }}
              >
                Mark as Completed
              </button>
            </div>
          )}

          {offer.status === 'completed' && (
            <div className="mt-3 flex gap-2">
              <button
                className="btn btn-sm btn-neutral"
                onClick={() => handleGoToReview(offer.id, offer.worker_user_id)}
              >
                Leave Review
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default JobOffer;
