import { useState } from "react";
import type { FormEvent } from "react";

// The exact shape of data the form collects. Prices/sizes stay as strings
// while typing, since they come straight out of <input> elements.
export interface PropertyFormValues {
  title: string;
  description: string;
  propertyType: string;
  listingType: string;
  price: string;
  city: string;
  area: string;
  size: string;
  bedrooms: string;
  bathrooms: string;
  image: string;
}

const emptyValues: PropertyFormValues = {
  title: "",
  description: "",
  propertyType: "apartment",
  listingType: "sale",
  price: "",
  city: "",
  area: "",
  size: "",
  bedrooms: "1",
  bathrooms: "1",
  image: "",
};

// Add Property and Edit Property both use this same form. Add Property
// renders it with no initial values, Edit Property passes in the existing
// property's data. The parent decides what "submitLabel" and "onSubmit" do.
interface PropertyFormProps {
  initialValues?: Partial<PropertyFormValues>;
  submitLabel: string;
  onSubmit: (values: PropertyFormValues) => void;
}

function PropertyForm({ initialValues, submitLabel, onSubmit }: PropertyFormProps) {
  const [values, setValues] = useState<PropertyFormValues>({
    ...emptyValues,
    ...initialValues,
  });

  function updateField<K extends keyof PropertyFormValues>(field: K, value: PropertyFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSubmit(values);
  }

  const isLand = values.propertyType === "land";

  return (
    <form onSubmit={handleSubmit} className="stat-card">
      <div className="mb-3">
        <label className="form-label small fw-semibold">Property title</label>
        <input
          type="text"
          className="form-control"
          value={values.title}
          onChange={(e) => updateField("title", e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label small fw-semibold">Description</label>
        <textarea
          className="form-control"
          rows={4}
          value={values.description}
          onChange={(e) => updateField("description", e.target.value)}
          required
        />
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6">
          <label className="form-label small fw-semibold">Property type</label>
          <select
            className="form-select"
            value={values.propertyType}
            onChange={(e) => updateField("propertyType", e.target.value)}
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="col-6">
          <label className="form-label small fw-semibold">Listing type</label>
          <div className="btn-group w-100">
            <button
              type="button"
              className={`btn ${values.listingType === "sale" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => updateField("listingType", "sale")}
            >
              Sale
            </button>
            <button
              type="button"
              className={`btn ${values.listingType === "rent" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => updateField("listingType", "rent")}
            >
              Rent
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6 col-md-4">
          <label className="form-label small fw-semibold">Price (JOD)</label>
          <input
            type="number"
            className="form-control"
            value={values.price}
            onChange={(e) => updateField("price", e.target.value)}
            required
          />
        </div>
        <div className="col-6 col-md-4">
          <label className="form-label small fw-semibold">City</label>
          <input
            type="text"
            className="form-control"
            value={values.city}
            onChange={(e) => updateField("city", e.target.value)}
            required
          />
        </div>
        <div className="col-12 col-md-4">
          <label className="form-label small fw-semibold">Area</label>
          <input
            type="text"
            className="form-control"
            value={values.area}
            onChange={(e) => updateField("area", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="row g-3 mb-3">
        <div className="col-6 col-md-4">
          <label className="form-label small fw-semibold">Size (m&sup2;)</label>
          <input
            type="number"
            className="form-control"
            value={values.size}
            onChange={(e) => updateField("size", e.target.value)}
            required
          />
        </div>

        {/* Bedrooms and bathrooms only make sense for apartments and houses,
            so they are hidden completely for land using conditional rendering. */}
        {!isLand && (
          <>
            <div className="col-6 col-md-4">
              <label className="form-label small fw-semibold">Bedrooms</label>
              <input
                type="number"
                min={0}
                className="form-control"
                value={values.bedrooms}
                onChange={(e) => updateField("bedrooms", e.target.value)}
              />
            </div>
            <div className="col-6 col-md-4">
              <label className="form-label small fw-semibold">Bathrooms</label>
              <input
                type="number"
                min={0}
                className="form-control"
                value={values.bathrooms}
                onChange={(e) => updateField("bathrooms", e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className="mb-4">
        <label className="form-label small fw-semibold">Image URL</label>
        <input
          type="text"
          className="form-control"
          placeholder="https://..."
          value={values.image}
          onChange={(e) => updateField("image", e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {submitLabel}
      </button>
    </form>
  );
}

export default PropertyForm;
