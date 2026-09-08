import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import PropertyForm from "../components/PropertyForm";
import type { PropertyFormValues } from "../components/PropertyForm";
import EmptyState from "../components/EmptyState";
import { getPropertyById, updateProperty } from "../api/api";
import type { Property } from "../types/Property";

function EditProperty() {
  const { id } = useParams();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      try {
        const data = await getPropertyById(id!);
        setProperty(data);
      } catch (err) {
        console.log(err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  async function handleSubmit(values: PropertyFormValues) {
    const isLand = values.propertyType === "land";

    try {
      await updateProperty(id!, {
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
      });
      setSubmitted(true);
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
          message="This listing may have already been removed."
          actionLabel="Back to My Properties"
          actionTo="/my-properties"
        />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 col-lg-3 col-xl-2 p-0">
          <DashboardSidebar />
        </div>

        <div className="col-12 col-lg-9 col-xl-10 py-5 px-4 px-md-5">
          <h1 className="mb-1">Edit property</h1>
          <p className="text-muted-soft mb-4">{property.title}</p>

          {submitted && (
            <div className="alert alert-success" role="alert">
              Property updated successfully.
            </div>
          )}

          <PropertyForm
            submitLabel="Save Changes"
            onSubmit={handleSubmit}
            initialValues={{
              title: property.title,
              description: property.description,
              propertyType: property.propertyType,
              listingType: property.listingType,
              price: String(property.price),
              city: property.city,
              area: property.area,
              size: String(property.size),
              bedrooms: String(property.bedrooms ?? 0),
              bathrooms: String(property.bathrooms ?? 0),
              image: property.image,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditProperty;
