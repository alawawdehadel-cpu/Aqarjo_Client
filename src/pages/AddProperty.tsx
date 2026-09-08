import { useState } from "react";
import DashboardSidebar from "../components/DashboardSidebar";
import PropertyForm from "../components/PropertyForm";
import type { PropertyFormValues } from "../components/PropertyForm";
import { createProperty } from "../api/api";
import { CURRENT_USER_ID } from "../constants/currentUser";

function AddProperty() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(values: PropertyFormValues) {
    const isLand = values.propertyType === "land";

    try {
      await createProperty({
        title: values.title,
        description: values.description,
        price: Number(values.price),
        listingType: values.listingType,
        propertyType: values.propertyType,
        city: values.city,
        area: values.area,
        bedrooms: isLand ? null : Number(values.bedrooms),
        bathrooms: isLand ? null : Number(values.bathrooms),
        size: Number(values.size),
        image: values.image,
        ownerId: CURRENT_USER_ID,
      });
      setSubmitted(true);
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
          <h1 className="mb-1">Add a property</h1>
          <p className="text-muted-soft mb-4">
            Fill in the details below. Your listing goes live once an admin
            approves it.
          </p>

          {submitted && (
            <div className="alert alert-success" role="alert">
              Property added successfully.
            </div>
          )}

          <PropertyForm submitLabel="Add Property" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

export default AddProperty;
