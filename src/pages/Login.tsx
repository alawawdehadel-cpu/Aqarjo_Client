import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import type { AppUser } from "../api/api";

interface LoginProps {
  setCurrentUser: (user: AppUser) => void;
}

function Login({ setCurrentUser }: LoginProps) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      setCurrentUser(user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container my-5">
      <div className="row g-0 property-card overflow-hidden">
        <div className="col-12 col-md-5 auth-side-panel d-none d-md-flex flex-column justify-content-center">
          <h2 className="text-white mb-3">Find a place that feels right.</h2>
          <p className="mb-0" style={{ opacity: 0.8 }}>
            Save the properties you like, send inquiries to owners, and manage
            your own listings &mdash; all from one account.
          </p>
        </div>

        <div className="col-12 col-md-7 p-4 p-md-5">
          <h1 className="h2 mb-1">Welcome back</h1>
          <p className="text-muted-soft mb-4">Log in to continue where you left off.</p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
            <p className="text-center text-muted-soft small mb-0">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
