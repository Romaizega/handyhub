import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../app/axios'

const OfferDetails = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const res = await api.get(`/offers/${id}`);
        setOffer(res.data.job);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch offer');
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id]);

  if (loading) return <div>Loading offer details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!offer) return null;

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Offer Details</h2>
      <p><strong>Job ID:</strong> {offer.job_id}</p>
      <p><strong>Price:</strong> ${offer.price}</p>
      <p><strong>Message:</strong> {offer.message}</p>
      <p><strong>Status:</strong> <span className="capitalize">{offer.status}</span></p>
    </div>
  );
};

export default OfferDetails;
