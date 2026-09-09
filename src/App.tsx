import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AddProperty from "./pages/AddProperty";
import EditProperty from "./pages/EditProperty";
import MyProperties from "./pages/MyProperties";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

import { getCurrentUser } from "./api/api";
import type { AppUser } from "./api/api";

// Every page shares the same Navbar + Footer, so we wrap each route's
// element in this small layout component instead of repeating it everywhere.
interface LayoutProps {
  children: React.ReactNode;
  currentUser: AppUser | null;
  onLogout: () => void;
}

function Layout({ children, currentUser, onLogout }: LayoutProps) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar currentUser={currentUser} onLogout={onLogout} />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}

// A simple route guard. If nobody is logged in, redirect to /login instead
// of rendering the page. We wait until the initial "am I logged in?" check
// (authLoading) has finished, otherwise a logged-in user would briefly get
// bounced to /login while that check is still in flight.
interface ProtectedRouteProps {
  currentUser: AppUser | null;
  authLoading: boolean;
  children: React.ReactNode;
}

function ProtectedRoute({ currentUser, authLoading, children }: ProtectedRouteProps) {
  if (authLoading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Same idea, but also requires the admin role. A logged-in non-admin is
// sent home instead of to the login page.
function AdminRoute({ currentUser, authLoading, children }: ProtectedRouteProps) {
  if (authLoading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // On first load, ask the backend whether the session cookie (if any)
  // still belongs to a logged-in user. This is what keeps someone logged
  // in after a page refresh.
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch {
        setCurrentUser(null);
      } finally {
        setAuthLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  function handleLogout() {
    setCurrentUser(null);
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <Home currentUser={currentUser} />
          </Layout>
        }
      />
      <Route
        path="/properties"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <Properties currentUser={currentUser} />
          </Layout>
        }
      />
      <Route
        path="/properties/:id"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <PropertyDetails currentUser={currentUser} />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <Login setCurrentUser={setCurrentUser} />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <Register setCurrentUser={setCurrentUser} />
          </Layout>
        }
      />
      <Route
        path="/add-property"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <ProtectedRoute currentUser={currentUser} authLoading={authLoading}>
              <AddProperty />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/edit-property/:id"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <ProtectedRoute currentUser={currentUser} authLoading={authLoading}>
              <EditProperty />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/my-properties"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <ProtectedRoute currentUser={currentUser} authLoading={authLoading}>
              <MyProperties />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/favorites"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <ProtectedRoute currentUser={currentUser} authLoading={authLoading}>
              <Favorites currentUser={currentUser} />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <ProtectedRoute currentUser={currentUser} authLoading={authLoading}>
              {/* ProtectedRoute already redirected away if currentUser were null,
                  so it's safe to treat it as non-null here. */}
              <Profile currentUser={currentUser as AppUser} setCurrentUser={setCurrentUser} />
            </ProtectedRoute>
          </Layout>
        }
      />
      <Route
        path="/admin"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <AdminRoute currentUser={currentUser} authLoading={authLoading}>
              <AdminDashboard />
            </AdminRoute>
          </Layout>
        }
      />
      <Route
        path="*"
        element={
          <Layout currentUser={currentUser} onLogout={handleLogout}>
            <NotFound />
          </Layout>
        }
      />
    </Routes>
  );
}

export default App;
