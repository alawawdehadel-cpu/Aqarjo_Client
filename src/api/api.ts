// Small helper file that wraps every call to the Express backend.
// Every function uses the Fetch API with async/await, the same style
// used throughout the rest of the app.
//
// This file only has the functions needed so far (Home page + favorites).
// More endpoints (property CRUD, inquiries, users, ...) are added in the
// branches that actually need them.
import type { Property } from "../types/Property";

const BASE_URL = "http://localhost:5000/api";

// Shared helper: turns a non-ok response into a thrown error, and
// returns the parsed JSON body otherwise.
async function handleResponse(response: Response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

// The data a form sends when creating/editing a property. Numbers are
// real numbers here (not strings), unlike the raw <input> values.
export interface PropertyInput {
  title: string;
  description: string;
  price: number;
  listingType: string;
  propertyType: string;
  city: string;
  area: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size: number;
  image: string;
  ownerId?: number;
}

// ---------- Properties ----------

export async function getProperties(): Promise<Property[]> {
  const response = await fetch(`${BASE_URL}/properties`);
  return handleResponse(response);
}

export async function getPropertyById(id: number | string): Promise<Property> {
  const response = await fetch(`${BASE_URL}/properties/${id}`);
  return handleResponse(response);
}

export async function getUserProperties(userId: number | string): Promise<Property[]> {
  const response = await fetch(`${BASE_URL}/properties/user/${userId}`);
  return handleResponse(response);
}

export async function updatePropertyStatus(
  id: number | string,
  status: string
): Promise<Property> {
  const response = await fetch(`${BASE_URL}/properties/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
}

export async function createProperty(property: PropertyInput): Promise<Property> {
  const response = await fetch(`${BASE_URL}/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(property),
  });
  return handleResponse(response);
}

export async function updateProperty(
  id: number | string,
  property: PropertyInput
): Promise<Property> {
  const response = await fetch(`${BASE_URL}/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(property),
  });
  return handleResponse(response);
}

export async function deleteProperty(id: number | string): Promise<void> {
  const response = await fetch(`${BASE_URL}/properties/${id}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}

// ---------- Favorites ----------
// Matches the endpoints in aqairjo_server/routes/favoriteRoutes.js:
//   GET    /api/favorites/:userId              -> favorited properties
//   POST   /api/favorites                       -> add a favorite
//   DELETE /api/favorites/:userId/:propertyId   -> remove a favorite

export async function getFavorites(userId: number | string): Promise<Property[]> {
  const response = await fetch(`${BASE_URL}/favorites/${userId}`);
  return handleResponse(response);
}

export async function addFavorite(userId: number | string, propertyId: number | string) {
  const response = await fetch(`${BASE_URL}/favorites`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, propertyId }),
  });
  return handleResponse(response);
}

export async function removeFavorite(
  userId: number | string,
  propertyId: number | string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/favorites/${userId}/${propertyId}`, {
    method: "DELETE",
  });
  await handleResponse(response);
}

// ---------- Inquiries ----------

export interface InquiryInput {
  propertyId: number | string;
  name: string;
  email: string;
  message: string;
}

export async function sendInquiry(inquiry: InquiryInput) {
  const response = await fetch(`${BASE_URL}/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(inquiry),
  });
  return handleResponse(response);
}

// ---------- Users ----------

export interface AppUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

export async function getUsers(): Promise<AppUser[]> {
  const response = await fetch(`${BASE_URL}/users`);
  return handleResponse(response);
}

export async function getUserById(id: number | string): Promise<AppUser> {
  const response = await fetch(`${BASE_URL}/users/${id}`);
  return handleResponse(response);
}

export async function updateUser(
  id: number | string,
  user: { name: string; email: string; phone: string; role: string }
): Promise<AppUser> {
  const response = await fetch(`${BASE_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  return handleResponse(response);
}
