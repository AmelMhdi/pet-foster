import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container">
      
        {/* menu toggler for mobile  */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* collapsible navbar */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* left nav links */}

          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/a-propos">Associations</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/nos-animaux">Animaux</Link>
            </li>
          </ul>

          {/* right nav links */}
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/creer-compte">Créer un compte</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/se-connecter">Se connecter</Link>
            </li>
          </ul>

        </div>
      </div>

    </nav>
    
    </>
  )
}