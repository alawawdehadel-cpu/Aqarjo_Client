// Shared type definitions for a property listing.
// Kept in one place so every page/component agrees on the shape of the data.

export type ListingType = "sale" | "rent";
export type PropertyType = "apartment" | "house" | "land";
export type PropertyStatus = "approved" | "pending" | "rejected";

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  listingType: ListingType;
  propertyType: PropertyType;
  city: string;
  area: string;
  bedrooms: number | null; // null for land
  bathrooms: number | null; // null for land
  size: number; // in square meters
  image: string;
  status: PropertyStatus;
  featured: boolean;
  owner: string;
  ownerId?: number; // id of the user who owns this listing (from the backend)
  views: number;
  dateAdded: string; // ISO date string from the backend, e.g. "2026-08-12T00:00:00.000Z"
}
