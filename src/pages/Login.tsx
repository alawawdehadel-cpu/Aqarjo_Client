import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSubmitted(true);
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

          {submitted && (
            <div className="alert alert-info" role="alert">
              Login functionality will be connected to the backend later.
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
            <button type="submit" className="btn btn-primary w-100 mb-3">
              Login
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
