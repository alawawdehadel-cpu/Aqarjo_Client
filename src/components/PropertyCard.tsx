import { Link } from "react-router-dom";
import type { Property } from "../types/Property";
import { addFavorite, removeFavorite } from "../api/api";
import { CURRENT_USER_ID } from "../constants/currentUser";

// A single property is passed in as a prop and rendered as a card.
// This component is reused on Home, Properties, PropertyDetails and
// Favorites. Whether this card is favorited is controlled by the parent
// page (it loads the user's favorite ids once, instead of every card
// checking the backend individually) — this component just reports back
// when the button is clicked.
interface PropertyCardProps {
  property: Property;
  isFavorited: boolean;
  onFavoriteToggle: (propertyId: number, favorited: boolean) => void;
}

function PropertyCard({ property, isFavorited, onFavoriteToggle }: PropertyCardProps) {
  async function handleFavoriteClick() {
    try {
      if (isFavorited) {
        await removeFavorite(CURRENT_USER_ID, property.id);
        onFavoriteToggle(property.id, false);
      } else {
        await addFavorite(CURRENT_USER_ID, property.id);
        onFavoriteToggle(property.id, true);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const priceLabel =
    property.listingType === "rent"
      ? `${property.price.toLocaleString()} JOD / month`
      : `${property.price.toLocaleString()} JOD`;

  return (
    <div className="property-card position-relative">
      <div className="position-relative">
        <img src={property.image} alt={property.title} className="property-card-img" />
        <span
          className={`badge property-card-badge ${
            property.listingType === "sale" ? "badge-sale" : "badge-rent"
          }`}
        >
          {property.listingType === "sale" ? "For Sale" : "For Rent"}
        </span>
        <button
          type="button"
          className="favorite-btn"
          onClick={handleFavoriteClick}
          aria-label="Toggle favorite"
        >
          {isFavorited ? "♥" : "♡"}
        </button>
      </div>

      <div className="p-3">
        <h3 className="h6 mb-1">{property.title}</h3>
        <p className="property-price mb-1">{priceLabel}</p>
        <p className="text-muted-soft small mb-2">
          {property.area}, {property.city}
        </p>

        {property.propertyType !== "land" ? (
          <p className="small text-muted-soft mb-3">
            {property.bedrooms} Beds &middot; {property.bathrooms} Baths &middot;{" "}
            {property.size} m&sup2;
          </p>
        ) : (
          <p className="small text-muted-soft mb-3">Land &middot; {property.size} m&sup2;</p>
        )}

        <Link to={`/properties/${property.id}`} className="btn btn-primary btn-sm w-100">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default PropertyCard;
