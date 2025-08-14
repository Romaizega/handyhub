import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../features/auth/authThunk"
import { useState, useMemo } from "react"

const Register = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((s) => s.auth);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client')
  const [localError, setLocalError] = useState(null)
  const [accepted, setAccepted] = useState(false)

  const loading = status === 'loading';

  const canSubmit = useMemo(() => {
    return (
      username.trim().length >= 3 &&
      /\S+@\S+\.\S+/.test(email) &&
      /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password) &&
      (role === 'client' || role === 'worker') &&
      accepted &&
      !loading
    );
  }, [username, email, password, role, accepted, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);


    if (username.trim().length < 3) {
      setLocalError('Username must be at least 3 characters');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setLocalError('Invalid email format');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password)) {
      setLocalError('Password must be 8+ chars, include letters and numbers');
      return;
    }
    if (!accepted) {
      setLocalError('Please accept the terms');
      return;
    }

    try {
      await dispatch(
        registerUser({ username: username.trim(), email: email.trim(), password, role })
      ).unwrap();

      setUsername('');
      setEmail('');
      setPassword('');
      setRole('client');
      setAccepted(false);
      setLocalError(null);
    } catch (error) {
      setLocalError(String(error || 'Registration failed'));
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title justify-center text-3xl font-bold">Create account</h2>
            <p className="text-center text-base-content/70">Join HandyHub in a minute</p>

            {(localError || error) && (
              <div className="alert alert-error mt-2">
                <span>{localError || error}</span>
              </div>
            )}

            <form className="form-control gap-3 mt-4" onSubmit={handleSubmit}>
              <label className="input input-bordered flex items-center gap-2">
                <span className="opacity-60">Username</span>
                <input
                  type="text"
                  className="grow"
                  placeholder="john_doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                />
              </label>

              <label className="input input-bordered flex items-center gap-2">
                <span className="opacity-60">Email</span>
                <input
                  type="email"
                  className="grow"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </label>

              <label className="input input-bordered flex items-center gap-2">
                <span className="opacity-60">Password</span>
                <input
                  type="password"
                  className="grow"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </label>

              <div className="mt-2">
                <div className="join mt-2">
                  <input
                    className={`join-item btn ${role === 'client' ? 'btn-neutral' : 'btn-outline'}`}
                    type="button"
                    value="Client"
                    onClick={() => setRole('client')}
                  />
                  <input
                    className={`join-item btn ${role === 'worker' ? 'btn-neutral' : 'btn-outline'}`}
                    type="button"
                    value="Worker"
                    onClick={() => setRole('worker')}
                  />
                </div>
              </div>

              <label className="label cursor-pointer mt-2">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={accepted}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span className="label-text ml-3">
                  I accept the Terms & Privacy Policy
                </span>
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-lg block mx-auto mt-4 mt-6"
                disabled={!canSubmit}
              >
                {loading && <span className="loading loading-spinner loading-sm mr-2" />}
                Create account
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <a className="link link-primary" href="/login">
            Sign in
          </a>
        </p>
      </div>
      {status === 'succeeded' && (
        <div className="alert alert-success my-3">🎉 Account created successfully!</div>
      )}
      {status === 'failed' && (
        <div className="alert alert-error my-3">{error}</div>
      )}
    </div>
  );
};

export default Register;