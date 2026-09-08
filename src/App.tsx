import { Routes, Route } from "react-router-dom";

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

// Every page shares the same Navbar + Footer, so we wrap each route's
// element in this small layout component instead of repeating it everywhere.
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/properties" element={<Layout><Properties /></Layout>} />
      <Route path="/properties/:id" element={<Layout><PropertyDetails /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/add-property" element={<Layout><AddProperty /></Layout>} />
      <Route path="/edit-property/:id" element={<Layout><EditProperty /></Layout>} />
      <Route path="/my-properties" element={<Layout><MyProperties /></Layout>} />
      <Route path="/favorites" element={<Layout><Favorites /></Layout>} />
      <Route path="/profile" element={<Layout><Profile /></Layout>} />
      <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}

export default App;
