import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import {
  updateEmail,
  updatePassword,
  deleteAccount,
} from "../features/auth/authThunk"
import { clearAuth } from "../features/auth/authSlice"

const Settings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, status, error, message } = useSelector(state => state.auth)

  const [email, setEmail] = useState("")
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" })
  const [localError, setLocalError] = useState("")
  const [localMessage, setLocalMessage] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (message) {
      setLocalMessage(message)
      const timeout = setTimeout(() => dispatch(clearAuth()), 5000)
      return () => clearTimeout(timeout)
    }
  }, [message, dispatch])

  const handleEmailUpdate = async (e) => {
    e.preventDefault()
    if (!email) {
      setLocalError("Please provide a new email.")
      return
    }
    setLocalError("")
    await dispatch(updateEmail(email))
  }

  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setLocalError("Fill in all password fields")
      return
    }
    if (passwords.new !== passwords.confirm) {
      setLocalError("New passwords do not match")
      return
    }
    setLocalError("")
    await dispatch(updatePassword({ currentPassword: passwords.current, newPassword: passwords.new }))
  }

  const handleAccountDeletion = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone")) return
    await dispatch(deleteAccount())
    navigate("/", { replace: true })
  }

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />
  // }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Account Settings</h1>

      {(localError || error) && (
        <div className="alert alert-error">{localError || error}</div>
      )}

      {localMessage && <div className="alert alert-success">{localMessage}</div>}

      {/* Change Email */}
      <form onSubmit={handleEmailUpdate} className="space-y-2">
        <h2 className="font-semibold">Change Email</h2>
        <input
          type="email"
          placeholder={user?.email || "New email"}
          className="input input-bordered w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-neutral-content w-full" disabled={status === "loading"}>
          {status === "loading" ? "Updating..." : "Update Email"}
        </button>
      </form>

      {/* Change Password */}
      <form onSubmit={handlePasswordUpdate} className="space-y-2">
        <h2 className="font-semibold">Change Password</h2>

        {/* Current password */}
        <div className="relative">
          <input
            type={showCurrent ? "text" : "password"}
            placeholder="Current password"
            className="input input-bordered w-full pr-20"
            value={passwords.current}
            onChange={(e) =>
              setPasswords({ ...passwords, current: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
            onClick={() => setShowCurrent((p) => !p)}
          >
            {showCurrent ? "Hide" : "Show"}
          </button>
        </div>

        {/* New password */}
        <div className="relative">
          <input
            type={showNew ? "text" : "password"}
            placeholder="New password"
            className="input input-bordered w-full pr-20"
            value={passwords.new}
            onChange={(e) =>
              setPasswords({ ...passwords, new: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
            onClick={() => setShowNew((p) => !p)}
          >
            {showNew ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm new password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            className="input input-bordered w-full pr-20"
            value={passwords.confirm}
            onChange={(e) =>
              setPasswords({ ...passwords, confirm: e.target.value })
            }
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
            onClick={() => setShowConfirm((p) => !p)}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        <button
          className="btn btn-neutral-content w-full"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Updating..." : "Change Password"}
        </button>
      </form>


      {/* Delete Account */}
      <div className="border-t pt-4">
        <button className="btn btn-info-content w-full" onClick={handleAccountDeletion}>
          Delete Account
        </button>
      </div>
    </div>
  )
}

export default Settings
