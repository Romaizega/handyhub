import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllOffers } from '../features/offers/offerThunk';
import { AUTH_STATUS } from '../features/auth/authConstants';
import { Link } from 'react-router-dom';

const MyOffers = () => {
  const dispatch = useDispatch();
  const { offers, status, error } = useSelector((state) => state.offers);

  useEffect(() => {
    if (status === AUTH_STATUS.IDLE) {
      dispatch(getAllOffers());
    }
  }, [status, dispatch]);

  if (status === AUTH_STATUS.LOADING) return <p>Loading your offers…</p>;

  if (error) return <p className="text-red-500">{error}</p>;

  if (!Array.isArray(offers) || offers.length === 0) {
    return <p>You have no offers yet</p>;
  }

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      <h2 className="text-xl font-semibold">My Offers</h2>
      {offers.map((offer) => (
        <div key={offer.id} className="border rounded p-4 shadow">
          <p>
            <strong>Job:</strong>{' '}
            <Link className="link" to={`/jobs/${offer.job_id}`}>
              View Job
            </Link>
          </p>
          <p>
            <strong>Status:</strong> {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
          </p>
          <p>
            <strong>Price:</strong> ${offer.price ?? '—'}
          </p>
          <p>
            <strong>Message:</strong> {offer.message || '—'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MyOffers;

