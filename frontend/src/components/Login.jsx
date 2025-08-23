import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunk";
import { Navigate, useLocation, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, status } = useSelector((state) => state.auth)
  const location = useLocation()
  // Show toast after successful registration
  const justRegistered = location.state?.justRegistered === true
  const navigate = useNavigate()
  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Show toast once for new registrations
  useEffect(() => {
    if (justRegistered) {
      const appear = setTimeout(() => setShowToast(true), 300);
      const disappear = setTimeout(() => setShowToast(false), 5300);
      navigate(location.pathname, { replace: true, state: {} });
      return () => {
        clearTimeout(appear);
        clearTimeout(disappear);
      };
    }
  }, [justRegistered, navigate, location.pathname]);

  // Handle login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

  if (!username || !password) {
    setError("Please fill in all the fields");
    return;
  }
  setError('');

  try {
    const payload = await dispatch(loginUser({ username, password })).unwrap();
    const role = payload?.user?.role ?? payload?.role;
    // Redirect after login
    const from = location.state?.from; 
    const target =
      from ??
      (role === "client" ? "/my-jobs" : role === "worker" ? "/offers" : "/home");

    navigate(target, { replace: true });
  } catch (err) {
    setError(String(err || "Enter error"));
  }
};

// If already logged in, redirect user
if (isAuthenticated) {
  const from = location.state?.from;
  return <Navigate to={from || "/home"} replace />;
}

  return (
<>
   {/* Toast for successful registration */}
  {showToast && (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 transition-all duration-300 z-50">
      <span>Account created successfully!</span>
      <button
        onClick={() => setShowToast(false)}
        className="ml-2 text-white font-bold hover:text-gray-200"
      >
        ×
      </button>
    </div>
  )}

  {/* Login form */}
  <div className="flex justify-center items-center h-screen bg-base-200">
    <div className="card w-93 bg-base-100 shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Log in</h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <label className="input input-bordered flex items-center gap-2">
          <span className="opacity-60">Username</span>
          <input
            type="text"
            className="grow"
            placeholder=""
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        {/* Password input with toggle */}
        <label className="input input-bordered flex items-center gap-2 relative">
          <span className="opacity-60">Password</span>
          <input
            type={showPassword ? "text" : "password"}
            className="grow pr-20"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-500 hover:underline"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </label>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          className="btn btn-neutral w-full"
          type="submit"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  </div>
</>
  );
};

export default Login;
