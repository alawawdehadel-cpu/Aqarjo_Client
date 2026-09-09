import { NavLink } from "react-router-dom";

// Left-hand navigation shown on every "logged in" dashboard-style page
// (My Properties, Add Property, Favorites, Profile).
function DashboardSidebar() {
  return (
    <aside className="dashboard-sidebar">
      <nav className="nav flex-column">
        <NavLink to="/my-properties" className="nav-link">
          My Properties
        </NavLink>
        <NavLink to="/add-property" className="nav-link">
          Add Property
        </NavLink>
        <NavLink to="/favorites" className="nav-link">
          Favorites
        </NavLink>
        <NavLink to="/profile" className="nav-link">
          Profile
        </NavLink>
      </nav>
    </aside>
  );
}

export default DashboardSidebar;
