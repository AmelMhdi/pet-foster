import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer-navbar mt-5 py-4">
      <div className="container">
        <nav aria-label="Pied de page">
          <ul className="footer-nav list-unstyled d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 m-0 p-0">
            <li>
              <Link className="footer-link" to="/a-propos">À propos</Link>
            </li>
            <li>
              <Link className="footer-link" to="/mentions-legales">Mentions légales</Link>
            </li>
            <li>
              <Link className="footer-link" to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <p className="footer-text text-center mt-3 mb-0">
          &copy; {new Date().getFullYear()} Pet Foster Connect. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}