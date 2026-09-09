import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import type { AppUser } from "../api/api";

interface RegisterProps {
  setCurrentUser: (user: AppUser) => void;
}

function Register({ setCurrentUser }: RegisterProps) {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    setLoading(true);

    try {
      // The backend always creates public sign-ups as a normal "user" —
      // there's no way to request an admin role from this form.
      const user = await registerUser({ name: fullName, email, phone, password });
      setCurrentUser(user);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container my-5">
      <div className="row g-0 property-card overflow-hidden">
        <div className="col-12 col-md-5 d-none d-md-flex flex-column justify-content-center p-5" style={{ backgroundColor: "var(--color-secondary)" }}>
          <h2 className="mb-3">Create an account in under a minute.</h2>
          <ul className="list-unstyled text-muted-soft">
            <li className="mb-2">&#10003; Save favourite properties</li>
            <li className="mb-2">&#10003; Send inquiries to owners</li>
            <li className="mb-2">&#10003; List your own property for free</li>
            <li className="mb-0">&#10003; Track views and messages</li>
          </ul>
        </div>

        <div className="col-12 col-md-7 p-4 p-md-5">
          <h1 className="h2 mb-4">Register</h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Full name</label>
              <input
                type="text"
                className="form-control"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label small fw-semibold">Phone number</label>
              <input
                type="tel"
                className="form-control"
                placeholder="07X XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label small fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold">Confirm password</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="text-center text-muted-soft small mb-0">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
