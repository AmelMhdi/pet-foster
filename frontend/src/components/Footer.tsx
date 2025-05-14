import { Link } from "react-router-dom"; 

export default function Footer() { 
  return (
    <>
      <footer className="footer-navbar mt-5">
        <div className="container d-flex justify-content-center">
          <ul className="d-flex flex-row list-unstyled m-0">
            <li className="mx-3">
              <Link className="footer-link" to="/a-propos">
                  À propos
              </Link>
            </li>
            <li className="mx-3">
              <Link className="footer-link" to="/mentions-legales">
                  Mentions légales
              </Link>
            </li>
            <li className="mx-3">
              <Link className="footer-link" to="/contact">
                  Contact
              </Link>
            </li>
          </ul>
        </div>
      </footer>
    </>
  ); 
}
