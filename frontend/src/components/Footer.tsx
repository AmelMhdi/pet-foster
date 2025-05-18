import { Link } from "react-router-dom"; 

export default function Footer() { 
  return (
    <>
      <footer className="footer-navbar mt-5">
        <div className="container text-center">
          <nav aria-label="Pied de page">
            <ul className="d-flex flex-row justify-content-center list-unstyled m-0">
              <li className="mx-3">
                <Link className="footer-link" to="/a-propos">À propos</Link>
              </li>
              <li className="mx-3">
                <Link className="footer-link" to="/mentions-legales">Mentions légales</Link>
              </li>
              <li className="mx-3">
                <Link className="footer-link" to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
          <p className="text-center footer-text mt-3 mb-0">
            &copy; {new Date().getFullYear()} Pet Foster Connect. Tous droits réservés.
          </p>
        </div>
      </footer>
    </>
  ); 
}