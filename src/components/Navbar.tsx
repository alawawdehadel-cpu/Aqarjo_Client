import { Link, NavLink } from "react-router-dom";

// Main site navigation. Bootstrap's collapse component (loaded as a JS
// bundle in main.tsx) handles the mobile hamburger toggle for us, so this
// component only needs the standard data-bs-* attributes.
function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-aqarjo sticky-top">
      <div className="container">
        <Link className="navbar-brand navbar-brand-aqarjo" to="/">
          AqarJo
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/properties?listingType=sale">
                Buy
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/properties?listingType=rent">
                Rent
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/properties?propertyType=land">
                Land
              </Link>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/properties" end>
                Properties
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <Link className="btn btn-outline-primary btn-sm" to="/favorites">
              Favorites
            </Link>
            <Link className="btn btn-outline-primary btn-sm" to="/login">
              Login
            </Link>
            <Link className="btn btn-outline-primary btn-sm" to="/register">
              Register
            </Link>
            <Link className="btn btn-primary btn-sm" to="/add-property">
              + List Property
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
