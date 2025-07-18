import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg shadow-sm py-3" aria-label="Navigation principale">
        <div className="container d-flex justify-content-between align-items-center">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/paw-print.svg"
              alt="Logo Pet Foster Connect"
              height="40"
              className="me-2"
              loading="lazy"
            />
            <span className="fs-5 fw-semibold brand-text-header">Pet Foster Connect</span>
          </Link>
          <Navbar />
        </div>
      </nav>
    </>
  );
}