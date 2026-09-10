import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProperties,
  getUsers,
  updatePropertyStatus,
  deleteProperty,
  updateUser,
  deleteUser,
} from "../api/api";
import type { AppUser } from "../api/api";
import type { Property } from "../types/Property";

type AdminTab = "dashboard" | "properties" | "users";

interface UserEditForm {
  name: string;
  email: string;
  phone: string;
  role: string;
}

function statusBadgeClass(status: Property["status"]) {
  if (status === "approved") return "badge-approved";
  if (status === "pending") return "badge-pending";
  return "badge-rejected";
}

// Turns the backend's ISO date string into the short display format the
// page used to show, e.g. "12 Aug 2026".
function formatDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  const [adminProperties, setAdminProperties] = useState<Property[]>([]);
  const [adminUsers, setAdminUsers] = useState<AppUser[]>([]);

  // Which user row is currently being edited, and the form values for it.
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<UserEditForm>({
    name: "",
    email: "",
    phone: "",
    role: "user",
  });

  // Load all properties from the backend once, when the page first opens.
  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties();
        setAdminProperties(data);
      } catch (err) {
        console.log(err);
      }
    }

    loadProperties();
  }, []);

  // Load all users from the backend once, when the page first opens.
  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await getUsers();
        setAdminUsers(data);
      } catch (err) {
        console.log(err);
      }
    }

    loadUsers();
  }, []);

  async function updateStatus(id: number, status: Property["status"]) {
    try {
      await updatePropertyStatus(id, status);
      setAdminProperties((prev) =>
        prev.map((property) => (property.id === id ? { ...property, status } : property))
      );
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteProperty(id: number, title: string) {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteProperty(id);
      setAdminProperties((prev) => prev.filter((property) => property.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  function startEditUser(user: AppUser) {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  }

  function cancelEditUser() {
    setEditingUserId(null);
  }

  async function handleSaveUser(id: number) {
    try {
      const updatedUser = await updateUser(id, editForm);
      setAdminUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
      setEditingUserId(null);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteUser(id: number, name: string) {
    const confirmed = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteUser(id);
      setAdminUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  const pendingProperties = adminProperties.filter((p) => p.status === "pending");
  const forSaleCount = adminProperties.filter((p) => p.listingType === "sale").length;
  const forRentCount = adminProperties.filter((p) => p.listingType === "rent").length;

  const tabs: { key: AdminTab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "properties", label: "Properties" },
    { key: "users", label: "Users" },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-3 col-xl-2 p-0">
          <aside className="dashboard-sidebar">
            <nav className="nav flex-column">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`nav-link text-start border-0 bg-transparent ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>
        </div>

        <div className="col-12 col-lg-9 col-xl-10 py-5 px-4 px-md-5">
          <span className="section-eyebrow">Admin</span>
          <h1 className="mb-4">
            {activeTab === "dashboard" && "Platform overview"}
            {activeTab === "properties" && "Properties"}
            {activeTab === "users" && "Users"}
          </h1>

          {activeTab === "dashboard" && (
            <>
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-3">
                  <div className="stat-card">
                    <div className="small text-muted-soft">Total users</div>
                    <div className="stat-value">{adminUsers.length}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="stat-card">
                    <div className="small text-muted-soft">Total properties</div>
                    <div className="stat-value">{adminProperties.length}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="stat-card">
                    <div className="small text-muted-soft">Pending review</div>
                    <div className="stat-value">{pendingProperties.length}</div>
                  </div>
                </div>
                <div className="col-6 col-md-3">
                  <div className="stat-card">
                    <div className="small text-muted-soft">For sale / rent</div>
                    <div className="stat-value">
                      {forSaleCount} / {forRentCount}
                    </div>
                  </div>
                </div>
              </div>

              <div className="stat-card p-0">
                <div className="p-3 border-bottom divider d-flex justify-content-between align-items-center">
                  <h2 className="h6 mb-0">Pending approval queue</h2>
                  <button type="button" className="btn btn-link btn-sm p-0" onClick={() => setActiveTab("properties")}>
                    Go to Properties &rarr;
                  </button>
                </div>
                {pendingProperties.length === 0 ? (
                  <p className="text-muted-soft p-3 mb-0">Nothing waiting for review.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table align-middle mb-0">
                      <tbody>
                        {pendingProperties.map((property) => (
                          <tr key={property.id}>
                            <td>
                              <div className="fw-semibold">{property.title}</div>
                              <div className="small text-muted-soft">
                                {property.owner} &middot; {property.price.toLocaleString()} JOD &middot;{" "}
                                submitted {formatDate(property.dateAdded)}
                              </div>
                            </td>
                            <td className="text-end">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm me-2"
                                onClick={() => updateStatus(property.id, "approved")}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => updateStatus(property.id, "rejected")}
                              >
                                Reject
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === "properties" && (
            <div className="table-responsive stat-card p-0">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Owner</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminProperties.map((property) => (
                    <tr key={property.id}>
                      <td>{property.title}</td>
                      <td>{property.owner}</td>
                      <td className="text-capitalize">{property.propertyType}</td>
                      <td>{property.price.toLocaleString()} JOD</td>
                      <td>
                        <span className={`badge ${statusBadgeClass(property.status)} text-capitalize`}>
                          {property.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2 align-items-center flex-wrap">
                          <Link to={`/properties/${property.id}`} className="small fw-semibold">
                            View
                          </Link>
                          <Link to={`/edit-property/${property.id}`} className="small fw-semibold">
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-link btn-sm text-danger p-0 small fw-semibold"
                            onClick={() => handleDeleteProperty(property.id, property.title)}
                          >
                            Delete
                          </button>
                          {property.status === "pending" && (
                            <>
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => updateStatus(property.id, "approved")}
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => updateStatus(property.id, "rejected")}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "users" && (
            <div className="table-responsive stat-card p-0">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map((user) => {
                    const isEditing = editingUserId === user.id;

                    if (isEditing) {
                      return (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editForm.name}
                              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              type="email"
                              className="form-control form-control-sm"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                          </td>
                          <td>
                            <input
                              type="tel"
                              className="form-control form-control-sm"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                          </td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={editForm.role}
                              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            >
                              <option value="user">user</option>
                              <option value="admin">admin</option>
                            </select>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                type="button"
                                className="btn btn-primary btn-sm"
                                onClick={() => handleSaveUser(user.id)}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={cancelEditUser}
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td className="text-capitalize">{user.role}</td>
                        <td>
                          <div className="d-flex gap-3">
                            <button
                              type="button"
                              className="btn btn-link btn-sm p-0 small fw-semibold"
                              onClick={() => startEditUser(user)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-link btn-sm text-danger p-0 small fw-semibold"
                              onClick={() => handleDeleteUser(user.id, user.name)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
