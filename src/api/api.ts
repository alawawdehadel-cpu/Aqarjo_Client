// Small helper file that wraps every call to the Express backend.
// Every function uses the Fetch API with async/await, the same style
// used throughout the rest of the app.
import type { Property } from "../types/Property";

const BASE_URL = "http://localhost:5000/api";

// Shared fetch wrapper used by every function below.
//
// credentials: "include" is required so the browser sends the session
// cookie (set by /api/auth/login) along with every request — without it
// Express would never recognise the logged-in user.
//
// If the backend responds with an error, we try to read its { error }
// message so pages can show something useful ("Invalid email or
// password") instead of a generic failure.
async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.error) message = data.error;
    } catch {
      // Response wasn't JSON — keep the generic message above.
    }
    throw new Error(message);
  }

  // Some responses (like DELETE) have no body.
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

// The data a form sends when creating/editing a property. Numbers are
// real numbers here (not strings), unlike the raw <input> values.
// There is no ownerId here — the backend always uses the logged-in
// session user as the owner.
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
}

// ---------- Properties ----------

export async function getProperties(): Promise<Property[]> {
  return apiFetch("/properties");
}

export async function getPropertyById(id: number | string): Promise<Property> {
  return apiFetch(`/properties/${id}`);
}

// The logged-in user's own properties. The backend reads who "you" are
// from the session, so there's no user id to pass here.
export async function getMyProperties(): Promise<Property[]> {
  return apiFetch("/properties/mine");
}

export async function createProperty(property: PropertyInput): Promise<Property> {
  return apiFetch("/properties", {
    method: "POST",
    body: JSON.stringify(property),
  });
}

export async function updateProperty(
  id: number | string,
  property: PropertyInput
): Promise<Property> {
  return apiFetch(`/properties/${id}`, {
    method: "PUT",
    body: JSON.stringify(property),
  });
}

export async function updatePropertyStatus(
  id: number | string,
  status: string
): Promise<Property> {
  return apiFetch(`/properties/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}

export async function deleteProperty(id: number | string): Promise<void> {
  await apiFetch(`/properties/${id}`, { method: "DELETE" });
}

// ---------- Favorites ----------
// Matches the endpoints in aqairjo_server/routes/favoriteRoutes.js. All of
// them require a logged-in session — the backend always uses req.user.id,
// never an id from the frontend.

export async function getFavorites(): Promise<Property[]> {
  return apiFetch("/favorites");
}

export async function addFavorite(propertyId: number | string): Promise<void> {
  await apiFetch("/favorites", {
    method: "POST",
    body: JSON.stringify({ propertyId }),
  });
}

export async function removeFavorite(propertyId: number | string): Promise<void> {
  await apiFetch(`/favorites/${propertyId}`, { method: "DELETE" });
}

// ---------- Inquiries ----------

export interface InquiryInput {
  propertyId: number | string;
  name: string;
  email: string;
  message: string;
}

export async function sendInquiry(inquiry: InquiryInput) {
  return apiFetch("/inquiries", {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
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
  return apiFetch("/users");
}

export async function getUserById(id: number | string): Promise<AppUser> {
  return apiFetch(`/users/${id}`);
}

export async function updateUser(
  id: number | string,
  user: { name: string; email: string; phone: string; role: string }
): Promise<AppUser> {
  return apiFetch(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(user),
  });
}

// ---------- Location ----------
// Geocodes a property's area/city into map coordinates using the backend's
// /api/location route (which itself calls the OpenStreetMap Nominatim API).

export interface PropertyLocation {
  latitude: number;
  longitude: number;
  displayName: string;
  source: string;
}

export async function getPropertyLocation(
  area: string,
  city: string
): Promise<PropertyLocation> {
  const params = new URLSearchParams({ area, city });
  return apiFetch(`/location?${params.toString()}`);
}

// ---------- Auth ----------
// Session-based authentication: a successful register/login makes Express
// set a session cookie. The browser sends that cookie back automatically
// (because every call above uses credentials: "include"), so the backend
// always knows who is making the request.

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export async function registerUser(data: RegisterInput): Promise<AppUser> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(email: string, password: string): Promise<AppUser> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutUser(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

// Throws (401) if nobody is logged in — callers should catch that and
// treat it as "no current user", not show it as an error.
export async function getCurrentUser(): Promise<AppUser> {
  return apiFetch("/auth/me");
}
