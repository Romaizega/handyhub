import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { updateJob, getMyJobs, deleteJob } from "../features/jobs/jobThunk"
import api from "../app/axios"

const MAX_MB = 3
const ALLOWED = ["image/jpeg", "image/png", "image/webp"]

const JobEdit = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState("")
  const [due_date, setDueDate] = useState("")
  const [existingPhotos, setExistingPhotos] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`)
        const job = data.job
        setTitle(job.title)
        setDescription(job.description)
        setBudget(job.budget)
        setDueDate(job.due_date?.slice(0, 10))
        setExistingPhotos(job.photos || [])
      } catch (err) {
        console.error("Failed to fetch job", err)
        setError("Could not load job data")
      }
    }
    fetchJob()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await dispatch(deleteJob({ id })).unwrap();
      dispatch(getMyJobs());
      navigate('/my-jobs');
    } catch (err) {
      console.error("Delete failed", err);
      setError(typeof err === "string" ? err : err?.message || "Failed to delete job");
    }
  }

  const handleFilesPicked = (e) => {
    const picked = Array.from(e.target.files || [])
    const fresh = []
    const freshPreviews = []
    for (const f of picked) {
      if (!ALLOWED.includes(f.type)) {
        setError("Only JPEG/PNG/WEBP images are allowed.")
        continue
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`Each image must be ≤ ${MAX_MB}MB.`)
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
    setNewFiles((prev) => [...prev, ...fresh])
    setPreviews((prev) => [...prev, ...freshPreviews])
  }

  const removeNewImage = (idx) => {
    const p = previews[idx]
    if (p?.url) URL.revokeObjectURL(p.url)
    setPreviews((prev) => prev.filter((_, i) => i !== idx))
    setNewFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const removeExistingPhoto = (idx) => {
    setExistingPhotos((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    try {
      await dispatch(updateJob({
        id,
        title,
        description,
        photos: newFiles,
        existingPhotos,
        budget,
        due_date
      })).unwrap()

      dispatch(getMyJobs())
      navigate("/my-jobs")
    } catch (err) {
      console.error("Update failed", err)
      setError(typeof err === "string" ? err : err?.message || "Failed to update job")
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-2">Edit job</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="textarea textarea-bordered w-full min-h-32"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="number"
                className="input input-bordered w-full"
                placeholder="Budget"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <input
                type="date"
                className="input input-bordered w-full"
                value={due_date}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {/* Existing photos */}
            {existingPhotos.length > 0 && (
              <div>
                <p className="mb-1 text-sm font-semibold">Existing photos:</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingPhotos.map((photo, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={photo}
                        className="w-full h-24 object-cover rounded"
                        alt="existing"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingPhoto(idx)}
                        className="btn btn-error btn-sm absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New uploads */}
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
                  onClick={() => fileInputRef.current?.click()}
                >
                  Add new photos
                </button>
              </div>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {previews.map((p, idx) => (
                    <div key={p.url} className="relative group">
                      <img
                        src={p.url}
                        className="w-full h-24 object-cover rounded"
                        alt="preview"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="btn btn-error btn-sm absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-neutral w-full">
              Save changes
            </button>
            <button
              type="button"
              className="btn btn-error w-full"
              onClick={handleDelete}
            >
              Delete job
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}


export default JobEdit