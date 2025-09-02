import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../app/axios';
import MessageButton from './MessageButton';
import WorkerComments from './WorkerComments';

const PublicProfileView = () => {
  const { id } = useParams();
  const [params] = useSearchParams();
  const jobId = params.get('job');

  const [profile, setProfile] = useState(null);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [showFullAbout, setShowFullAbout] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const myProfileId = user?.profile?.id;
  const isWorker = user?.role === 'worker';

  useEffect(() => {
    api.get(`/profiles/by-user/${id}`)
      .then(({ data }) => {
        setProfile(data.profile);
        setUserData(data.user);
      })
      .catch(err => {
        console.error('API error:', err.response || err);
        setError('Failed to load profile');
      });
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!profile || !userData) return <div>Loading…</div>;

  const isSelfProfile = !!myProfileId && profile.id === myProfileId;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-64 h-64 rounded-full object-cover border"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-white">
            {profile.display_name?.[0] || '?'}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">{profile.display_name}</h1>
          <p className="text-sm text-gray-500 mb-4 capitalize">{userData.role}</p>

          <div className="space-y-1 text-sm text-gray-700">
            {profile.city && (
              <p><span className="font-medium">City:</span> {profile.city}</p>
            )}
            {profile.skills && (
              <p><span className="font-medium">Skills:</span> {profile.skills}</p>
            )}
            {profile.hourly_rate && (
              <p><span className="font-medium">Hourly Rate:</span> ${profile.hourly_rate}</p>
            )}
            <p><span className="font-medium">Rating:</span> ★★★★☆</p>
            <p className="text-sm text-gray-700">
              {/* <span className="font-medium">Reviews:</span>{' '} */}
              <Link to={`/public-profiles/${profile.user_id}/comments`} className="text-blue-600 hover:underline">
                View all reviews
              </Link>
            </p>
            {profile.about && (
              <div>
                <p className={`text-sm text-gray-700 ${!showFullAbout ? 'line-clamp-3' : ''}`}>
                  <span className="font-medium">About:</span> {profile.about}
                </p>
                {profile.about.length > 100 && (
                  <button
                    onClick={() => setShowFullAbout(prev => !prev)}
                    className="text-blue-600 text-sm mt-1 hover:underline"
                  >
                    {showFullAbout ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}

          </div>

          <div className="mt-4 flex gap-2">
            {isWorker && jobId && (
              <Link to={`/offers/create?job=${jobId}`} className="btn btn-sm btn-neutral">
                Make Offer
              </Link>
            )}

            {user && !isSelfProfile && (
              <MessageButton
                profileId={profile.id}
                myProfileId={myProfileId}
              />
            )}
          </div>
        </div>
      </div>

      {/* COMPLETED JOBS (GALLERY) */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Completed Works</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div
              key={num}
              className="rounded-lg overflow-hidden border shadow-sm bg-white hover:shadow-md transition"
            >
              <img
                src={`https://placehold.co/600x400?text=Work+${num}`}
                alt={`Work ${num}`}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 text-sm text-gray-700">
                <h3 className="font-semibold mb-1">Job Example {num}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicProfileView;
