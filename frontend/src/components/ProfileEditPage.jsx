import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, getProfile } from '../features/profiles/profileThunk';
import { useNavigate } from 'react-router-dom';
import api from '../app/axios';

const MAX_MB = 3;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

const ProfileEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, status } = useSelector((s) => s.profile);
  const [availableSkills, setAvailableSkills ] = useState([])
  const [selectedSkills, setSelectedSkills] = useState([])

  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    display_name: '',
    city: '',
    about: '',
    avatar_url: '',
    hourly_rate: '',
  });

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const isWorker = user?.role === 'worker';


  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || '',
        city: profile.city || '',
        about: profile.about || '',
        avatar_url: profile.avatar_url || '',
        hourly_rate: profile.hourly_rate ?? '',
      });
        const existing = profile.skills
      ? profile.skills.split(',').map(s => s.trim())
      : []
    setSelectedSkills(existing)
    }
  }, [profile]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const triggerPickFile = () => fileInputRef.current?.click();

  const handleFilePicked = (e) => {
    setLocalError('');
    const f = e.target.files?.[0];
    if (!f) return;

    if (!ALLOWED.includes(f.type)) {
      setLocalError('Please choose JPEG/PNG/WEBP image.');
      setFile(null);
      setFileName('');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setLocalError(`Image must be ≤ ${MAX_MB}MB.`);
      setFile(null);
      setFileName('');
      return;
    }

    setFile(f);
    setFileName(f.name);
  };

  const clearFile = () => {
    setFile(null);
    setFileName('');
    setLocalError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');       
    setSubmitting(true);            

    const skillsStr = selectedSkills.join(', ')
    const hourly = form.hourly_rate === '' ? null : Number(form.hourly_rate);

    try {
      if (file) {
        const fd = new FormData();
        fd.append('display_name', form.display_name.trim());
        fd.append('city', form.city.trim());
        fd.append('about', form.about.trim());
        if (form.avatar_url.trim()) fd.append('avatar_url', form.avatar_url.trim());
        fd.append('skills', skillsStr);
        if (hourly !== null) fd.append('hourly_rate', String(hourly));
        fd.append('avatar', file);

        await api.patch('/profiles/update', fd);
        await dispatch(getProfile());
      } else {
        const payload = {
          display_name: form.display_name.trim(),
          city: form.city.trim(),
          about: form.about.trim(),
          avatar_url: form.avatar_url.trim(),
          skills: skillsStr,
          hourly_rate: hourly,
        };
        await dispatch(updateProfile(payload)).unwrap();
      }

      navigate('/profile', { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update profile';
      setLocalError(msg);

      console.error('updateProfile failed:', err?.response?.data || err);
    } finally {
      setSubmitting(false);       
    }
  };
    
  useEffect(() => {
    api.get('/skills').then(res => setAvailableSkills (res.data.skills))
  }, [])


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

            {/* Avatar URL + Upload photo */}
            <input
              name="avatar_url"
              value={form.avatar_url}
              onChange={handleChange}
              placeholder="Avatar URL"
              className="input input-bordered w-full"
            />
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFilePicked}
              />
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={triggerPickFile}
              >
                Upload photo
              </button>
              {fileName && (
                <>
                  <span className="text-sm text-base-content/70 truncate max-w-[220px]">
                    {fileName}
                  </span>
                  {file && (
                  <div className="mt-3">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="h-32 w-32 rounded-full object-cover ring-2 ring-base-300"
                    />
                  </div>
                  )}
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={clearFile}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
                {isWorker && (
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border rounded p-2">
                {availableSkills.map((skill) => (
                  <label key={skill.id} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedSkills.includes(skill.name)}
                      onChange={() => {
                        setSelectedSkills(prev =>
                          prev.includes(skill.name)
                            ? prev.filter(s => s !== skill.name)
                            : [...prev, skill.name]
                        )
                      }}
                    />
                    {skill.name}
                  </label>
                  ))}
                </div>
                )}

            {localError && (
              <p className="text-red-500 text-sm">{localError}</p>
            )}

           {isWorker && (
            <>
          
            <input
              type="number"
              name="hourly_rate"
              value={form.hourly_rate}
              onChange={(e) => {
                const v = e.target.value;
                setForm((p) => ({ ...p, hourly_rate: v === '' ? '' : Math.max(0, Number(v)) }));
              }}
              placeholder="Hourly rate"
              className="input input-bordered w-full"
              />
             </>
             )}

            <button
              type="submit"
              className="btn btn-neutral w-full"
              disabled={status === 'loading' || submitting}
            >
              {status === 'loading' || submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
