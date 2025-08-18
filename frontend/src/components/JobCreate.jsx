import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createJob, getMyJobs } from '../features/jobs/jobThunk'
import { AUTH_STATUS } from '../features/auth/authConstants'

const MAX_MB = 3
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp']
const JobCreate = () =>  {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.jobs)
  // form
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [due_date, setDueDate] = useState('') 
  // uploads
  const fileInputRef = useRef(null)
  const [files, setFiles] = useState([])           
  const [previews, setPreviews] = useState([])  
  const [localError, setLocalError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const triggerPickFiles = () => fileInputRef.current?.click()
  const handleFilesPicked = (e) => {
    setLocalError('')
    const picked = Array.from(e.target.files || [])
    if (!picked.length) return
    const fresh = []
    const freshPreviews = []
    for (const f of picked) {
      if (!ALLOWED.includes(f.type)) {
        setLocalError('Only JPEG/PNG/WEBP images are allowed.')
        continue
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setLocalError(`Each image must be ≤ ${MAX_MB}MB.`)
        continue
      }
      fresh.push(f)
      freshPreviews.push({
        name: f.name,
        url: URL.createObjectURL(f),
        type: f.type,
        size: f.size,
      })
    }
    setFiles(prev => [...prev, ...fresh])
    setPreviews(prev => [...prev, ...freshPreviews])
  }
  const removeImage = (idx) => {
    // revoke URL and drop from arrays
    const p = previews[idx]
    if (p?.url) URL.revokeObjectURL(p.url)
    setPreviews(prev => prev.filter((_, i) => i !== idx))
    setFiles(prev => prev.filter((_, i) => i !== idx))
  }
  const clearAllImages = () => {
    previews.forEach(p => p.url && URL.revokeObjectURL(p.url))
    setPreviews([])
    setFiles([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
   const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setSubmitting(true)
    try {
      await dispatch(
        createJob({
          title,
          description,
          photos: files,    
          budget,          
          due_date,         
        })
      ).unwrap()

      dispatch(getMyJobs())
      navigate('/my-jobs', { replace: true })
    } catch (error) {
      const msg = error || 'Failed to create job'
      setLocalError(typeof msg === 'string' ? msg : (msg?.message || 'Failed to create job'))
      console.error('JobCreate create failed:', error)
    } finally {
      setSubmitting(false)
    }
  }
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-2">Create a job</h1>
          <p className="text-base-content/70 mb-4">
            Describe your task and optionally attach photos
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Title (e.g. Fix leaking sink)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="textarea textarea-bordered w-full min-h-32"
              placeholder="Describe what you need…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Budget (USD)"
                value={budget}
                onChange={(e) => {
                  const v = e.target.value
                  setBudget(v === '' ? '' : Math.max(0, Number(v)))
                }}
              />
              <input
                type="date"
                className="input input-bordered w-full"
                value={due_date}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            {/* upload */}
            <div>
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  multiple
                  onChange={handleFilesPicked}
                />
                <button
                  type="button"
                  className="btn btn-neutral btn-sm"
                  onClick={triggerPickFiles}
                >
                  Upload photos
                </button>
                {previews.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-neutral btn-sm"
                    onClick={clearAllImages}
                  >
                    Clear all
                  </button>
                )}
              </div>
              {/* previews */}
              {previews.length > 0 && (
                <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {previews.map((p, idx) => (
                    <div key={p.url} className="relative group">
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full h-28 object-cover rounded-md ring-1 ring-base-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="btn btn-neutral btn-error absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(localError || error) && (
              <div className="alert alert-error">
                <span>{localError || (typeof error === 'string' ? error : error?.message) || 'Error'}</span>
              </div>
            )}
            <button
              type="submit"
              className="btn btn-neutral w-full"
              disabled={status === AUTH_STATUS.LOADING || submitting}
            >
              {status === AUTH_STATUS.LOADING || submitting ? 'Creating…' : 'Create job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default JobCreate