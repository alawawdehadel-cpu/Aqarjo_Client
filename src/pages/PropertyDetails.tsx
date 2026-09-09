import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";
import EmptyState from "../components/EmptyState";
import { getPropertyById, getProperties, getFavorites, sendInquiry } from "../api/api";
import { CURRENT_USER_ID } from "../constants/currentUser";
import type { Property } from "../types/Property";

const amenities = ["Parking", "Balcony", "Elevator", "Central heating", "Furnished", "Security"];

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Is this property still available?");
  const [inquirySent, setInquirySent] = useState(false);

  // Load the property (and a few similar ones from the same city) whenever
  // the id in the URL changes.
  useEffect(() => {
    async function loadProperty() {
      setLoading(true);
      try {
        const data = await getPropertyById(id!);
        setProperty(data);

        const allProperties = await getProperties();
        const similar = allProperties
          .filter((p) => p.city === data.city && p.id !== data.id)
          .slice(0, 3);
        setSimilarProperties(similar);
      } catch (err) {
        console.log(err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  // Load the current user's favorite ids once, so PropertyCard doesn't
  // need to check the backend individually for every "similar property" card.
  useEffect(() => {
    async function loadFavorites() {
      try {
        const favorites = await getFavorites(CURRENT_USER_ID);
        setFavoriteIds(new Set(favorites.map((f) => f.id)));
      } catch (err) {
        console.log(err);
      }
    }

    loadFavorites();
  }, []);

  function handleFavoriteToggle(propertyId: number, favorited: boolean) {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (favorited) {
        next.add(propertyId);
      } else {
        next.delete(propertyId);
      }
      return next;
    });
  }

  async function handleInquirySubmit(event: FormEvent) {
    event.preventDefault();
    try {
      await sendInquiry({ propertyId: id!, name, email, message });
      setInquirySent(true);
    } catch (err) {
      console.log(err);
    }
  }

  if (loading) {
    return (
      <div className="container my-5">
        <p className="text-muted-soft">Loading property...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container my-5">
        <EmptyState
          title="Property not found"
          message="This listing may have been removed."
          actionLabel="Back to Properties"
          actionTo="/properties"
        />
      </div>
    );
  }

  // A few extra "photos" made from the same seed, just for the gallery grid.
  const gallery = [property.image, `${property.image}?a`, `${property.image}?b`, `${property.image}?c`];

  return (
    <div className="container my-5">
      <p className="text-muted-soft small mb-3">
        <Link to="/">Home</Link> / <Link to="/properties">Properties</Link> / {property.area}
      </p>

      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <img src={gallery[0]} alt={property.title} className="w-100 rounded-3" style={{ height: "380px", objectFit: "cover" }} />
        </div>
        <div className="col-12 col-md-4">
          <div className="row g-2 h-100">
            {gallery.slice(1).map((src, index) => (
              <div className="col-6 col-md-12" key={index} style={{ height: "auto" }}>
                <img
                  src={src}
                  alt={`${property.title} ${index + 2}`}
                  className="w-100 rounded-3"
                  style={{ height: "121px", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="row g-5">
        <div className="col-12 col-lg-8">
          <span className={`badge ${property.listingType === "sale" ? "badge-sale" : "badge-rent"} mb-3`}>
            {property.listingType === "sale" ? "For Sale" : "For Rent"}
          </span>
          <h1 className="mb-1">{property.title}</h1>
          <p className="text-muted-soft mb-2">
            {property.area}, {property.city}
          </p>
          <p className="property-price fs-3 mb-4">
            {property.price.toLocaleString()} JOD
            {property.listingType === "rent" ? " / month" : ""}
          </p>

          <div className="row text-center g-0 border rounded-3 divider mb-4">
            {property.propertyType !== "land" && (
              <>
                <div className="col p-3 border-end divider">
                  <div className="small text-muted-soft">Bedrooms</div>
                  <div className="fw-semibold">{property.bedrooms}</div>
                </div>
                <div className="col p-3 border-end divider">
                  <div className="small text-muted-soft">Bathrooms</div>
                  <div className="fw-semibold">{property.bathrooms}</div>
                </div>
              </>
            )}
            <div className="col p-3 border-end divider">
              <div className="small text-muted-soft">Size</div>
              <div className="fw-semibold">{property.size} m&sup2;</div>
            </div>
            <div className="col p-3">
              <div className="small text-muted-soft">Type</div>
              <div className="fw-semibold text-capitalize">{property.propertyType}</div>
            </div>
          </div>

          <h2 className="h4 mb-2">Description</h2>
          <p className="text-muted-soft mb-4">{property.description}</p>

          <h2 className="h4 mb-3">Features &amp; amenities</h2>
          <div className="row g-2 mb-4">
            {amenities.map((amenity) => (
              <div className="col-6 col-md-4" key={amenity}>
                <span className="d-block border divider rounded-3 px-3 py-2 small">{amenity}</span>
              </div>
            ))}
          </div>

          <h2 className="h4 mb-3">Property location</h2>
          <div className="map-placeholder">
            Property Location
            <br />
            Map integration will be connected later.
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="contact-card">
            <h3 className="h6 mb-1">{property.owner}</h3>
            <p className="text-muted-soft small mb-3">Owner &middot; +962 7X XXX XXXX</p>
            <hr className="divider" />

            {inquirySent ? (
              <div className="alert alert-success" role="alert">
                Inquiry sent successfully.
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit}>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Your name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label small fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Message</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {similarProperties.length > 0 && (
        <div className="mt-5 pt-4 border-top divider">
          <h2 className="mb-4">Similar properties</h2>
          <div className="row g-4">
            {similarProperties.map((p) => (
              <div className="col-12 col-sm-6 col-lg-4" key={p.id}>
                <PropertyCard
                  property={p}
                  isFavorited={favoriteIds.has(p.id)}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetails;
