import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { cities } from "../constants/cities";

// The hero search form on the Home page. It just builds a query string
// and sends the visitor to the Properties page, which reads it back.
function SearchBar() {
  const navigate = useNavigate();

  const [listingType, setListingType] = useState<"sale" | "rent">("sale");
  const [propertyType, setPropertyType] = useState("any");
  const [city, setCity] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const params = new URLSearchParams();
    params.set("listingType", listingType);
    if (propertyType !== "any") params.set("propertyType", propertyType);
    if (city !== "any") params.set("city", city);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    navigate(`/properties?${params.toString()}`);
  }

  return (
    <form className="search-card" onSubmit={handleSubmit}>
      <div className="row g-3 align-items-end">
        <div className="col-12 col-md-2">
          <label className="form-label small fw-semibold">I want to</label>
          <div className="btn-group w-100" role="group">
            <button
              type="button"
              className={`btn btn-sm ${listingType === "sale" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setListingType("sale")}
            >
              Buy
            </button>
            <button
              type="button"
              className={`btn btn-sm ${listingType === "rent" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setListingType("rent")}
            >
              Rent
            </button>
          </div>
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold">Property type</label>
          <select
            className="form-select form-select-sm"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="any">Any type</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold">City</label>
          <select
            className="form-select form-select-sm"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="any">Any city</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold">Min price</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="0"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="col-6 col-md-2">
          <label className="form-label small fw-semibold">Max price</label>
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="No max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="col-12 col-md-2">
          <button type="submit" className="btn btn-primary btn-sm w-100">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}

export default SearchBar;
