import { Link } from "react-router-dom";
import Navbar from "./Navbar";

export default function Header() {
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container d-flex align-items-center">
          <Link className="navbar-brand" to="/">
            <img
              src="/paw-print.svg"
              alt="logo"
              height="40"
              className="me-2"
              loading="lazy"
            />
            <span className="brand-text">Pet Foster Connect</span>
          </Link>
          <Navbar />
        </div>
      </nav>
    </>
  );
}