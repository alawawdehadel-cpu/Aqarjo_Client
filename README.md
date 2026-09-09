# AqarJo Client

## Authentication

The app uses the backend's session-based authentication (see
`aqairjo_server`'s README for the full details). A few frontend-specific
notes:

- `src/api/api.ts` sends every request with `credentials: "include"` so the
  browser attaches the session cookie the backend sets on login/register.
- Login state lives in `src/App.tsx` (`currentUser`, loaded once on startup
  via `getCurrentUser()`) and is passed down to pages/components as props —
  there's no Redux or Context here, just `useState` + props.
- `/add-property`, `/edit-property/:id`, `/my-properties`, `/favorites` and
  `/profile` are wrapped in a small `ProtectedRoute` (in `App.tsx`) that
  redirects to `/login` if `currentUser` is `null`. `/admin` additionally
  requires `currentUser.role === "admin"`. This is a convenience for
  navigation only — the backend enforces the real authorization on every
  request regardless of what the frontend shows or hides.
- Favorites (`getFavorites`/`addFavorite`/`removeFavorite`) and "My
  Properties" (`getMyProperties`) no longer take a user id — the backend
  always uses the logged-in session user.

## Property location map (third-party API)

`Property Details` shows a real embedded map instead of a placeholder.
Once a property has loaded, the page calls
`getPropertyLocation(property.area, property.city)`
(`src/api/api.ts`), which hits the backend's `GET /api/location` route.
The backend geocodes that text through the OpenStreetMap Nominatim API and
returns `{ latitude, longitude, displayName, source }`; the frontend never
calls Nominatim directly. Those coordinates are then used to build a small
bounding box around the property and render it as an OpenStreetMap
`iframe` embed (no map library installed).

While the request is in flight it shows "Loading property location...";
if geocoding fails (or the backend is unreachable) it falls back to a
"Map location is currently unavailable." message and still shows the
property's area/city — the rest of the page is unaffected. Below the map,
the location is credited with a small "Location data © OpenStreetMap
contributors" link, as required by OpenStreetMap's attribution policy.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
