import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AUTH_STATUS } from '../features/auth/authConstants'
import { getProfile } from '../features/profiles/profileThunk'
import ProfileView from './ProfileView'
import ProfileCreate from './ProfileCreate'


const MyProfile = () => {
  const dispatch = useDispatch()
  const { profile, status, error, notFound } = useSelector(s => s.profile)
  const { user } = useSelector(s => s.auth)
  useEffect(() => {
    if (status === AUTH_STATUS.IDLE) dispatch(getProfile())
  }, [dispatch, status])
  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    )
  }
  if (error && !notFound) {
    return <div className="alert alert-error max-w-lg mx-auto mt-6">{String(error)}</div>
  }
  if (notFound || !profile) {
    return <ProfileCreate role={user?.role} />
  }
  return <ProfileView profile={profile} role={user?.role} />
}

export default MyProfile