  import { Link } from "react-router-dom";
  import Navbar from "./Navbar";

  export default function Header() {
    return (
      <header className="header-container">
        <nav className="navbar navbar-expand-lg navbar-dark w-100" aria-label="Navigation principale">
          <div className="container">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img
                src="/paw-print.svg"
                alt="Logo Pet Foster Connect"
                height="40"
                className="me-2"
                loading="lazy"
              />
              <span className="brand-text-header">Pet Foster Connect</span>
            </Link>
            <Navbar />
          </div>
        </nav>
      </header>
    );
  }