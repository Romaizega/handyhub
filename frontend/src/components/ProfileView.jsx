import { Link } from 'react-router-dom';
import { MapPinIcon, BanknotesIcon } from '@heroicons/react/24/outline';
// console.log("Profileview");

const placeholder =
  'https://api.dicebear.com/8.x/thumbs/svg?seed=handyhub&radius=50';

const ProfileView = ({ profile = {}, role = 'client' }) => {
  const isWorker = role === 'worker';

  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : String(profile.skills || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const displayName = profile.display_name || '—';
  const city = profile.city || '—';
  const about = profile.about || '—';

  const hourlyRate =
    profile.hourly_rate != null && profile.hourly_rate !== ''
      ? `$${Number(profile.hourly_rate).toLocaleString()}/hr`
      : '—';

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body gap-6 p-6">
          {/* header */}
          <div className="flex items-center gap-4">
            <img
              src={profile.avatar_url || placeholder}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover ring-1 ring-base-300"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold truncate">{displayName}</h1>
                <span className="badge badge-neutral capitalize">{role}</span>
              </div>

              <div className="mt-1 flex items-center gap-1 text-sm text-base-content/60">
                <MapPinIcon className="w-4 h-4" />
                <span className="truncate">{city}</span>
              </div>
            </div>
          </div>

          <div className="divider my-0" />

          {!isWorker && (
            <div className="flex justify-end">
              <Link to="/profile/edit" className="btn btn-outline btn-sm">
                Edit
              </Link>
            </div>
          )}

          {/* about */}
          <div>
            <p className="whitespace-pre-wrap leading-relaxed text-base">
              {about}
            </p>
          </div>

          {/* worker extra */}
          {isWorker && (
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-base-content/60 mb-2">Skills</p>
                {skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((t, i) => (
                      <span key={i} className="badge badge-outline">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-base-content/60">—</span>
                )}
              </div>

              <Link to="/profile/edit" className="btn btn-outline">
                Edit
              </Link>

              <div>
                <p className="text-sm text-base-content/60 mb-2">Hourly rate</p>
                <div className="inline-flex items-center gap-2 font-medium">
                  <BanknotesIcon className="w-5 h-5 text-base-content/70" />
                  <span>{hourlyRate}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
