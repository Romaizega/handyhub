import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNewProfile, getProfile } from '../features/profiles/profileThunk'
import { useNavigate } from 'react-router-dom'
import api from '../app/axios'

const MAX_MB = 3
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']

const normalizeSkills = (raw) => {
  if (!raw) return ''
  const tokens = String(raw)
    .split(/[,\n;|/\\\s]+/g)
    .map((t) => t.trim())
    .filter(Boolean)

  const seen = new Set()
  const result = []
  for (const t of tokens) {
    const key = t.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      result.push(t)
    }
  }
  return result.join(', ')
}

const ProfileCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.profile)

  const fileInputRef = useRef(null)

  const [display_name, setDisplayName] = useState('')
  const [city, setCity] = useState('')
  const [about, setAbout] = useState('')
  const [avatar_url, setAvatarUrl] = useState('')
  const [skills, setSkills] = useState('')
  const [hourly_rate, setHourlyRate] = useState('')

  const [file, setFile] = useState(null)
  const [fileName, setFileName] = useState('')
  const [preview, setPreview] = useState('')
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const triggerPickFile = () => fileInputRef.current?.click()

  const handleFilePicked = (e) => {
    setLocalError('')
    const f = e.target.files?.[0]
    if (!f) return

    if (!ALLOWED.includes(f.type)) {
      setLocalError('Please choose JPEG/PNG/WEBP image.')
      clearFile()
      return
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setLocalError(`Image must be ≤ ${MAX_MB}MB.`)
      clearFile()
      return
    }

    setFile(f)
    setFileName(f.name)
    setPreview(URL.createObjectURL(f))
  }

  const clearFile = () => {
    setFile(null)
    setFileName('')
    if (preview) URL.revokeObjectURL(preview)
    setPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSubmitting(true)

    const skillsStr = normalizeSkills(skills)
    const hourly = hourly_rate === '' ? null : Number(hourly_rate)

    try {
      if (file) {
        const fd = new FormData()
        fd.append('display_name', display_name.trim())
        fd.append('city', city.trim())
        fd.append('about', about.trim())
        if (avatar_url.trim()) fd.append('avatar_url', avatar_url.trim()) 
        if (skillsStr) fd.append('skills', skillsStr)
        if (hourly !== null) fd.append('hourly_rate', String(hourly))
        fd.append('avatar', file) 

        await api.post('/profiles/create', fd)  
        await dispatch(getProfile())
      } else {
        
        await dispatch(
          createNewProfile({
            display_name: display_name.trim(),
            city: city.trim(),
            about: about.trim(),
            avatar_url: avatar_url.trim(),
            skills: skillsStr,
            hourly_rate: hourly,
          })
        ).unwrap()
      }

      navigate('/profile', { replace: true })
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create profile'
      setLocalError(msg)
      console.error('createProfile failed:', err?.response?.data || err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-xl font-bold mb-4">Create your profile</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Display name"
              className="input input-bordered w-full"
              value={display_name}
              onChange={(e) => setDisplayName(e.target.value)}
            />

            <input
              type="text"
              placeholder="City"
              className="input input-bordered w-full"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <textarea
              placeholder="About"
              className="textarea textarea-bordered w-full"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />

            {/* URL + Upload */}
            <input
              type="text"
              placeholder="Avatar URL (optional)"
              className="input input-bordered w-full"
              value={avatar_url}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />

            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFilePicked}
              />
              <button type="button" className="btn btn-ghost btn-sm" onClick={triggerPickFile}>
                Upload photo
              </button>
              {fileName && (
                <>
                  <span className="text-sm text-base-content/70 truncate max-w-[220px]">
                    {fileName}
                  </span>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={clearFile}>
                    Remove
                  </button>
                </>
              )}
            </div>

            {preview && (
              <div className="mt-2">
                <img
                  src={preview}
                  alt="preview"
                  className="h-64 w-64 rounded-full object-cover ring-1 ring-base-300"
                />
              </div>
            )}чч

            {(localError || error) && (
              <p className="text-red-500 text-sm">
                {localError || error?.message || String(error)}
              </p>
            )}

            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="input input-bordered w-full"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              onBlur={(e) => setSkills(normalizeSkills(e.target.value))}
            />

            <input
              type="number"
              placeholder="Hourly rate"
              className="input input-bordered w-full"
              value={hourly_rate}
              onChange={(e) => {
                const v = e.target.value
                setHourlyRate(v === '' ? '' : Math.max(0, Number(v)))
              }}
            />

            <button
              type="submit"
              className="btn btn-neutral w-full"
              disabled={status === 'loading' || submitting}
            >
              {status === 'loading' || submitting ? 'Saving...' : 'Create Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileCreate
