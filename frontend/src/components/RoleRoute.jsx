import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function RoleRoute({ allowed = [], children }) {
  const { user } = useSelector(state => state.auth)

  if (!user) return <Navigate to="/login" replace />

  if (allowed.length && !allowed.includes(user.role)) {
    return <Navigate to="/" replace /> 
  }

  return children
}
