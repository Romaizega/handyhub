import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getOffersByJob } from '../features/offers/offerThunk';
import { AUTH_STATUS } from '../features/auth/authConstants';
import { Link } from 'react-router-dom'
import WorkerInfo from '../components/WorkerInfo'



const JobOffer = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const { offers, status, error } = useSelector((s) => s.offers);

  useEffect(() => {
    if (status === AUTH_STATUS.IDLE) {
      dispatch(getOffersByJob(jobId));
    }
  }, [status, dispatch, jobId]);

  if (status === AUTH_STATUS.LOADING) return <div>Loading offers…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (offers.length === 0) return <div>No offers yet.</div>;

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Offers for this Job</h2>
      {offers.map((offer) => (
  <div
    key={offer.id}
    className="border rounded p-4 shadow-sm mb-4"
  >
    <p>
      <strong>From:</strong>{" "}
    <WorkerInfo userId={offer.worker_user_id} />
    </p>
    {offer.price && <p><strong>Price:</strong> ${offer.price}</p>}
    {offer.message && <p><strong>Message:</strong> {offer.message}</p>}

    <div className="flex gap-2 mt-3">
      <button
        className="btn btn-sm btn-success"
        onClick={() => alert("Offer accepted!")} // TODO: подключить API
      >
        Accept
      </button>

      <button
        className="btn btn-sm btn-error"
        onClick={() => alert("Offer rejected!")} // TODO: подключить API
      >
        Reject
      </button>

      <button
        className="btn btn-sm btn-outline"
        onClick={() => alert("Chat coming soon…")}
      >
        Message
      </button>
    </div>
  </div>
))}

    </div>
  );
};

export default JobOffer
