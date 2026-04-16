import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { verifyEmail, loginUser } from "../features/auth/authThunk"
import {  useState } from "react"

const VerifyEmail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {staus, error} = useSelector((stat) => stat.auth)
  const [localError, setLocalError] = useState(null)
  const [showCode, setShowCode] = useState(false)
  const location = useLocation()
  const email = location.state?.email
  const username = location.state?.username
  const password = location.state?.password


  const [code, setCode] = useState('')

  const loading = staus === "loading"


  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError(null)

    if(code.trim().length !== 6) {
      setLocalError("Verification code must be only 6 digits")
      return
    }
    try {
      await dispatch(verifyEmail({ email, code: code.trim() })).unwrap()
      await dispatch(loginUser({ username, password })).unwrap()
      setCode('')
      navigate('/profile/create', { replace: true })
    } catch (error) {
      setLocalError(String(error || 'Registration failed'));
    }
  }
  return (
    <>
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
          <p className="text-sm opacity-70 mb-4">Enter the code sent to {email}</p>

          {(localError || error) && (
            <div className="alert alert-error w-full mb-3">
              <span>{localError || error}</span>
            </div>
           )}
        <form className="form-control gap-3 mt-4 w-full" onSubmit={handleSubmit}>
        <label className="input input-bordered flex items-center gap-2 w-full">
          <span className="opacity-60">Code</span>
          <input
            type="text"
            className="grow"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoComplete="code"
          />
        </label>
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
          onClick={() => setShowCode((prev) => !prev)}
        >
          {showCode ? "Hide" : "Show"}
        </button>
        <button type="submit" className="btn btn-neutral w-full">
          {loading ? 'Verifying...' : 'Verify'}
        </button>
        </form>

      </div>


    </div>
    </>
  )

}

export default VerifyEmail