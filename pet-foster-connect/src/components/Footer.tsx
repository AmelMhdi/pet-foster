import { Link } from "react-router-dom"; 

export default function Footer() { 
  return (
    <>
      <nav className="navbar footer-navbar mt-5">
        <div className="container justify-content-center">
          <ul className="navbar-nav flex-row">
            
            <li className="nav-item mx-1">
              <Link className="nav-link" to="/a-propos">
                  À propos
              </Link>
            </li>
            <li className="nav-item mx-3">
              <Link className="nav-link" to="/mentions-legales">
                  Mentions légales
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/contact">
                  Contact
              </Link>
            </li>
          </ul>
        </div>

        
      </nav>
    </>
  ); 
}
