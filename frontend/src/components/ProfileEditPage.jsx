import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/profiles/profileThunk';
import { useNavigate } from 'react-router-dom';

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, status, error } = useSelector((s) => s.profile);

  const [form, setForm] = useState({
    display_name: '',
    city: '',
    about: '',
    avatar_url: '',
    skills: '',
    hourly_rate: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || '',
        city: profile.city || '',
        about: profile.about || '',
        avatar_url: profile.avatar_url || '',
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(', ')
          : profile.skills || '',
        hourly_rate: profile.hourly_rate ?? '',
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      display_name: form.display_name.trim(),
      city: form.city.trim(),
      about: form.about.trim(),
      avatar_url: form.avatar_url.trim(),
      skills: form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      hourly_rate: form.hourly_rate === '' ? null : Number(form.hourly_rate),
    };

    dispatch(updateProfile(payload))
      .unwrap()
      .then(() => navigate('/profile', { replace: true }))
      .catch((error) => {
        console.error('updateProfile failed:', error);
      });
  };

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="display_name"
              value={form.display_name}
              onChange={handleChange}
              placeholder="Display name"
              className="input input-bordered w-full"
            />
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="input input-bordered w-full"
            />
            <textarea
              name="about"
              value={form.about}
              onChange={handleChange}
              placeholder="About"
              className="textarea textarea-bordered w-full"
            />
            <input
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="Avatar URL"
              className="input input-bordered w-full"
            />
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="Skills (comma separated)"
              className="input input-bordered w-full"
            />
            <input
              type="number"
              name="hourly_rate"
              value={form.hourly_rate}
              onChange={handleChange}
              placeholder="Hourly rate"
              className="input input-bordered w-full"
            />

            {error && <p className="text-red-500">{String(error)}</p>}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
