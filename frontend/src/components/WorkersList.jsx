import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../app/axios';

const WorkersList = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [cities, setCities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const { user } = useSelector((state) => state.auth); 

  useEffect(() => {
    api.get('/profiles/workers')
      .then(res => {
        const fetchedProfiles = res.data.profiles || [];
        setProfiles(fetchedProfiles);

        const uniqueCities = [...new Set(fetchedProfiles.map(p => p.city).filter(Boolean))];
        const uniqueSkills = [
          ...new Set(
            fetchedProfiles
              .flatMap(p => p.skills ? p.skills.split(',').map(s => s.trim()) : [])
              .filter(Boolean)
          )
        ];

        setCities(uniqueCities);
        setSkills(uniqueSkills);
      })
      .catch(err => {
        console.error('Failed to load profiles', err);
        setError('Failed to load profiles');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...profiles];

    if (selectedCity) {
      filtered = filtered.filter(p => p.city === selectedCity);
    }

    if (selectedSkill) {
      filtered = filtered.filter(p =>
        p.skills?.toLowerCase().includes(selectedSkill.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
  }, [profiles, selectedCity, selectedSkill]);

  if (loading) return <div className="loading">Loading profiles…</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (profiles.length === 0) return <div>No worker profiles found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Worker Profiles</h1>

      {/* ФИЛЬТРЫ */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          value={selectedSkill}
          onChange={(e) => setSelectedSkill(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Skills</option>
          {skills.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

      {/* КАРТОЧКИ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map(profile => (
          <div
            key={profile.id}
            className="bg-white border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col justify-between"
          >
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">
                {profile.display_name || `Worker #${profile.id}`}
              </h2>

              {/* Рейтинг */}
              <div className="flex items-center text-yellow-500 text-sm mb-2">
                <span className="mr-1">⭐ 4.7</span>
                <span className="text-gray-500 ml-1">(23 reviews)</span>
              </div>

              {profile.city && (
                <p className="text-sm text-gray-500">
                  <strong>City:</strong> {profile.city}
                </p>
              )}
              {profile.skills && (
                <p className="text-sm text-gray-500 mt-1">
                  <strong>Skills:</strong> {profile.skills}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Link
                to={`/public-profiles/${profile.user_id}`}
                className="btn btn-sm btn-outline w-1/2"
              >
                View
              </Link>

              {user && (
                <Link
                  to={`/messages/${profile.id}`}
                  className="btn btn-sm btn-neutral w-1/2"
                >
                  Chat
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkersList;
