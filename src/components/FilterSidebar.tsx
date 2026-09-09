import { cities } from "../constants/cities";

// All filter values live in the parent (Properties page) as useState.
// This component just receives them as props, together with the setter
// functions, and shows the inputs. Every change immediately updates the
// parent's state, which re-filters the list.
interface FilterSidebarProps {
  listingType: string;
  setListingType: (value: string) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  bedrooms: string;
  setBedrooms: (value: string) => void;
  onClear: () => void;
}

function FilterSidebar({
  listingType,
  setListingType,
  propertyType,
  setPropertyType,
  city,
  setCity,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  bedrooms,
  setBedrooms,
  onClear,
}: FilterSidebarProps) {
  return (
    <div className="stat-card">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h6 mb-0">Filters</h2>
        <button type="button" className="btn btn-link btn-sm text-danger p-0" onClick={onClear}>
          Clear all
        </button>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Listing type</label>
        <div className="btn-group w-100" role="group">
          {["all", "sale", "rent"].map((option) => (
            <button
              key={option}
              type="button"
              className={`btn btn-sm ${listingType === option ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setListingType(option)}
            >
              {option === "all" ? "All" : option === "sale" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Property type</label>
        <select
          className="form-select form-select-sm"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="all">All types</option>
          <option value="apartment">Apartment</option>
          <option value="house">House</option>
          <option value="land">Land</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">City</label>
        <select
          className="form-select form-select-sm"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        >
          <option value="all">All cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Price (JOD)</label>
        <div className="d-flex gap-2">
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            className="form-control form-control-sm"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="form-label small fw-semibold">Bedrooms</label>
        <div className="d-flex gap-2 flex-wrap">
          {["any", "1", "2", "3+"].map((option) => (
            <button
              key={option}
              type="button"
              className={`btn btn-sm ${bedrooms === option ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setBedrooms(option)}
            >
              {option === "any" ? "Any" : option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FilterSidebar;
