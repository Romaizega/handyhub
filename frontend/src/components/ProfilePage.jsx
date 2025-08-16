import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../features/profiles/profileThunk'
import ProfileView from './ProfileView'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { profile, status, error } = useSelector(s => s.profile)
  const role = useSelector(s => s.auth.user?.role)

  useEffect(() => {
    if (status === 'idle') dispatch(getProfile())
  }, [status, dispatch])

  useEffect(() => {
    if (error?.code === 404) navigate('/profile/create', { replace: true })
  }, [error, navigate])
  if (status === 'loading') {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }
  if (error && error.code !== 404) {
    return (
      <div className="max-w-lg mx-auto mt-6">
        <div className="alert alert-error"><span>{error.message || 'Server error'}</span></div>
      </div>
    )
  }
  if (!profile) return null
  return <ProfileView profile={profile} role={role || 'client'} />
}

export default ProfilePage