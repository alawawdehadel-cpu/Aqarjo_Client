import { useEffect, useState } from "react";
import FilterSidebar from "../components/FilterSidebar";
import PropertyCard from "../components/PropertyCard";
import EmptyState from "../components/EmptyState";
import { getProperties, getFavorites } from "../api/api";
import type { AppUser } from "../api/api";
import type { Property } from "../types/Property";

interface PropertiesProps {
  currentUser: AppUser | null;
}

function Properties({ currentUser }: PropertiesProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

  const [listingType, setListingType] = useState("all");
  const [propertyType, setPropertyType] = useState("all");
  const [city, setCity] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("any");
  const [sortBy, setSortBy] = useState("newest");

  // The Navbar and Home search links send filters through the URL query
  // string (e.g. /properties?listingType=rent). We read them once, when
  // this page first loads, using the browser's native URLSearchParams.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("listingType")) setListingType(params.get("listingType")!);
    if (params.get("propertyType")) setPropertyType(params.get("propertyType")!);
    if (params.get("city")) setCity(params.get("city")!);
    if (params.get("minPrice")) setMinPrice(params.get("minPrice")!);
    if (params.get("maxPrice")) setMaxPrice(params.get("maxPrice")!);
  }, []);

  // Load the properties from the backend once, when the page first opens.
  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await getProperties();
        setProperties(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
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

  function clearFilters() {
    setListingType("all");
    setPropertyType("all");
    setCity("all");
    setMinPrice("");
    setMaxPrice("");
    setBedrooms("any");
  }

  // Filter the mock data based on everything selected above.
  let filteredProperties = properties.filter((property) => {
    if (listingType !== "all" && property.listingType !== listingType) return false;
    if (propertyType !== "all" && property.propertyType !== propertyType) return false;
    if (city !== "all" && property.city !== city) return false;
    if (minPrice && property.price < Number(minPrice)) return false;
    if (maxPrice && property.price > Number(maxPrice)) return false;
    if (bedrooms === "1" && property.bedrooms !== 1) return false;
    if (bedrooms === "2" && property.bedrooms !== 2) return false;
    if (bedrooms === "3+" && (property.bedrooms ?? 0) < 3) return false;
    return true;
  });

  // Sort a copy of the filtered list so we never mutate the original array.
  if (sortBy === "priceLow") {
    filteredProperties = [...filteredProperties].sort((a, b) => a.price - b.price);
  } else if (sortBy === "priceHigh") {
    filteredProperties = [...filteredProperties].sort((a, b) => b.price - a.price);
  } else {
    filteredProperties = [...filteredProperties].sort((a, b) => b.id - a.id);
  }

  return (
    <div className="container my-5">
      <div className="d-flex flex-wrap justify-content-between align-items-end mb-4">
        <div>
          <h1 className="mb-1">Properties in Jordan</h1>
          <p className="text-muted-soft mb-0">
            {filteredProperties.length} properties found
          </p>
        </div>

        <div>
          <label className="form-label small fw-semibold mb-1">Sort by</label>
          <select
            className="form-select form-select-sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-3">
          <FilterSidebar
            listingType={listingType}
            setListingType={setListingType}
            propertyType={propertyType}
            setPropertyType={setPropertyType}
            city={city}
            setCity={setCity}
            minPrice={minPrice}
            setMinPrice={setMinPrice}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            bedrooms={bedrooms}
            setBedrooms={setBedrooms}
            onClear={clearFilters}
          />
        </div>

        <div className="col-12 col-lg-9">
          {loading ? (
            <p className="text-muted-soft">Loading properties...</p>
          ) : filteredProperties.length === 0 ? (
            <EmptyState
              title="No properties match your filters"
              message="Try widening the price range or clearing a filter."
              actionLabel="Clear all filters"
              actionTo="/properties"
            />
          ) : (
            <div className="row g-4">
              {filteredProperties.map((property) => (
                <div className="col-12 col-sm-6 col-xl-4" key={property.id}>
                  <PropertyCard
                    property={property}
                    currentUser={currentUser}
                    isFavorited={favoriteIds.has(property.id)}
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

export default Properties;
