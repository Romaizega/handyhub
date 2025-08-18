import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../app/axios';

const WorkerInfo = ({ userId }) => {
  const [name, setName] = useState(null);

  useEffect(() => {
    if (!userId) return;

    api.get(`/profiles/by-user/${userId}`)
      .then(res => {
        const profile = res.data.profile;
        setName(profile?.display_name || `Worker ${userId}`);
      })
      .catch(err => {
        console.error("Failed to load worker info:", err);
        setName(`Worker ${userId}`);
      });
  }, [userId]);

  if (!userId) return <span className="text-red-500">Invalid user</span>;

  return (
    <Link to={`/public-profiles/${userId}`} className="text-blue-600 underline">
      {name ?? 'Loading...'}
    </Link>
  );
};

export default WorkerInfo