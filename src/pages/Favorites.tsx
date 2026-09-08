import { useEffect, useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import PropertyCard from "../components/PropertyCard";
import EmptyState from "../components/EmptyState";
import { getFavorites } from "../api/api";
import { CURRENT_USER_ID } from "../constants/currentUser";
import type { Property } from "../types/Property";

function Favorites() {
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // The backend's favorites endpoint already joins favorites -> properties,
  // so it returns full property objects directly. This runs once when the
  // page first opens.
  useEffect(() => {
    async function loadFavorites() {
      try {
        const data = await getFavorites(CURRENT_USER_ID);
        setSavedProperties(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  // Every property shown on this page is already favorited, so the only
  // possible action here is un-favoriting. Remove it from the list right
  // away instead of reloading the whole page from the backend.
  function handleFavoriteToggle(propertyId: number, favorited: boolean) {
    if (!favorited) {
      setSavedProperties((prev) => prev.filter((p) => p.id !== propertyId));
    }
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-3 col-xl-2 p-0">
          <DashboardSidebar />
        </div>

        <div className="col-12 col-lg-9 col-xl-10 py-5 px-4 px-md-5">
          <h1 className="mb-1">Saved Properties</h1>
          <p className="text-muted-soft mb-4">{savedProperties.length} saved</p>

          {loading ? (
            <p className="text-muted-soft">Loading favorites...</p>
          ) : savedProperties.length === 0 ? (
            <EmptyState
              title="No saved properties yet"
              message="Tap the heart on any listing to keep it here."
              actionLabel="Explore Properties"
              actionTo="/properties"
            />
          ) : (
            <div className="row g-4">
              {savedProperties.map((property) => (
                <div className="col-12 col-sm-6 col-xl-4" key={property.id}>
                  <PropertyCard
                    property={property}
                    isFavorited={true}
                    onFavoriteToggle={handleFavoriteToggle}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites;
