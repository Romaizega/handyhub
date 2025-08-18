import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { createOffer } from '../features/offers/offerThunk'
import api from '../app/axios'

const OfferCreate = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const jobId = params.get('job')

  const [job, setJob] = useState(null)
  const [price, setPrice] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${jobId}`)
        setJob(data.job)
      } catch (error) {
        setError('Failed to load job', error)
      }
    }
    if (jobId) loadJob()
  }, [jobId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await dispatch(
        createOffer({
          job_id: jobId,
          price,
          message
        })
      ).unwrap()
      navigate(`/jobs/${jobId}`, { replace: true })
    } catch (err) {
      setError(err?.message || 'Failed to submit offer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto mt-8">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="text-2xl font-bold mb-2">Submit Your Offer</h1>
          <p className="mb-4 text-gray-600">
            You are making an offer for job:&nbsp;
            <Link
              to={`/jobs/${jobId}`}
              className="link link-primary font-semibold"
            >
              {job?.title || `Job #${jobId}`}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="Price (USD)"
              className="input input-bordered w-full"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
            <textarea
              placeholder="Write your message to the client…"
              className="textarea textarea-bordered w-full min-h-32"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {error && <div className="alert alert-error">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Submitting…' : 'Submit Offer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OfferCreate
