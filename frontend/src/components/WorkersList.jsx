import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../app/axios';

const WorkersList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/profiles/workers')
      .then(res => {
        setProfiles(res.data.profiles || []);
      })
      .catch(err => {
        console.error('Failed to load profiles', err);
        setError('Failed to load profiles');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="loading">Loading profiles…</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (profiles.length === 0) {
    return <div>No worker profiles found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-6 space-y-4">
      <h1 className="text-2xl font-bold">Worker Profiles</h1>
      {profiles.map(profile => (
        <div key={profile.id} className="border rounded p-4 shadow-sm hover:shadow transition flex justify-between items-center">
          <div>
            <p className="font-semibold text-lg">{profile.display_name || `Worker #${profile.id}`}</p>
            {profile.city && <p className="text-sm text-gray-600"><strong>City: </strong>{profile.city}</p>}
          </div>
           {profile.skills && (
        <p className="text-gray-600 mt-2"><strong>Skills:</strong> {profile.skills}</p>
      )}
          <Link to={`/public-profiles/${profile.user_id}`} className="btn btn-sm btn-outline">
            View Profile
          </Link>
        </div>
      ))}
    </div>
  );
};

export default WorkersList;
