import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import { getUserProperties, deleteProperty } from "../api/api";
import { CURRENT_USER_ID } from "../constants/currentUser";
import type { Property } from "../types/Property";

function statusBadgeClass(status: Property["status"]) {
  if (status === "approved") return "badge-approved";
  if (status === "pending") return "badge-pending";
  return "badge-rejected";
}

function MyProperties() {
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMyProperties() {
      try {
        const data = await getUserProperties(CURRENT_USER_ID);
        setMyProperties(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadMyProperties();
  }, []);

  async function handleDelete(id: number, title: string) {
    const confirmed = window.confirm(`Delete "${title}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteProperty(id);
      setMyProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  const approvedCount = myProperties.filter((p) => p.status === "approved").length;
  const pendingCount = myProperties.filter((p) => p.status === "pending").length;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-3 col-xl-2 p-0">
          <DashboardSidebar />
        </div>

        <div className="col-12 col-lg-9 col-xl-10 py-5 px-4 px-md-5">
          <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
            <div>
              <h1 className="mb-1">My Properties</h1>
              <p className="text-muted-soft mb-0">
                {myProperties.length} listings &middot; {approvedCount} approved &middot;{" "}
                {pendingCount} pending
              </p>
            </div>
            <Link to="/add-property" className="btn btn-primary">
              + Add Property
            </Link>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="small text-muted-soft">Total listings</div>
                <div className="stat-value">{myProperties.length}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="small text-muted-soft">Approved</div>
                <div className="stat-value">{approvedCount}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="small text-muted-soft">Pending review</div>
                <div className="stat-value">{pendingCount}</div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-card">
                <div className="small text-muted-soft">Total views</div>
                <div className="stat-value">
                  {myProperties.reduce((sum, p) => sum + p.views, 0)}
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <p className="text-muted-soft">Loading properties...</p>
          ) : myProperties.length === 0 ? (
            <div className="empty-state">
              <h3 className="h4 mb-2">You haven't listed anything yet</h3>
              <p className="text-muted-soft mb-3">
                Add your first property and start receiving inquiries.
              </p>
              <Link to="/add-property" className="btn btn-primary">
                + Add Property
              </Link>
            </div>
          ) : (
            <div className="table-responsive stat-card p-0">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Type</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Views</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myProperties.map((property) => (
                    <tr key={property.id}>
                      <td>
                        <div className="fw-semibold">{property.title}</div>
                        <div className="small text-muted-soft">
                          {property.area}, {property.city}
                        </div>
                      </td>
                      <td className="text-capitalize">{property.listingType}</td>
                      <td>
                        {property.price.toLocaleString()} JOD
                        {property.listingType === "rent" ? " /mo" : ""}
                      </td>
                      <td>
                        <span className={`badge ${statusBadgeClass(property.status)} text-capitalize`}>
                          {property.status}
                        </span>
                      </td>
                      <td>{property.views}</td>
                      <td>
                        <div className="d-flex gap-3">
                          <Link to={`/properties/${property.id}`} className="small fw-semibold">
                            View
                          </Link>
                          <Link to={`/edit-property/${property.id}`} className="small fw-semibold">
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="btn btn-link btn-sm text-danger p-0 small fw-semibold"
                            onClick={() => handleDelete(property.id, property.title)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProperties;
