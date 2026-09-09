import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import { getProperties, getFavorites } from "../api/api";
import type { AppUser } from "../api/api";
import type { Property } from "../types/Property";

interface HomeProps {
  currentUser: AppUser | null;
}

function Home({ currentUser }: HomeProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  // Scroll to the top whenever this page is opened (e.g. coming back from
  // another page). A simple, common use of useEffect.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Load the properties from the backend once, when the page first opens.
  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        console.log(err);
      }
    }

    loadProperties();
  }, []);

  // Load the current user's favorite ids once, so PropertyCard doesn't
  // need to check the backend individually for every card. Skipped
  // entirely when nobody is logged in, since /api/favorites requires auth.
  useEffect(() => {
    if (!currentUser) {
      setFavoriteIds(new Set());
      return;
    }

    async function loadFavorites() {
      try {
        const favorites = await getFavorites();
        setFavoriteIds(new Set(favorites.map((f) => f.id)));
      } catch (err) {
        console.log(err);
      }
    }

    loadFavorites();
  }, [currentUser]);

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

  const featuredProperties = properties.filter((p) => p.featured).slice(0, 6);
  const spotlight = featuredProperties[0];

  const propertyTypes = [
    { type: "apartment", label: "Apartments" },
    { type: "house", label: "Houses" },
    { type: "land", label: "Land" },
  ];

  const popularCities = ["Amman", "Irbid", "Aqaba", "Zarqa"];

  return (
    <div>
      {/* ---------- Hero ---------- */}
      <section className="hero-section">
        <div className="container">
          <span className="section-eyebrow">Property in Jordan</span>
          <h1 className="hero-title font-serif my-3">
            Find a place that
            <br />
            feels right.
          </h1>
          <p className="text-muted-soft mb-4" style={{ maxWidth: "480px" }}>
            Discover apartments, houses, and land for sale or rent across
            Jordan &mdash; from Khalda to Aqaba.
          </p>
        </div>
      </section>

      <div className="container">
        <SearchBar />
      </div>

      {/* ---------- Categories ---------- */}
      <section className="container my-5 pt-4">
        <div className="row g-4">
          {propertyTypes.map((item) => {
            const count = properties.filter((p) => p.propertyType === item.type).length;
            return (
              <div className="col-12 col-md-4" key={item.type}>
                <div className="category-tile">
                  <h3 className="h4">{item.label}</h3>
                  <p className="text-muted-soft mb-2">{count} listings</p>
                  <Link to={`/properties?propertyType=${item.type}`} className="fw-semibold">
                    Browse &rarr;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Featured properties ---------- */}
      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-end mb-4 border-bottom divider pb-3">
          <div>
            <span className="section-eyebrow">Hand-picked</span>
            <h2 className="mb-0">Featured properties</h2>
          </div>
          <Link to="/properties" className="fw-semibold d-none d-md-inline">
            View all {properties.length} listings &rarr;
          </Link>
        </div>

        <div className="row g-4">
          {featuredProperties.map((property) => (
            <div className="col-12 col-sm-6 col-lg-4" key={property.id}>
              <PropertyCard
                property={property}
                currentUser={currentUser}
                isFavorited={favoriteIds.has(property.id)}
                onFavoriteToggle={handleFavoriteToggle}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Spotlight ---------- */}
      {spotlight && (
        <section className="container my-5">
          <div className="row g-0 property-card">
            <div className="col-12 col-md-6">
              <img
                src={spotlight.image}
                alt={spotlight.title}
                className="w-100 h-100"
                style={{ objectFit: "cover", minHeight: "280px" }}
              />
            </div>
            <div className="col-12 col-md-6 p-4 p-md-5 d-flex flex-column justify-content-center">
              <span className="section-eyebrow">Property of the week</span>
              <h2 className="my-2">{spotlight.title}</h2>
              <p className="property-price fs-4">
                {spotlight.price.toLocaleString()} JOD
                {spotlight.listingType === "rent" ? " / month" : ""}
              </p>
              <p className="text-muted-soft">
                {spotlight.bedrooms} Beds &middot; {spotlight.bathrooms} Baths &middot;
                {" "}
                {spotlight.size} m&sup2; &middot; {spotlight.area}, {spotlight.city}
              </p>
              <div className="d-flex gap-2 mt-2">
                <Link to={`/properties/${spotlight.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ---------- Popular locations ---------- */}
      <section className="container my-5">
        <h2 className="mb-4">Browse by location</h2>
        <div className="row g-4">
          {popularCities.map((city) => {
            const count = properties.filter((p) => p.city === city).length;
            return (
              <div className="col-6 col-md-3" key={city}>
                <div className="location-tile text-center">
                  <h3 className="h5 mb-1">{city}</h3>
                  <p className="text-muted-soft small mb-0">{count} properties</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container my-5">
        <div className="cta-band d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div>
            <h2 className="text-white mb-2">Have a property to sell or rent?</h2>
            <p className="mb-0" style={{ maxWidth: "480px" }}>
              List it in minutes and reach serious buyers and tenants across
              Jordan.
            </p>
          </div>
          <Link to="/add-property" className="btn btn-light fw-semibold">
            List Your Property
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
