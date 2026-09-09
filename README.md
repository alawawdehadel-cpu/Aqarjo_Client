# 🏠 AqarJo Frontend (React + Vite)

> A real-estate marketplace frontend for browsing, selling, and renting
> apartments, houses, and land in Jordan — talks to the AqarJo Express
> backend through REST APIs.

## 🎯 Description

**Visitors** can:

- Browse properties
- Search/filter properties
- View Property Details
- View a real property location map
- Send inquiries

**Registered users** can:

- Register
- Login
- Logout
- Stay logged in after refresh
- Add properties
- Edit their own properties
- Delete their own properties
- View My Properties
- Save/remove Favorites
- Update Profile

**Admin users** can:

- Access Admin Dashboard
- View users
- Review properties
- Approve properties
- Reject properties
- Access protected administration features

> Public registration always creates a user with `role = "user"`. Admin
> permissions come from the role stored in the backend/database — there is
> no "sign up as admin" option.

## 👤 User Requirements

1. Visitors can browse property listings without an account.
2. Users can register using name, email, phone, and password.
3. Users can log in and log out.
4. Login sessions are maintained using an HTTP-only backend session cookie.
5. Registered users can create and manage their own property listings.
6. Registered users can save and remove favorite properties.
7. Registered users can update their profile.
8. Admin users can access the Admin Dashboard.
9. Property Details displays geographic location using OpenStreetMap.
10. The frontend communicates with the Express backend using the Fetch API.

## 🛠 Technologies

- React 19
- Vite
- TypeScript
- React Router
- Bootstrap 5
- Fetch API
- REST API communication
- Session-based authentication (HTTP-only cookie)
- OpenStreetMap map display

## 🚀 Getting Started

1. Clone the repository:

```
git clone https://github.com/alawawdehadel-cpu/Aqarjo_Client.git
cd Aqarjo_Client
npm install
```

2. Create a local `.env` file in the project root:

```env
VITE_SERVER_URL=http://localhost:5000
```

3. Start the dev server:

```
npm run dev
```

The app runs at `http://localhost:5173`.

4. Other useful commands:

```
npm run build   # production build
npm run lint    # run ESLint
```

## ⚙️ Environment Variables

| Variable | Purpose |
|----------|---------|
| `VITE_SERVER_URL` | Base URL of the AqarJo Express backend (e.g. `http://localhost:5000`). Read via `import.meta.env.VITE_SERVER_URL` in `src/api/api.ts`. |

`.env` is local only and is git-ignored — never commit it. `.env.example`
documents the required variable and stays tracked in the repo.

## 📁 Project Structure

```
Aqarjo_Client/
├── src/
│   ├── api/
│   │   └── api.ts               # every backend request lives here (Fetch API)
│   ├── components/
│   │   ├── DashboardSidebar.tsx
│   │   ├── EmptyState.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── PropertyCard.tsx
│   │   ├── PropertyForm.tsx
│   │   └── SearchBar.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Properties.tsx
│   │   ├── PropertyDetails.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── AddProperty.tsx
│   │   ├── EditProperty.tsx
│   │   ├── MyProperties.tsx
│   │   ├── Favorites.tsx
│   │   ├── Profile.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── NotFound.tsx
│   ├── types/
│   │   └── Property.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package.json
└── README.md
```

## 🧭 Application Routes

| Route | Access | Description |
|-------|--------|--------------|
| `/` | public | Home |
| `/properties` | public | Browse/search/filter properties |
| `/properties/:id` | public | Property details and map |
| `/login` | public | Login |
| `/register` | public | Register |
| `/add-property` | authenticated | Add property |
| `/edit-property/:id` | authenticated | Edit property |
| `/my-properties` | authenticated | Current user's properties |
| `/favorites` | authenticated | Saved properties |
| `/profile` | authenticated | Profile |
| `/admin` | admin | Admin Dashboard |
| `*` | public | Not Found |

Routing guards (`ProtectedRoute`/`AdminRoute` in `App.tsx`) only control
navigation — the real ownership and admin authorization checks are enforced
by the backend on every request.

## 🔐 Authentication

1. Login/Register sends credentials to Express.
2. The backend verifies the user/password (bcrypt).
3. The backend stores the user id in `req.session.userId`.
4. The browser receives an HTTP-only session cookie.
5. Frontend requests use `credentials: "include"` so that cookie is sent
   automatically.
6. `GET /api/auth/me` restores the logged-in user after a page refresh.
7. Logout destroys the backend session.

- React does **not** store authentication sessions in `localStorage`.
- React does **not** store passwords.
- `ProtectedRoute`/`AdminRoute` protect frontend navigation only — the
  backend performs the actual authorization checks.

## 🗺 Third-Party Location API

```
PropertyDetails → AqarJo backend → OpenStreetMap Nominatim → latitude/longitude → OpenStreetMap iframe map
```

- Nominatim is used for geocoding a property's area/city into coordinates.
- The frontend never calls Nominatim directly — only the backend does.
- The backend caches geocoding results in memory.
- The UI shows a fallback message if the location lookup fails.
- OpenStreetMap attribution is displayed below the map.

## 🔗 Backend Connection

| | URL |
|---|---|
| Frontend (dev) | `http://localhost:5173` |
| Backend (dev) | `http://localhost:5000` |

`src/api/api.ts` reads `import.meta.env.VITE_SERVER_URL` and builds every
request under `/api`, so the backend address is configurable without
touching the source code:

```ts
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";
const BASE_URL = `${SERVER_URL}/api`;
```
