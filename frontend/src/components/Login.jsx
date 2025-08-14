import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authThunk";
import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, status } = useSelector((state) => state.auth)
  const location = useLocation()
  const justRegistered = location.state?.justRegistered === true

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (justRegistered) {
      const appear = setTimeout(() => setShowToast(true), 300);
      const disappear = setTimeout(() => setShowToast(false), 53000);
      return () => {
        clearTimeout(appear);
        clearTimeout(disappear);
      };
    }
  }, [justRegistered]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please fill in all the fields");
      return;
    }
    setError("");

    const result = await dispatch(loginUser({ username, password }));
    if (loginUser.rejected.match(result)) {
      setError(result.payload || "Enter error");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/home"/>;
  }

  return (
<>
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

  <div className="flex justify-center items-center h-screen bg-base-200">
    <div className="card w-96 bg-base-100 shadow-xl p-6">
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
