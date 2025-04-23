import { Link } from "react-router-dom";

export default function Header() { 
  return (
    <>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          {/* Remplacé <a> par <Link> */}
          <Link className="navbar-brand" to="/">LOGO</Link>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent"
            aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/">Accueil</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">Associations</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/animal">Animaux</Link></li>
            </ul>
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item"><Link className="nav-link" to="/creer-compte">Créer un compte</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/se-connecter">Se connecter</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  ); 
}
