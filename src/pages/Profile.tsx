import { useState } from "react";
import type { FormEvent } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import { updateUser } from "../api/api";
import type { AppUser } from "../api/api";

interface ProfileProps {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
}

function Profile({ currentUser, setCurrentUser }: ProfileProps) {
  const [fullName, setFullName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    try {
      // The backend keeps the existing role unless we're an admin, so we
      // don't need to (and can't) change our own role from this form.
      const updatedUser = await updateUser(currentUser.id, {
        name: fullName,
        email,
        phone,
        role: currentUser.role,
      });

      // Update App's currentUser too, so the Navbar shows the new name
      // immediately without needing a refresh.
      setCurrentUser(updatedUser);
      setSaved(true);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-3 col-xl-2 p-0">
          <DashboardSidebar />
        </div>

        <div className="col-12 col-lg-9 col-xl-10 py-5 px-4 px-md-5">
          <h1 className="mb-4">Profile</h1>

          <div className="row">
            <div className="col-12 col-lg-6">
              {saved && (
                <div className="alert alert-success" role="alert">
                  Profile updated successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="stat-card">
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Full name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-semibold">Phone number</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Edit Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
