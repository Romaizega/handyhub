import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../app/axios'

const JobDetails = () => {
  const { id } = useParams()
  const [job, setJob] = useState(null)
  const [error, setError] = useState("")  
  
  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`)
        setJob(data.job)
      } catch (error) {
        setError("Failed to load job details", error)
      }
    }
    fetch()
  }, [id])
  
  if (error) return <div className="text-red-500">{error}</div>
  if (!job) return <div>Loading…</div>
  
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
      <p className="text-gray-700 mb-2">{job.description}</p>
      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p><strong>Status:</strong> {job.status}</p>
        <p><strong>Budget:</strong> ${job.budget}</p>
        <p><strong>Due:</strong> {new Date(job.due_date).toLocaleDateString()}</p>
        <p><strong>Created:</strong> {new Date(job.created_at).toLocaleDateString()}</p>
      </div>
      {job.photos?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {job.photos.map((url, idx) => (
            <img
            key={idx}
            src={url}
            alt={`photo-${idx}`}
            className="w-full h-32 object-cover rounded shadow"
            />
          ))}
        </div>
      )}
      <Link
        to={`/public-profiles/${job.client_user_id}`}
        className="btn btn-sm btn-outline mt-4"
      >
        View Client Profile
      </Link>
    </div>
  )
}

export default JobDetails