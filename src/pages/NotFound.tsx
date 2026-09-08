import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container my-5 py-5 text-center">
      <span className="section-eyebrow d-block mb-3">Error 404</span>
      <h1 className="mb-3">This property seems to have moved.</h1>
      <p className="text-muted-soft mb-4">
        The page you're looking for was removed, renamed, or never existed.
      </p>
      <div className="d-flex justify-content-center gap-2">
        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
        <Link to="/properties" className="btn btn-outline-primary">
          Browse properties
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
