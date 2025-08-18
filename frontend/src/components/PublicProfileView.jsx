import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../app/axios'

const PublicProfileView = () => {
  const { id } = useParams()
  const [params] = useSearchParams()
  const jobId = params.get('job') // ← вытаскиваем из URL

  const [profile, setProfile] = useState(null)
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState("")

  const { user } = useSelector((state) => state.auth)
  const isWorker = user?.role === 'worker'

  useEffect(() => {
    api.get(`/profiles/by-user/${id}`)
      .then(({ data }) => {
        setProfile(data.profile)
        setUserData(data.user)
      })
      .catch(err => {
        console.error("API error:", err.response || err)
        setError("Failed to load profile")
      })
  }, [id])

  if (error) return <div className="text-red-500">{error}</div>
  if (!profile || !userData) return <div>Loading…</div>

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">{profile.display_name}</h1>
      <p className="text-gray-600"><strong>Role:</strong> {userData.role}</p>

      {profile.about && (
        <p className="text-gray-600 mt-2">{profile.about}</p>
      )}
      {profile.city && (
        <p className="text-gray-600 mt-2"><strong>City:</strong> {profile.city}</p>
      )}
      {profile.skills && (
        <p className="text-gray-600 mt-2"><strong>Skills:</strong> {profile.skills}</p>
      )}
      {profile.hourly_rate && (
        <p className="text-gray-600 mt-2"><strong>Hourly Rate:</strong> ${profile.hourly_rate}</p>
      )}
      {profile.avatar_url && (
        <img
          src={profile.avatar_url}
          alt="Avatar"
          className="w-32 h-32 rounded-full mt-4 object-cover"
        />
      )}

      {isWorker && jobId && (
        <div className="mt-4 flex gap-2">
          <Link
            to={`/offers/create?job=${jobId}`}
            className="btn btn-primary"
          >
            Make Offer
          </Link>
          <button
            className="btn btn-outline"
            onClick={() => alert("Send Message")}
          >
            Send Message
          </button>
        </div>
      )}
    </div>
  )
}

export default PublicProfileView
