import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-aqarjo pt-5 pb-4 mt-5">
      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <span className="footer-brand d-block mb-2">AqarJo</span>
            <p className="mb-0" style={{ maxWidth: "260px" }}>
              Find a place that feels right. A real estate marketplace for
              Jordan.
            </p>
          </div>

          <div className="col-6 col-md-2">
            <h6>Properties</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/properties?listingType=sale">Buy</Link>
              </li>
              <li>
                <Link to="/properties?listingType=rent">Rent</Link>
              </li>
              <li>
                <Link to="/properties?propertyType=land">Land</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6>Company</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/">About</Link>
              </li>
              <li>
                <Link to="/">Contact</Link>
              </li>
              <li>
                <Link to="/">Privacy</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h6>Contact</h6>
            <ul className="list-unstyled mb-0">
              <li>Amman, Jordan</li>
              <li>info@aqarjo.jo</li>
              <li>+962 6 000 0000</li>
            </ul>
          </div>
        </div>

        <hr className="border-light opacity-25 my-4" />
        <p className="mb-0 small">
          &copy; 2026 AqarJo &mdash; university prototype.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
